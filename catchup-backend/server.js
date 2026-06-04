const express = require('express');
const cors = require('cors');
const db = require('./database');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');
const path = require('path');

const app = express();
app.use(cors());

// --- STRIPE WEBHOOK ---
// Must be defined before express.json() to capture raw body for signature verification
app.post('/api/webhooks/stripe/:userId', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const userId = req.params.userId;

  if (!userId) return res.status(400).send('Missing user ID');

  db.get('SELECT stripeWebhookSecret FROM settings WHERE userId = ?', [userId], (err, settings) => {
    if (err || !settings || !settings.stripeWebhookSecret) {
      console.error(`Webhook error: No webhook secret found for user ${userId}`);
      return res.status(400).send('Webhook secret not configured');
    }

    try {
      const event = require('stripe').webhooks.constructEvent(req.body, sig, settings.stripeWebhookSecret);
      
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const leadId = session.metadata?.leadId;

        if (leadId) {
          db.run(`UPDATE leads SET status = 'Paid', recoveredAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?`, [leadId, userId], (err) => {
            if (!err) {
              db.run(`INSERT INTO activity_logs (userId, message) VALUES (?, ?)`, [userId, `Payment automatically processed via Stripe for Lead #${leadId}`]);
            }
          });
        }
      }

      res.json({received: true});
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });
});

app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'catchup-super-secret-key-123';

// Serve the frontend static files in production
app.use(express.static(path.join(__dirname, '../catchup-app/dist')));

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION API ---

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword], function(err) {
      if (err) return res.status(400).json({ error: 'Email already exists or invalid data' });
      const userId = this.lastID;
      // Create default settings for this user
      db.run(`INSERT INTO settings (userId, followUpDelay, emailTemplate) VALUES (?, 4, 'Hi {name},\n\nJust checking in on the proposal I sent over. Let me know if you have any questions!\n\nBest,')`, [userId]);
      
      const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: userId, name, email } });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

