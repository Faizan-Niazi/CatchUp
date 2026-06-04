import React, { useState } from 'react';
import LeadTable from './LeadTable';
import { Search, Filter, Download } from 'lucide-react';

const LeadsView = ({ leads, toggleAutoFollowUp, deleteLead, onEdit, markAsPaid, onGeneratePaymentLink, currency, onAddLead }) => {
  const [search, setSearch] = useState('');

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.projectName && l.projectName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="leads-header-row" style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '4px' }}>Leads Database</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your entire pipeline and customer contacts.</p>
        </div>
        <div className="leads-actions-row" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', background: 'var(--bg)', padding: '10px 16px', borderRadius: '8px', width: '300px', border: '1px solid var(--border)' }}>
            <Search size={18} /> 
            <input 
              type="text" 
              placeholder="Search by name, email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontFamily: 'inherit', color: 'var(--text)' }} 
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text)' }}>
            <Filter size={16} /> Filters
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text)' }}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>
      <LeadTable 
        leads={filteredLeads} 
        toggleAutoFollowUp={toggleAutoFollowUp} 
        deleteLead={deleteLead} 
        onEdit={onEdit} 
        markAsPaid={markAsPaid} 
        onGeneratePaymentLink={onGeneratePaymentLink}
        currency={currency} 
        onAddLead={onAddLead}
      />
    </div>
  );
};

export default LeadsView;
