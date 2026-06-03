import React from 'react';

const MetricCard = ({ title, value, highlight, icon: Icon, trend = "+12%" }) => {
  return (
    <div className="metric-card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
        <span style={{ color: highlight ? 'var(--primary)' : 'var(--text-muted)' }}>
          {Icon && <Icon size={20} />}
        </span> 
        {title}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(28, 154, 89, 0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
          {trend}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
