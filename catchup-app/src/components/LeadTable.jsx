import React, { useState } from 'react';

const LeadTable = ({ leads, toggleAutoFollowUp, deleteLead, onEdit, markAsPaid, currency }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="glass-panel" style={{ overflow: 'hidden' }}>
      <table>
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Client Name</th>
            <th>Value</th>
            <th>Days Waiting</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <React.Fragment key={lead.id}>
              <tr style={{ cursor: 'pointer' }} onClick={() => toggleRow(lead.id)}>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <span className={`chevron ${expandedRows.has(lead.id) ? 'expanded' : ''}`}>▶</span>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name)}&background=random&color=fff&rounded=true&size=40`} 
                        alt={lead.name} 
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      />
                      {lead.status === 'Pending' && (
                        <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#fff', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '8px', fontWeight: 700, border: '2px solid var(--bg)' }}>
                          Active
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1rem' }}>{lead.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>{lead.projectName || 'Project'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: lead.status === 'Recovered' ? 'var(--text-muted)' : 'var(--text)' }}>
                  {currency}{lead.value.toLocaleString()}
                </td>
                <td>{lead.daysWaiting} / {lead.targetDays || 4} days</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-4">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={lead.autoFollowUp}
                        onChange={() => toggleAutoFollowUp(lead.id)}
                      />
                      <span className="slider"></span>
                    </label>
                    {lead.status !== 'Recovered' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); markAsPaid(lead.id); }}
                        style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', padding: '4px', fontSize: '1.2rem' }}
                        title="Mark as Paid"
                      >
                        ✅
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(lead); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '4px', fontSize: '1.2rem' }}
                      title="Edit Lead"
                    >
                      ✎
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px', fontSize: '1rem' }}
                      title="Delete Lead"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
              {expandedRows.has(lead.id) && (
                <tr className="expanded-row">
                  <td colSpan="5">
                    <div className="expanded-content">
                      <div className="expanded-grid">
                        <div>
                          <div className="expanded-label">Email Address</div>
                          <div className="expanded-value">{lead.email}</div>
                        </div>
                        <div>
                          <div className="expanded-label">Current Status</div>
                          <div>
                            <span className={`status-badge ${lead.status === 'Pending' ? 'status-pending' : lead.status === 'Contacted' ? 'status-contacted' : 'status-recovered'}`}>
                              {lead.status}
                            </span>
                          </div>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <div className="expanded-label">Custom Message</div>
                          <div className="expanded-value" style={{ fontStyle: lead.customMessage ? 'normal' : 'italic', color: lead.customMessage ? 'var(--text)' : 'var(--text-muted)' }}>
                            {lead.customMessage || 'Using global default template.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '64px 32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '3rem', opacity: 0.5 }}>✨</div>
                  <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '1.2rem' }}>No leads found</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '300px' }}>Your pipeline is clear. Add a new lead to start recovering revenue!</div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