app.get('/api/me', authenticateToken, (req, res) => {
  db.get(`SELECT id, name, email FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

app.put('/api/profile', authenticateToken, (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  db.get(`SELECT * FROM users WHERE id = ?`, [req.user.id], async (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });

    let finalPassword = user.password;
    
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: 'Current password is required to change your password' });
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) return res.status(400).json({ error: 'Incorrect current password' });
      finalPassword = await bcrypt.hash(newPassword, 10);
    }

    db.get(`SELECT id FROM users WHERE email = ? AND id != ?`, [email, req.user.id], (err, existing) => {
      if (existing) return res.status(400).json({ error: 'Email is already in use' });

      db.run(`UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`, [name, email, finalPassword, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        const token = jwt.sign({ id: req.user.id, email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: req.user.id, name, email } });
      });
    });
  });
});

// --- LEADS API ---

app.get('/api/leads', authenticateToken, (req, res) => {
  db.all('SELECT * FROM leads WHERE userId = ? ORDER BY id DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    const formattedRows = rows.map(r => ({ ...r, autoFollowUp: !!r.autoFollowUp }));
    res.json(formattedRows);
  });
});

app.post('/api/leads', authenticateToken, (req, res) => {
  const { name, email, value, status = 'Pending', daysWaiting = 0, autoFollowUp = true, targetDays = 4, customMessage = '', projectName = 'Project' } = req.body;
  
  if (!name || !email || typeof value !== 'number' || value <= 0) {
    return res.status(400).json({ error: 'Invalid input data. Name, email, and a positive value are required.' });
  }

  const sql = `INSERT INTO leads (userId, name, email, value, status, daysWaiting, autoFollowUp, targetDays, customMessage, projectName) VALUES (?,?,?,?,?,?,?,?,?,?)`;
  const params = [req.user.id, name, email, value, status, daysWaiting, autoFollowUp ? 1 : 0, targetDays, customMessage, projectName];
  
  db.run(sql, params, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, userId: req.user.id, name, email, value, status, daysWaiting, autoFollowUp, targetDays, customMessage, projectName });
  });
});

app.put('/api/leads/:id', authenticateToken, (req, res) => {
  const { autoFollowUp, name, email, value, targetDays, customMessage, projectName, status } = req.body;
  const leadId = req.params.id;
  const userId = req.user.id;
  
  // Verify ownership
  db.get(`SELECT id FROM leads WHERE id = ? AND userId = ?`, [leadId, userId], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Lead not found or unauthorized' });

    if (status !== undefined && name === undefined) {
      const recoveredSql = status === 'Recovered' ? ', recoveredAt = CURRENT_TIMESTAMP' : '';
      db.run(`UPDATE leads SET status = ?${recoveredSql} WHERE id = ?`, [status, leadId], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Updated', changes: this.changes });
      });
    } else if (name !== undefined) {
      const sql = `UPDATE leads SET name=?, email=?, value=?, targetDays=?, customMessage=?, projectName=? WHERE id=?`;
      db.run(sql, [name, email, value, targetDays, customMessage, projectName, leadId], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Updated', changes: this.changes });
      });
    } else if (autoFollowUp !== undefined) {
      db.run(`UPDATE leads SET autoFollowUp = ? WHERE id = ?`, [autoFollowUp ? 1 : 0, leadId], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Updated', changes: this.changes });
      });
    } else {
      res.status(400).json({ error: 'No fields to update' });
    }
  });
});

app.delete('/api/leads/:id', authenticateToken, (req, res) => {
  db.run(`DELETE FROM leads WHERE id = ? AND userId = ?`, [req.params.id, req.user.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Deleted', changes: this.changes });
  });
});

app.post('/api/payment-link/:id', authenticateToken, (req, res) => {
  const leadId = req.params.id;
  db.get(`SELECT * FROM leads WHERE id = ? AND userId = ?`, [leadId, req.user.id], async (err, lead) => {
    if (err || !lead) return res.status(404).json({ error: 'Lead not found' });
    
    db.get('SELECT stripeSecretKey FROM settings WHERE userId = ?', [req.user.id], async (err, settings) => {
      try {
        const secretKey = (settings && settings.stripeSecretKey) ? settings.stripeSecretKey : process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
          return res.json({ url: `https://checkout.stripe.com/pay/cs_test_mock_${lead.id}?amount=${lead.value}` });
        }
        
        const customStripe = require('stripe')(secretKey);
        
        const session = await customStripe.checkout.sessions.create({
          payment_method_types: ['card'],
          metadata: { leadId: lead.id },
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: { name: `Payment for ${lead.projectName || 'Services'} - ${lead.name}` },
              unit_amount: Math.round(lead.value * 100),
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${req.headers.origin}?payment=success`,
          cancel_url: `${req.headers.origin}?payment=cancel`,
        });
        res.json({ url: session.url });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  });
});

// --- TASKS API ---

app.get('/api/tasks', authenticateToken, (req, res) => {
  db.all('SELECT * FROM tasks WHERE userId = ? ORDER BY id DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows.map(r => ({...r, completed: !!r.completed})));
  });
});

app.post('/api/tasks', authenticateToken, (req, res) => {
  const { text } = req.body;
  db.run(`INSERT INTO tasks (userId, text, completed) VALUES (?, ?, 0)`, [req.user.id, text], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, userId: req.user.id, text, completed: false });
  });
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  const { completed } = req.body;
  db.run(`UPDATE tasks SET completed = ? WHERE id = ? AND userId = ?`, [completed ? 1 : 0, req.params.id, req.user.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  db.run(`DELETE FROM tasks WHERE id = ? AND userId = ?`, [req.params.id, req.user.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- LOGS API ---

app.get('/api/logs', authenticateToken, (req, res) => {
  db.all('SELECT * FROM activity_logs WHERE userId = ? ORDER BY id DESC LIMIT 20', [req.user.id], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// --- ANALYTICS API ---

app.get('/api/analytics', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  db.all('SELECT * FROM leads WHERE userId = ?', [userId], (err, leads) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const totalRecovered = leads.filter(l => l.status === 'Recovered').reduce((acc, l) => acc + l.value, 0);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRecovered = leads.filter(l => l.status === 'Recovered' && l.recoveredAt && new Date(l.recoveredAt) >= sevenDaysAgo).reduce((acc, l) => acc + l.value, 0);
    
    const activeClients = leads.filter(l => l.status !== 'Recovered').length;
    
    const pendingValue = leads.filter(l => l.status === 'Pending').reduce((acc, l) => acc + l.value, 0);
    const forecastPayout = Math.round(pendingValue * 0.2);
    const forecastDeals = Math.round(leads.filter(l => l.status === 'Pending').length * 0.2);
    
    const totalRecoveredDeals = leads.filter(l => l.status === 'Recovered').length;
    const autoRecoveredDeals = leads.filter(l => l.status === 'Recovered' && l.autoFollowUp === 1).length;
    
    res.json({
      totalRecovered,
      recentRecovered,
      activeClients,
      forecastPayout,
      forecastDeals,
      totalRecoveredDeals,
      autoRecoveredDeals,
      totalLeads: leads.length
    });
  });
});

// --- SETTINGS API ---

app.get('/api/settings', authenticateToken, (req, res) => {
  db.get('SELECT * FROM settings WHERE userId = ? LIMIT 1', [req.user.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(row || { followUpDelay: 4, emailTemplate: '', currency: '$', smtpHost: '', smtpPort: 587, smtpUser: '', smtpPass: '', stripeSecretKey: '', stripeWebhookSecret: '' });
  });
});

app.post('/api/settings', authenticateToken, (req, res) => {
  const { followUpDelay, emailTemplate, currency = '$', smtpHost = '', smtpPort = 587, smtpUser = '', smtpPass = '', stripeSecretKey = '', stripeWebhookSecret = '' } = req.body;
  
  db.get('SELECT id FROM settings WHERE userId = ?', [req.user.id], (err, row) => {
    if (row) {
      db.run(`UPDATE settings SET followUpDelay=?, emailTemplate=?, currency=?, smtpHost=?, smtpPort=?, smtpUser=?, smtpPass=?, stripeSecretKey=?, stripeWebhookSecret=? WHERE userId=?`, 
        [followUpDelay, emailTemplate, currency, smtpHost, smtpPort, smtpUser, smtpPass, stripeSecretKey, stripeWebhookSecret, req.user.id], 
        function(err) {
          if (err) return res.status(400).json({ error: err.message });
          res.json({ success: true });
      });
    } else {
      db.run(`INSERT INTO settings (userId, followUpDelay, emailTemplate, currency, smtpHost, smtpPort, smtpUser, smtpPass, stripeSecretKey, stripeWebhookSecret) VALUES (?,?,?,?,?,?,?,?,?,?)`, 
        [req.user.id, followUpDelay, emailTemplate, currency, smtpHost, smtpPort, smtpUser, smtpPass, stripeSecretKey, stripeWebhookSecret], 
        function(err) {
          if (err) return res.status(400).json({ error: err.message });
          res.json({ success: true });
      });
    }
  });
});

// --- AUTOMATION ENGINE ---
setInterval(() => {
  // Loop through all users
  db.all('SELECT * FROM users', [], (err, users) => {
    if (err || !users) return;
    
    users.forEach(user => {
      // Get settings for each user
      db.get('SELECT * FROM settings WHERE userId = ?', [user.id], (err, settings) => {
        if (err || !settings) return;

        let transporter = null;
        if (settings.smtpHost && settings.smtpUser && settings.smtpPass) {
          transporter = nodemailer.createTransport({
            host: settings.smtpHost,
            port: settings.smtpPort,
            secure: settings.smtpPort == 465,
            auth: {
              user: settings.smtpUser,
              pass: settings.smtpPass
            }
          });
        }

        // 1. Increment days waiting for this user's leads
        db.run(`UPDATE leads SET daysWaiting = daysWaiting + 1 WHERE status = 'Pending' AND userId = ?`, [user.id], function(err) {
          if (err) return;
          
          // 2. Find leads for this user needing followup
          db.all(`SELECT * FROM leads WHERE status = 'Pending' AND autoFollowUp = 1 AND daysWaiting >= targetDays AND userId = ?`, [user.id], (err, rows) => {
            if (err) return;
            
            rows.forEach(async lead => {
              const templateToUse = (lead.customMessage && lead.customMessage.trim() !== '') ? lead.customMessage : settings.emailTemplate;
              const finalMessage = templateToUse.replace(/{name}/g, lead.name);
              
              let emailSuccess = false;
              let snippet = finalMessage.length > 25 ? finalMessage.substring(0, 25) + '...' : finalMessage;
              let msg = `Simulated email to ${lead.name}: "${snippet}"`;

              if (transporter) {
                try {
                  await transporter.sendMail({
                    from: `"${user.name}" <${settings.smtpUser}>`,
                    to: lead.email,
                    subject: 'Following up on our deal',
                    text: finalMessage
                  });
                  msg = `Real Email sent to ${lead.name}: "${snippet}"`;
                  emailSuccess = true;
                } catch (err) {
                  msg = `Email failed for ${lead.name}: ${err.message}`;
                  emailSuccess = false;
                }
              } else {
                // Simulated success
                emailSuccess = true;
              }
              
              if (emailSuccess) {
                db.run(`UPDATE leads SET status = 'Contacted' WHERE id = ?`, [lead.id], (err) => {
                  if (!err) {
                    db.run(`INSERT INTO activity_logs (userId, message) VALUES (?, ?)`, [user.id, msg]);
                    console.log(`[User ${user.id}] 🤖 ` + msg);
                  }
                });
              } else {
                db.run(`INSERT INTO activity_logs (userId, message) VALUES (?, ?)`, [user.id, msg]);
                console.log(`[User ${user.id}] ❌ ` + msg);
              }
            });
          });
        });
      });
    });
  });
}, 10000); // 10 seconds for demo

// For any other route, send the React index.html file
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../catchup-app/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
