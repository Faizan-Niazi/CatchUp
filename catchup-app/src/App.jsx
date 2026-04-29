import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import LeadTable from './components/LeadTable';
import AddLeadModal from './components/AddLeadModal';
import EditLeadModal from './components/EditLeadModal';
import ActivityFeed from './components/ActivityFeed';
import SettingsView from './components/SettingsView';
import LeadsView from './components/LeadsView';
import TasksView from './components/TasksView';
import ReportsView from './components/ReportsView';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [settings, setSettings] = useState({ currency: '$', followUpDelay: 4, emailTemplate: '' });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const fetchLeads = () => {
      fetch('http://localhost:5000/api/leads')
        .then(res => res.json())
        .then(data => setLeads(data))
        .catch(err => console.error(err));
    };
    const fetchSettings = () => {
      fetch('http://localhost:5000/api/settings')
        .then(res => res.json())
        .then(data => setSettings(data))
        .catch(err => console.error(err));
    };
    fetchLeads();
    fetchSettings();
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, []);

  const addLead = (newLeadData) => {
    fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLeadData)
    }).then(res => res.json()).then(savedLead => setLeads([savedLead, ...leads]));
  };

  const deleteLead = (id) => {
    setLeads(leads.filter(l => l.id !== id));
    fetch(`http://localhost:5000/api/leads/${id}`, { method: 'DELETE' });
  };

  const editLead = (id, updatedData) => {
    setLeads(leads.map(l => l.id === id ? { ...l, ...updatedData } : l));
    fetch(`http://localhost:5000/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
  };

  const markAsPaid = (id) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: 'Recovered' } : l));
    fetch(`http://localhost:5000/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Recovered' })
    });
  };

  const toggleAutoFollowUp = (id) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const newStatus = !lead.autoFollowUp;
    setLeads(leads.map(l => l.id === id ? { ...l, autoFollowUp: newStatus } : l));
    fetch(`http://localhost:5000/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autoFollowUp: newStatus })
    });
  };

  const totalLost = leads.filter(l => l.status === 'Pending').reduce((sum, l) => sum + l.value, 0);
  const activeLeads = leads.filter(l => l.status !== 'Recovered').length;
  const recoveredCount = leads.filter(l => l.status === 'Recovered').length;

  return (
    <div className="app-container">
      <Sidebar theme={theme} toggleTheme={toggleTheme} currentView={currentView} setView={setCurrentView} />
      
      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ marginBottom: '8px', textTransform: 'capitalize' }}>{currentView}</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {currentView === 'dashboard' ? 'Welcome back. Here is your revenue breakdown.' : 
               currentView === 'settings' ? 'Manage your preferences.' :
               currentView === 'leads' ? 'View and manage your entire pipeline.' :
               currentView === 'tasks' ? 'Track your manual follow-ups.' : 'Analyze your recovery performance.'}
            </p>
          </div>
          {['dashboard', 'leads'].includes(currentView) && (
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Lead</button>
          )}
        </header>

        {currentView === 'dashboard' && (
          <>
            <section className="metrics-grid">
              <MetricCard title="Unrecovered Revenue" value={`${settings.currency}${totalLost.toLocaleString()}`} subtitle="Currently pending follow-up" highlight={true} />
              <MetricCard title="Active Deals" value={activeLeads} subtitle="In your pipeline" />
              <MetricCard title="Auto-Recoveries" value={recoveredCount} subtitle="Deals saved automatically" />
            </section>
            <div className="dashboard-columns">
              <section className="leads-section glass-panel" style={{ padding: 0 }}>
                <div className="leads-header" style={{ padding: '24px 24px 0 24px' }}><h2>Pending Follow-ups</h2></div>
                <LeadTable leads={leads.filter(l => l.status === 'Pending')} toggleAutoFollowUp={toggleAutoFollowUp} deleteLead={deleteLead} onEdit={setEditingLead} markAsPaid={markAsPaid} currency={settings.currency} />
              </section>
              <aside className="feed-sidebar"><ActivityFeed /></aside>
            </div>
          </>
        )}
        
        {currentView === 'leads' && (
          <LeadsView leads={leads} toggleAutoFollowUp={toggleAutoFollowUp} deleteLead={deleteLead} onEdit={setEditingLead} markAsPaid={markAsPaid} currency={settings.currency} />
        )}

        {currentView === 'tasks' && <TasksView />}

        {currentView === 'reports' && <ReportsView leads={leads} currency={settings.currency} />}

        {currentView === 'settings' && (
          <SettingsView 
            currentSettings={settings} 
            onSettingsSaved={() => fetch('http://localhost:5000/api/settings').then(res => res.json()).then(setSettings)} 
          />
        )}
      </main>

      {isModalOpen && <AddLeadModal onClose={() => setIsModalOpen(false)} onAdd={addLead} currency={settings.currency} />}
      {editingLead && <EditLeadModal lead={editingLead} onClose={() => setEditingLead(null)} onEdit={(data) => editLead(editingLead.id, data)} currency={settings.currency} />}
    </div>
  );
}

export default App;
