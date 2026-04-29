import React, { useState } from 'react';

const EditLeadModal = ({ lead, onClose, onEdit, currency }) => {
  const [name, setName] = useState(lead.name);
  const [email, setEmail] = useState(lead.email);
  const [projectName, setProjectName] = useState(lead.projectName || '');
  const [value, setValue] = useState(lead.value);
  const [targetDays, setTargetDays] = useState(lead.targetDays || 4);
  const [customMessage, setCustomMessage] = useState(lead.customMessage || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !value) return;
    
    onEdit({
      name,
      email,
      projectName,
      value: parseFloat(value),
      targetDays: parseInt(targetDays),
      customMessage
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <h2 style={{ marginBottom: '24px' }}>Edit Lead</h2>
        <form onSubmit={handleSubmit} className="flex-col">
          <div className="input-group">
            <label>Client Name</label>
            <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Client Email</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Project Name</label>
            <input type="text" className="input-field" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Deal Value ({currency})</label>
            <input type="number" className="input-field" value={value} onChange={(e) => setValue(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Follow-up Delay (Days)</label>
            <input type="number" className="input-field" value={targetDays} onChange={(e) => setTargetDays(e.target.value)} min="1" required />
          </div>
          <div className="input-group">
            <label>Custom Message (Optional)</label>
            <textarea className="input-field" style={{ minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} />
          </div>
          
          <div className="flex gap-4" style={{ marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;
