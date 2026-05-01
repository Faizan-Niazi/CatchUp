import React from 'react';

const ReportsView = ({ leads, currency }) => {
  const totalRecovered = leads.filter(l => l.status === 'Recovered').reduce((sum, l) => sum + l.value, 0);
  const totalLost = leads.filter(l => l.status === 'Pending' || l.status === 'Contacted').reduce((sum, l) => sum + l.value, 0);
  const totalPipeline = totalRecovered + totalLost;
  
  const recoveryRate = totalPipeline > 0 ? Math.round((totalRecovered / totalPipeline) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '8px' }}>Recovery Analytics</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>A high-level view of your pipeline performance.</p>
        
        <div style={{ display: 'flex', gap: '32px', marginBottom: '48px' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '32px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: '#3b82f6', marginBottom: '8px' }}>{recoveryRate}%</div>
            <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Deal Recovery Rate</div>
          </div>
        </div>

        <h3 style={{ marginBottom: '16px' }}>Revenue Breakdown</h3>
        
        <div style={{ marginBottom: '24px' }}>
          <div className="flex justify-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>Recovered Revenue</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>{currency}{totalRecovered.toLocaleString()}</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: 'var(--bg)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${recoveryRate}%`, height: '100%', background: 'var(--success)', borderRadius: '6px' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>Unrecovered (Pending)</span>
            <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{currency}{totalLost.toLocaleString()}</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: 'var(--bg)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${100 - recoveryRate}%`, height: '100%', background: 'var(--danger)', borderRadius: '6px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
