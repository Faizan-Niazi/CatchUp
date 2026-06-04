import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from './ToastContext';

const EditLeadModal = ({ lead, onClose, onEdit, currency }) => {
  const [name, setName] = useState(lead.name);
  const [email, setEmail] = useState(lead.email);
  const [projectName, setProjectName] = useState(lead.projectName || '');
  const [value, setValue] = useState(lead.value);
  const [targetDays, setTargetDays] = useState(lead.targetDays || 4);
  const [customMessage, setCustomMessage] = useState(lead.customMessage || '');
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !value) return;
    
    if (parseFloat(value) <= 0) {
      addToast('Deal value must be greater than 0', 'error');
      return;
    }
    
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0 }}>Edit Lead</h2>
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
