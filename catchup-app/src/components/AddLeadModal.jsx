import React, { useState } from 'react';

const AddLeadModal = ({ onClose, onAdd, currency }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [value, setValue] = useState('');
  const [targetDays, setTargetDays] = useState(4);
  const [customMessage, setCustomMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !value) return;
    
    onAdd({
      name,
      email,
      projectName,
      value: parseFloat(value),
      status: 'Pending',
      daysWaiting: 0,
      autoFollowUp: true,
      targetDays: parseInt(targetDays),
      customMessage
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <h2 style={{ marginBottom: '24px' }}>Add New Lead</h2>
        <form onSubmit={handleSubmit} className="flex-col">
          <div className="input-group">
            <label>Client Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Acme Corp" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Client Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="client@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Project Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Web Development Deal"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Deal Value ({currency})</label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="2500"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Follow-up Delay (Days)</label>
            <input 
              type="number" 
              className="input-field" 
              value={targetDays}
              onChange={(e) => setTargetDays(e.target.value)}
              min="1"
              required
            />
          </div>
          <div className="input-group">
            <label>Custom Message (Optional)</label>
            <textarea 
              className="input-field" 
              style={{ minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Leave blank to use the global template..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4" style={{ marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
