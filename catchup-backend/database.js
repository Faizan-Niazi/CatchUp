const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'catchup.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      value REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      daysWaiting INTEGER DEFAULT 0,
      autoFollowUp BOOLEAN DEFAULT 1,
      targetDays INTEGER DEFAULT 4,
      customMessage TEXT,
      projectName TEXT DEFAULT 'Project'
    )`);
    
    // Add column if it doesn't exist (for older databases)
    db.run(`ALTER TABLE leads ADD COLUMN targetDays INTEGER DEFAULT 4`, () => {});
    db.run(`ALTER TABLE leads ADD COLUMN customMessage TEXT`, () => {});
    db.run(`ALTER TABLE leads ADD COLUMN projectName TEXT DEFAULT 'Project'`, () => {});
    db.run(`ALTER TABLE settings ADD COLUMN currency TEXT DEFAULT '$'`, () => {});
    db.run(`ALTER TABLE settings ADD COLUMN smtpHost TEXT DEFAULT ''`, () => {});
    db.run(`ALTER TABLE settings ADD COLUMN smtpPort INTEGER DEFAULT 587`, () => {});
    db.run(`ALTER TABLE settings ADD COLUMN smtpUser TEXT DEFAULT ''`, () => {});
    db.run(`ALTER TABLE settings ADD COLUMN smtpPass TEXT DEFAULT ''`, () => {});

    // Add userId to existing tables
    db.run(`ALTER TABLE leads ADD COLUMN userId INTEGER`, () => {});
    db.run(`ALTER TABLE tasks ADD COLUMN userId INTEGER`, () => {});
    db.run(`ALTER TABLE activity_logs ADD COLUMN userId INTEGER`, () => {});
    db.run(`ALTER TABLE settings ADD COLUMN userId INTEGER`, () => {});

    // Add production saas columns
    db.run(`ALTER TABLE leads ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP`, () => {});
    db.run(`ALTER TABLE leads ADD COLUMN recoveredAt DATETIME`, () => {});
    db.run(`ALTER TABLE settings ADD COLUMN stripeSecretKey TEXT DEFAULT ''`, () => {});

    db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      text TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      followUpDelay INTEGER DEFAULT 4,
      emailTemplate TEXT DEFAULT 'Hi {name},\n\nJust checking in on the proposal I sent over. Let me know if you have any questions!\n\nBest,'
    )`, (err) => {
      // We don't seed default settings globally anymore since it's per-user.
    });
  }
});

module.exports = db;
