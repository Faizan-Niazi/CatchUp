import React, { useState } from 'react';
import { ArrowUpDown, Filter, ChevronRight, CheckCircle, Link as LinkIcon, Edit2, Trash2, Inbox } from 'lucide-react';

const LeadTable = ({ leads, toggleAutoFollowUp, deleteLead, onEdit, markAsPaid, onGeneratePaymentLink, currency }) => {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Leads & Contacts</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)' }}>
            <ArrowUpDown size={14} /> Sort
          </button>
          <button style={{ padding: '6px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)' }}>
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'var(--surface)', minWidth: '800px' }}>
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Client Name</th>
            <th>Status</th>
            <th>Value</th>
            <th>Wait Time</th>
            <th>Auto-Pilot</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <React.Fragment key={lead.id}>
              <tr style={{ cursor: 'pointer' }} onClick={() => toggleRow(lead.id)}>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)' }} className="mobile-hide">
                  <div className={`chevron ${expandedRows.has(lead.id) ? 'expanded' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={18} />
                  </div>
                </td>
                <td data-label="Client Name">
                  <div className="flex items-center gap-3">
                    <div style={{ width: '32px', height: '32px', minWidth: '32px', flexShrink: 0, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                      {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>{lead.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>{lead.projectName || 'Project'}</div>
                    </div>
                  </div>
                </td>
                <td data-label="Status">
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '50px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    background: lead.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : lead.status === 'Recovered' ? 'rgba(28, 154, 89, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    color: lead.status === 'Pending' ? '#d97706' : lead.status === 'Recovered' ? 'var(--primary)' : '#2563eb'
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td data-label="Value" style={{ fontWeight: 600, color: lead.status === 'Recovered' ? 'var(--text-muted)' : 'var(--text)' }}>
                  {currency}{lead.value.toLocaleString()}
                </td>
                <td data-label="Wait Time" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, color: lead.daysWaiting >= lead.targetDays ? 'var(--danger)' : 'inherit' }}>{lead.daysWaiting}</span> / {lead.targetDays || 4} days
                </td>
                <td data-label="Auto-Pilot" onClick={(e) => e.stopPropagation()}>
                  <label className="toggle-switch" title="Auto-send emails via SMTP">
                    <input
                      type="checkbox"
                      checked={lead.autoFollowUp}
                      onChange={() => toggleAutoFollowUp(lead.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td data-label="Actions" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'right' }}>
                  <div className="mobile-actions-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    {lead.status !== 'Recovered' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); markAsPaid(lead.id); }}
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--success)', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                        title="Mark as Paid"
                        className="btn-icon-hover"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {lead.status !== 'Recovered' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onGeneratePaymentLink(lead.id); }}
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--primary)', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                        title="Copy Payment Link"
                        className="btn-icon-hover"
                      >
                        <LinkIcon size={16} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(lead); }}
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                      title="Edit Lead"
                      className="btn-icon-hover"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }}
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--danger)', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                      title="Delete Lead"
                      className="btn-icon-hover"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedRows.has(lead.id) && (
                <tr className="expanded-row">
                  <td colSpan="5">
                    <div className="expanded-content">
                      <div className="expanded-grid">
                        <div style={{ gridColumn: 'span 2' }}>
                          <div className="expanded-label">Email Address</div>
                          <div className="expanded-value">{lead.email}</div>
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
                  <div style={{ color: 'var(--primary)', opacity: 0.5, marginBottom: '8px' }}><Inbox size={48} /></div>
                  <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '1.2rem' }}>No leads found</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '300px' }}>Your pipeline is clear. Add a new lead to start recovering revenue!</div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
