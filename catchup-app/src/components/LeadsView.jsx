import React, { useState } from 'react';
import LeadTable from './LeadTable';

const LeadsView = ({ leads, toggleAutoFollowUp, deleteLead, onEdit, markAsPaid, currency }) => {
  const [search, setSearch] = useState('');

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.projectName && l.projectName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="glass-panel" style={{ padding: 0 }}>
      <div className="flex justify-between items-center" style={{ padding: '24px 24px 0 24px', marginBottom: '24px' }}>
        <h2>All Leads Master List</h2>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Search leads by name, email, or project..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '350px' }}
        />
      </div>
      <LeadTable 
        leads={filteredLeads} 
        toggleAutoFollowUp={toggleAutoFollowUp} 
        deleteLead={deleteLead} 
        onEdit={onEdit} 
        markAsPaid={markAsPaid} 
        currency={currency} 
      />
    </div>
  );
};

export default LeadsView;
