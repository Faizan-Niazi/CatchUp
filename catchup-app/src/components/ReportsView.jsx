import React from 'react';
import { PieChart, TrendingUp, DollarSign, Activity } from 'lucide-react';

const ReportsView = ({ leads, currency }) => {
  const totalRecovered = leads.filter(l => l.status === 'Recovered').reduce((sum, l) => sum + l.value, 0);
  const totalLost = leads.filter(l => l.status === 'Pending' || l.status === 'Contacted').reduce((sum, l) => sum + l.value, 0);
  const totalPipeline = totalRecovered + totalLost;
  
  const recoveryRate = totalPipeline > 0 ? Math.round((totalRecovered / totalPipeline) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="reports-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Recovery Analytics</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>A detailed breakdown of your pipeline performance.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text)' }}>
          <PieChart size={16} /> Export Report
        </button>
      </div>

      <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(28, 154, 89, 0.1)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
            <Activity size={32} color="var(--primary)" />
          </div>
          <div className="mobile-text-giant" style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>{recoveryRate}%</div>
          <div className="mobile-text-sm" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1rem' }}>Global Recovery Rate</div>
        </div>
        
        <div className="reports-grid-col-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px', gridColumn: 'span 2' }}>
          <div className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(28, 154, 89, 0.1)', padding: '12px', borderRadius: '12px' }}><DollarSign size={24} color="var(--primary)" /></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '4px' }}>Recovered Revenue</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Successfully saved deals</div>
                </div>
              </div>
              <div className="mobile-text-xl" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)' }}>{currency}{totalRecovered.toLocaleString()}</div>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--bg)', borderRadius: '50px', overflow: 'hidden' }}>
              <div style={{ width: `${recoveryRate}%`, height: '100%', background: 'var(--primary)', borderRadius: '50px' }}></div>
            </div>
          </div>
          
          <div className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px' }}><TrendingUp size={24} color="var(--danger)" style={{ transform: 'scaleY(-1)' }} /></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '4px' }}>At Risk Revenue</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending follow-ups in pipeline</div>
                </div>
              </div>
              <div className="mobile-text-xl" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>{currency}{totalLost.toLocaleString()}</div>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--bg)', borderRadius: '50px', overflow: 'hidden' }}>
              <div style={{ width: `${100 - recoveryRate}%`, height: '100%', background: 'var(--danger)', borderRadius: '50px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
