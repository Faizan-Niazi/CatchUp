import React, { useState } from 'react';

const SettingsView = ({ currentSettings, onSettingsSaved }) => {
  const [currency, setCurrency] = useState(currentSettings.currency || '$');
  const [followUpDelay, setFollowUpDelay] = useState(currentSettings.followUpDelay || 4);
  const [emailTemplate, setEmailTemplate] = useState(currentSettings.emailTemplate || '');
  const [smtpHost, setSmtpHost] = useState(currentSettings.smtpHost || '');
  const [smtpPort, setSmtpPort] = useState(currentSettings.smtpPort || 587);
  const [smtpUser, setSmtpUser] = useState(currentSettings.smtpUser || '');
  const [smtpPass, setSmtpPass] = useState(currentSettings.smtpPass || '');
  
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    fetch('http://localhost:5000/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currency, followUpDelay: parseInt(followUpDelay), emailTemplate, smtpHost, smtpPort: parseInt(smtpPort), smtpUser, smtpPass })
    })
      .then(res => res.json())
      .then(() => {
        setSaving(false);
        if (onSettingsSaved) onSettingsSaved();
      });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>General Settings</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="input-group">
            <label>Currency Symbol</label>
            <input type="text" className="input-field" value={currency} onChange={e => setCurrency(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Default Follow-up Delay (Days)</label>
            <input type="number" className="input-field" value={followUpDelay} onChange={e => setFollowUpDelay(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>Email Templates</h2>
        <div className="input-group">
          <label>Default Follow-up Message</label>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Use {'{name}'} to insert the client's name.</p>
          <textarea className="input-field" style={{ minHeight: '150px', resize: 'vertical', fontFamily: 'inherit' }} value={emailTemplate} onChange={e => setEmailTemplate(e.target.value)} />
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '16px' }}>Real Email Configuration (SMTP)</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Configure these to send actual emails. Leave blank to run in simulation mode.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="input-group">
            <label>SMTP Host</label>
            <input type="text" className="input-field" placeholder="e.g. smtp.gmail.com" value={smtpHost} onChange={e => setSmtpHost(e.target.value)} />
          </div>
          <div className="input-group">
            <label>SMTP Port</label>
            <input type="number" className="input-field" placeholder="e.g. 587 or 465" value={smtpPort} onChange={e => setSmtpPort(e.target.value)} />
          </div>
          <div className="input-group">
            <label>SMTP User (Email)</label>
            <input type="text" className="input-field" placeholder="you@example.com" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} />
          </div>
          <div className="input-group">
            <label>SMTP Password (App Password)</label>
            <input type="password" className="input-field" placeholder="••••••••" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} />
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }} disabled={saving}>
        {saving ? 'Saving...' : 'Save All Settings'}
      </button>
    </div>
  );
};

export default SettingsView;
