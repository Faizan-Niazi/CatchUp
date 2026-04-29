const express = require('express');
const cors = require('cors');
const db = require('./database');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Get all leads
app.get('/api/leads', (req, res) => {
  db.all('SELECT * FROM leads ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    const formattedRows = rows.map(r => ({ ...r, autoFollowUp: !!r.autoFollowUp }));
    res.json(formattedRows);
  });
});

// Add a new lead
app.post('/api/leads', (req, res) => {
  const { name, email, value, status = 'Pending', daysWaiting = 0, autoFollowUp = true, targetDays = 4, customMessage = '', projectName = 'Project' } = req.body;
  const sql = `INSERT INTO leads (name, email, value, status, daysWaiting, autoFollowUp, targetDays, customMessage, projectName) VALUES (?,?,?,?,?,?,?,?,?)`;
  const params = [name, email, value, status, daysWaiting, autoFollowUp ? 1 : 0, targetDays, customMessage, projectName];
  
  db.run(sql, params, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, name, email, value, status, daysWaiting, autoFollowUp, targetDays, customMessage, projectName });
  });
});

// Toggle auto-follow-up OR full edit OR Status update
app.put('/api/leads/:id', (req, res) => {
  const { autoFollowUp, name, email, value, targetDays, customMessage, projectName, status } = req.body;
  
  if (status !== undefined && name === undefined) {
    // Only update status (e.g. Mark as Paid)
    const sql = `UPDATE leads SET status = ? WHERE id = ?`;
    db.run(sql, [status, req.params.id], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Updated', changes: this.changes });
    });
  } else if (name !== undefined) {
    // Full Edit
    const sql = `UPDATE leads SET name=?, email=?, value=?, targetDays=?, customMessage=?, projectName=? WHERE id=?`;
    db.run(sql, [name, email, value, targetDays, customMessage, projectName, req.params.id], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Updated', changes: this.changes });
    });
  } else if (autoFollowUp !== undefined) {
    // Just toggle
    const sql = `UPDATE leads SET autoFollowUp = ? WHERE id = ?`;
    db.run(sql, [autoFollowUp ? 1 : 0, req.params.id], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Updated', changes: this.changes });
    });
  } else {
    res.status(400).json({ error: 'No fields to update' });
  }
});

// Delete a lead
app.delete('/api/leads/:id', (req, res) => {
  db.run(`DELETE FROM leads WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Deleted', changes: this.changes });
  });
});

// -- TASKS API --
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows.map(r => ({...r, completed: !!r.completed})));
  });
});

app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  db.run(`INSERT INTO tasks (text, completed) VALUES (?, 0)`, [text], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, text, completed: false });
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const { completed } = req.body;
  db.run(`UPDATE tasks SET completed = ? WHERE id = ?`, [completed ? 1 : 0, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  db.run(`DELETE FROM tasks WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

// Get activity logs
app.get('/api/logs', (req, res) => {
  db.all('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 10', [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Get settings
app.get('/api/settings', (req, res) => {
  db.get('SELECT * FROM settings LIMIT 1', [], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(row || { followUpDelay: 4, emailTemplate: '', currency: '$', smtpHost: '', smtpPort: 587, smtpUser: '', smtpPass: '' });
  });
});

// Update settings
app.post('/api/settings', (req, res) => {
  const { followUpDelay, emailTemplate, currency = '$', smtpHost = '', smtpPort = 587, smtpUser = '', smtpPass = '' } = req.body;
  db.run(`UPDATE settings SET followUpDelay = ?, emailTemplate = ?, currency = ?, smtpHost = ?, smtpPort = ?, smtpUser = ?, smtpPass = ? WHERE id = (SELECT id FROM settings LIMIT 1)`, 
    [followUpDelay, emailTemplate, currency, smtpHost, smtpPort, smtpUser, smtpPass], 
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
  });
});

// Automation Engine (Runs every 10 seconds for demo purposes)
setInterval(() => {
  db.get('SELECT * FROM settings LIMIT 1', [], (err, settings) => {
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

    // 1. Increment days waiting
    db.run(`UPDATE leads SET daysWaiting = daysWaiting + 1 WHERE status = 'Pending' AND autoFollowUp = 1`, function(err) {
      if (err) console.error(err);
      
      // 2. Find leads
      db.all(`SELECT * FROM leads WHERE status = 'Pending' AND autoFollowUp = 1 AND daysWaiting >= targetDays`, [], (err, rows) => {
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
                from: `"CatchUp Robot" <${settings.smtpUser}>`,
                to: lead.email,
                subject: 'Following up on our deal',
                text: finalMessage
              });
              msg = `Real Email sent to ${lead.name}: "${snippet}"`;
              emailSuccess = true;
            } catch (err) {
              msg = `Email failed for ${lead.name}: ${err.message}`;
            }
          }
          
          db.run(`UPDATE leads SET status = 'Contacted' WHERE id = ?`, [lead.id], (err) => {
            if (!err) {
              db.run(`INSERT INTO activity_logs (message) VALUES (?)`, [msg]);
              console.log('🤖 ' + msg);
            }
          });
        });
      });
    });
  });
}, 10000);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
