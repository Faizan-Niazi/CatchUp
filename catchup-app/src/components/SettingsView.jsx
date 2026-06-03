import React, { useState } from 'react';
import { Settings2, Mail, Server, Save, DollarSign } from 'lucide-react';

const SettingsView = ({ currentSettings, onSettingsSaved, token }) => {
  const [currency, setCurrency] = useState(currentSettings.currency || '$');
  const [followUpDelay, setFollowUpDelay] = useState(currentSettings.followUpDelay || 4);
  const [emailTemplate, setEmailTemplate] = useState(currentSettings.emailTemplate || '');
  const [smtpHost, setSmtpHost] = useState(currentSettings.smtpHost || '');
  const [smtpPort, setSmtpPort] = useState(currentSettings.smtpPort || 587);
  const [smtpUser, setSmtpUser] = useState(currentSettings.smtpUser || '');
  const [smtpPass, setSmtpPass] = useState(currentSettings.smtpPass || '');
  const [stripeSecretKey, setStripeSecretKey] = useState(currentSettings.stripeSecretKey || '');
  
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const handleSave = () => {
    setSaving(true);
    fetch('/api/settings', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ currency, followUpDelay: parseInt(followUpDelay), emailTemplate, smtpHost, smtpPort: parseInt(smtpPort), smtpUser, smtpPass, stripeSecretKey })
    })
      .then(res => res.json())
      .then(() => {
        setSaving(false);
        if (onSettingsSaved) onSettingsSaved();
      });
  };

  const tabs = [
    { id: 'general', label: 'General Preferences', icon: Settings2 },
    { id: 'email', label: 'Email Templates', icon: Mail },
    { id: 'payments', label: 'Payments Integration', icon: DollarSign },
    { id: 'smtp', label: 'SMTP Configuration', icon: Server },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '64px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Workspace Settings</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Manage your preferences and integrations.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '8px', fontWeight: 600 }} disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
                background: activeTab === tab.id ? 'var(--surface)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                border: activeTab === tab.id ? '1px solid var(--border)' : '1px solid transparent',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.02)' : 'none'
              }}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="dashboard-card" style={{ flex: 1, padding: '32px', minHeight: '400px' }}>
          {activeTab === 'general' && (
            <div className="fade-in">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>General Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Currency Symbol</label>
                  <input type="text" value={currency} onChange={e => setCurrency(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none', color: 'var(--text)', fontSize: '1rem', fontFamily: 'inherit', width: '100%' }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This symbol will be displayed across your dashboard and reports.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Default Follow-up Delay (Days)</label>
                  <input type="number" value={followUpDelay} onChange={e => setFollowUpDelay(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none', color: 'var(--text)', fontSize: '1rem', fontFamily: 'inherit', width: '100%' }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Number of days to wait before automatically following up on a pending deal.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="fade-in">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Email Templates</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Default Follow-up Message</label>
                <textarea style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none', color: 'var(--text)', fontSize: '1rem', minHeight: '200px', resize: 'vertical', fontFamily: 'inherit', width: '100%' }} value={emailTemplate} onChange={e => setEmailTemplate(e.target.value)} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Available variables: <code style={{background:'var(--bg)', padding:'2px 4px', borderRadius:'4px'}}>{'{name}'}</code> will insert the client's name dynamically.</p>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="fade-in">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Payments Integration</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Connect your Stripe account to generate real payment links for recovered deals.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Stripe Secret Key</label>
                <input type="password" placeholder="sk_test_..." value={stripeSecretKey} onChange={e => setStripeSecretKey(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none', color: 'var(--text)', fontSize: '1rem', fontFamily: 'inherit', width: '100%' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>We securely store this key to create Checkout Sessions on your behalf.</p>
              </div>
            </div>
          )}

          {activeTab === 'smtp' && (
            <div className="fade-in">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>SMTP Configuration</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Configure these to send actual emails. Leave blank to run the engine in simulation mode.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>SMTP Host</label>
                  <input type="text" placeholder="e.g. smtp.gmail.com" value={smtpHost} onChange={e => setSmtpHost(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none', color: 'var(--text)', fontSize: '1rem', fontFamily: 'inherit' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>SMTP Port</label>
                  <input type="number" placeholder="e.g. 587 or 465" value={smtpPort} onChange={e => setSmtpPort(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none', color: 'var(--text)', fontSize: '1rem', fontFamily: 'inherit' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>SMTP User (Email)</label>
                  <input type="text" placeholder="you@example.com" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none', color: 'var(--text)', fontSize: '1rem', fontFamily: 'inherit' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>SMTP Password (App Password)</label>
                  <input type="password" placeholder="••••••••" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none', color: 'var(--text)', fontSize: '1rem', fontFamily: 'inherit' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
