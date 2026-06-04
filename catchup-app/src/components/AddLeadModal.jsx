import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from './ToastContext';

const AddLeadModal = ({ onClose, onAdd, currency }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [value, setValue] = useState('');
  const [targetDays, setTargetDays] = useState(4);
  const [customMessage, setCustomMessage] = useState('');
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !value) return;
    
    if (parseFloat(value) <= 0) {
      addToast('Deal value must be greater than 0', 'error');
      return;
    }
    
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0 }}>Add New Lead</h2>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '50%', transition: 'all 0.2s', width: '32px', height: '32px' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-col">
          <div className="form-grid">
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
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
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
