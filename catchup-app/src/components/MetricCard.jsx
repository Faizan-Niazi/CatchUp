import React from 'react';

const MetricCard = ({ title, value, subtitle, highlight }) => {
  return (
    <div className="metric-card glass-panel flex-col gap-2">
      <h3 style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>{title}</h3>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: highlight ? 'var(--primary)' : 'var(--text)' }}>
        {value}
      </div>
      {subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
  );
};

export default MetricCard;
