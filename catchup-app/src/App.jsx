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
import AuthView from './components/AuthView';
import { useToast } from './components/ToastContext';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  
  const [theme, setTheme] = useState('dark');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [settings, setSettings] = useState({ currency: '$', followUpDelay: 4, emailTemplate: '' });
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleAuthSuccess = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setLeads([]);
  };

  const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        const [leadsRes, settingsRes] = await Promise.all([
          fetch('/api/leads', { headers: authHeaders }),
          fetch('/api/settings', { headers: authHeaders })
        ]);
        if (leadsRes.ok && settingsRes.ok) {
          const leadsData = await leadsRes.json();
          const settingsData = await settingsRes.json();
          setLeads(leadsData);
          setSettings(settingsData);
        } else if (leadsRes.status === 401 || leadsRes.status === 403) {
          logout();
          addToast('Session expired, please log in again', 'error');
        }
      } catch (err) {
        console.error(err);
        addToast('Failed to connect to backend', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    const interval = setInterval(() => {
      if (token) {
        fetch('/api/leads', { headers: authHeaders })
          .then(res => {
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) logout();
            throw new Error('Auth failed');
          })
          .then(data => setLeads(data))
          .catch(() => {});
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [token, addToast]);

  const addLead = (newLeadData) => {
    fetch('/api/leads', { method: 'POST', headers: authHeaders, body: JSON.stringify(newLeadData) })
      .then(res => res.json())
      .then(savedLead => {
        setLeads([savedLead, ...leads]);
        addToast('Lead added successfully', 'success');
      })
      .catch(() => addToast('Failed to add lead', 'error'));
  };

  const deleteLead = (id) => {
    fetch(`/api/leads/${id}`, { method: 'DELETE', headers: authHeaders })
      .then(() => {
        setLeads(leads.filter(l => l.id !== id));
        addToast('Lead deleted', 'success');
      })
      .catch(() => addToast('Failed to delete lead', 'error'));
  };

  const editLead = (id, updatedData) => {
    fetch(`/api/leads/${id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(updatedData) })
      .then(() => {
        setLeads(leads.map(l => l.id === id ? { ...l, ...updatedData } : l));
        addToast('Lead updated', 'success');
      }).catch(() => addToast('Failed to update lead', 'error'));
  };

  const markAsPaid = (id) => {
    fetch(`/api/leads/${id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify({ status: 'Recovered' }) })
      .then(() => {
        setLeads(leads.map(l => l.id === id ? { ...l, status: 'Recovered' } : l));
        addToast('Marked as Paid! 🎉', 'success');
      }).catch(() => addToast('Action failed', 'error'));
  };

  const toggleAutoFollowUp = (id) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const newStatus = !lead.autoFollowUp;
    fetch(`/api/leads/${id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify({ autoFollowUp: newStatus }) })
      .then(() => {
        setLeads(leads.map(l => l.id === id ? { ...l, autoFollowUp: newStatus } : l));
        addToast(newStatus ? 'Auto follow-up enabled' : 'Auto follow-up disabled', 'success');
      }).catch(() => addToast('Action failed', 'error'));
  };

  const generatePaymentLink = async (id) => {
    try {
      const res = await fetch(`/api/payment-link/${id}`, { method: 'POST', headers: authHeaders });
      const data = await res.json();
      if (data.url) {
        await navigator.clipboard.writeText(data.url);
        addToast('Payment link copied to clipboard!', 'success');
      } else {
        throw new Error(data.error || 'Failed to generate link');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!token) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  const totalLost = leads.filter(l => l.status === 'Pending').reduce((sum, l) => sum + l.value, 0);
  const activeLeads = leads.filter(l => l.status !== 'Recovered').length;
  const recoveredCount = leads.filter(l => l.status === 'Recovered').length;

  return (
    <div className="app-container">
      <Sidebar theme={theme} toggleTheme={toggleTheme} currentView={currentView} setView={setCurrentView} onLogout={logout} user={user} />
      
      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ marginBottom: '8px', textTransform: 'capitalize' }}>{currentView}</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {currentView === 'dashboard' ? `Welcome back, ${user?.name}. Here is your revenue breakdown.` : 
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
                <LeadTable leads={leads.filter(l => l.status === 'Pending')} toggleAutoFollowUp={toggleAutoFollowUp} deleteLead={deleteLead} onEdit={setEditingLead} markAsPaid={markAsPaid} onGeneratePaymentLink={generatePaymentLink} currency={settings.currency} />
              </section>
              <aside className="feed-sidebar"><ActivityFeed token={token} /></aside>
            </div>
          </>
        )}
        
        {currentView === 'leads' && (
          <LeadsView leads={leads} toggleAutoFollowUp={toggleAutoFollowUp} deleteLead={deleteLead} onEdit={setEditingLead} markAsPaid={markAsPaid} onGeneratePaymentLink={generatePaymentLink} currency={settings.currency} />
        )}

        {currentView === 'tasks' && <TasksView token={token} />}

        {currentView === 'reports' && <ReportsView leads={leads} currency={settings.currency} />}

        {currentView === 'settings' && (
          <SettingsView 
            currentSettings={settings} 
            token={token}
            onSettingsSaved={() => {
              fetch('/api/settings', { headers: authHeaders }).then(res => res.json()).then(setSettings);
              addToast('Settings saved successfully', 'success');
            }} 
          />
        )}
      </main>

      {isModalOpen && <AddLeadModal onClose={() => setIsModalOpen(false)} onAdd={addLead} currency={settings.currency} />}
      {editingLead && <EditLeadModal lead={editingLead} onClose={() => setEditingLead(null)} onEdit={(data) => editLead(editingLead.id, data)} currency={settings.currency} />}
    </div>
  );
}

export default App;
