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
import LandingPageView from './components/LandingPageView';
import { useToast } from './components/ToastContext';
import { Search, Bell, LogOut, Plus, DollarSign, TrendingUp, Users, Target, CheckCircle, Activity, Box, ChevronDown, Menu, Zap, ArrowLeft } from 'lucide-react';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  
  const [showAuth, setShowAuth] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [settings, setSettings] = useState({ currency: '$', followUpDelay: 4, emailTemplate: '' });
  const [analytics, setAnalytics] = useState(null);
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
        const [leadsRes, settingsRes, analyticsRes] = await Promise.all([
          fetch('/api/leads', { headers: authHeaders }),
          fetch('/api/settings', { headers: authHeaders }),
          fetch('/api/analytics', { headers: authHeaders })
        ]);
        if (leadsRes.ok && settingsRes.ok && analyticsRes.ok) {
          const leadsData = await leadsRes.json();
          const settingsData = await settingsRes.json();
          const analyticsData = await analyticsRes.json();
          setLeads(leadsData);
          setSettings(settingsData);
          setAnalytics(analyticsData);
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
        Promise.all([
          fetch('/api/leads', { headers: authHeaders }),
          fetch('/api/analytics', { headers: authHeaders })
        ])
          .then(async ([leadsRes, analyticsRes]) => {
            if (leadsRes.ok && analyticsRes.ok) {
              setLeads(await leadsRes.json());
              setAnalytics(await analyticsRes.json());
            } else if (leadsRes.status === 401 || leadsRes.status === 403) {
              logout();
            }
          })
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
        addToast('Marked as Paid!', 'success');
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
    if (showAuth) {
      return <AuthView onAuthSuccess={handleAuthSuccess} onBack={() => setShowAuth(false)} />;
    } else {
      return <LandingPageView onLoginClick={() => setShowAuth(true)} />;
    }
  }

  const totalLost = leads.filter(l => l.status === 'Pending').reduce((sum, l) => sum + l.value, 0);
  const activeLeads = leads.filter(l => l.status !== 'Recovered').length;
  const recoveredCount = leads.filter(l => l.status === 'Recovered').length;
  
  const totalRecoveredVal = analytics ? analytics.totalRecovered : 0;
  const recentRecoveredVal = analytics ? analytics.recentRecovered : 0;
  const forecastPayout = analytics ? analytics.forecastPayout : 0;
  const forecastDeals = analytics ? analytics.forecastDeals : 0;
  const autoRecoveredDeals = analytics ? analytics.autoRecoveredDeals : 0;
  
  const autoRecoveryRate = recoveredCount > 0 ? Math.round((autoRecoveredDeals / recoveredCount) * 100) : 0;

  return (
    <div className="app-container">
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <Sidebar theme={theme} toggleTheme={toggleTheme} currentView={currentView} setView={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }} onLogout={logout} user={user} isOpen={isMobileMenuOpen} />
      
      <div className="mobile-header">
        <div className="logo" style={{ gap: '8px' }}>
          <Zap className="logo-icon" size={28} color="var(--primary)" strokeWidth={3} />
          <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.05em' }}>CatchUp</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 0 }}>
          <Menu size={28} />
        </button>
      </div>

      <main className="main-content">
        <header className="top-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', background: 'var(--surface)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          {isMobileSearchOpen ? (
            <div className="mobile-search-active">
              <button onClick={() => setIsMobileSearchOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                <ArrowLeft size={20} />
              </button>
              <input type="text" placeholder="Search everywhere..." autoFocus style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontFamily: 'inherit', color: 'var(--text)', fontSize: '1rem' }} />
            </div>
          ) : (
            <>
              <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', background: 'var(--bg)', padding: '10px 16px', borderRadius: '50px', width: '350px' }}>
                <div onClick={() => setIsMobileSearchOpen(true)} style={{ display: 'flex', cursor: 'pointer' }}><Search size={18} /></div> 
                <input type="text" placeholder="Search leads, tasks, reports..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontFamily: 'inherit', color: 'var(--text)' }} />
              </div>
              <div className="top-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <button className="btn btn-primary" style={{ borderRadius: '50px', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }} onClick={() => setIsModalOpen(true)}>
                  <Plus size={18} /> New Lead
                </button>
                <Bell size={20} style={{ color: 'var(--text)', cursor: 'pointer' }} />
                <div className="profile-menu" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {(user?.name || 'User').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name || 'User'}</div>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </div>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }} title="Log out">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          )}
        </header>

        <div className="dashboard-title" style={{ marginBottom: '24px' }}>
          <h1 className="mobile-text-lg" style={{ marginBottom: '8px', textTransform: 'capitalize', fontSize: '1.5rem', fontWeight: 700 }}>{currentView}</h1>
          <p className="mobile-text-sm" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {currentView === 'dashboard' ? `Welcome back! Here's what's happening today.` : 
             currentView === 'settings' ? 'Manage your preferences.' :
             currentView === 'leads' ? 'View and manage your entire pipeline.' :
             currentView === 'tasks' ? 'Track your manual follow-ups.' : 'Analyze your recovery performance.'}
          </p>
        </div>

        {currentView === 'dashboard' && (
          <div className="dashboard-grid">
            <section className="dashboard-row-4">
              <MetricCard title="Total Leads" value={leads.length} icon={Box} trend={leads.length > 0 ? "Active" : ""} />
              <MetricCard title="Unrecovered" value={`${settings.currency}${totalLost.toLocaleString()}`} icon={Activity} highlight={true} />
              <MetricCard title="Recovered" value={`${settings.currency}${totalRecoveredVal.toLocaleString()}`} icon={DollarSign} trend={recentRecoveredVal > 0 ? "Trending Up" : ""} />
              <MetricCard title="Active Clients" value={activeLeads} icon={Users} trend="Live" />
            </section>

            <section className="dashboard-row-2">
              <div className="dashboard-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>AI Forecast <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'help' }} title="Based on a 20% estimated recovery probability for pending leads.">ⓘ</span></h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}><Target size={16} /> Expected Recovery</div>
                    <div className="mobile-text-xl" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{forecastDeals} Deals</div>
                    <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600 }}>Based on pipeline size</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}><DollarSign size={16} /> Forecast Payout</div>
                    <div className="mobile-text-xl" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{settings.currency}{forecastPayout.toLocaleString()}</div>
                    <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600 }}>Expected realization</div>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px' }}>Recovery Impact</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                  <div className="mobile-text-xl" style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{autoRecoveredDeals}</div>
                  <div className="mobile-text-sm" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Deals saved automatically via email</div>
                </div>
                <div style={{ width: '100%', background: 'var(--bg)', height: '10px', borderRadius: '50px', marginBottom: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${autoRecoveryRate}%`, background: 'var(--primary)', height: '100%', borderRadius: '50px' }}></div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '24px', fontWeight: 500 }}>{autoRecoveryRate}% of total recoveries</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(28, 154, 89, 0.1)', padding: '8px', borderRadius: '50%' }}><CheckCircle size={20} color="var(--primary)" /></div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{recoveredCount - autoRecoveredDeals}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Manual Recoveries</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(28, 154, 89, 0.1)', padding: '8px', borderRadius: '50%' }}><CheckCircle size={20} color="var(--primary)" /></div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{activeLeads}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Currently Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="dashboard-row-2">
              <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>7-Day Recovery Trend</h3>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mobile-text-xl" style={{ fontWeight: 700, fontSize: '1.2rem' }}>{settings.currency}{recentRecoveredVal.toLocaleString()}</div>
                    <div className="mobile-text-sm" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Recent Rescues</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', borderRadius: '8px', border: '1px dashed var(--border)', minHeight: '120px' }}>
                  <TrendingUp size={48} color={recentRecoveredVal > 0 ? "var(--primary)" : "var(--text-muted)"} opacity={recentRecoveredVal > 0 ? 1 : 0.3} />
                </div>
              </div>

              <div className="dashboard-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '24px' }}>Account Health Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>Stripe Connection</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{settings.stripeSecretKey ? 'Connected API Key' : 'No key configured'}</div>
                    </div>
                    {settings.stripeSecretKey ? (
                      <div style={{ background: 'rgba(28, 154, 89, 0.15)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 }}>Valid</div>
                    ) : (
                      <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 }}>Action Required</div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>SMTP Email Sync</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{settings.smtpUser ? 'Real emails active' : 'Simulation mode only'}</div>
                    </div>
                    {settings.smtpUser ? (
                      <div style={{ background: 'rgba(28, 154, 89, 0.15)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 }}>Valid</div>
                    ) : (
                      <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 }}>Warning</div>
                    )}
                  </div>

                </div>
              </div>
            </section>
          </div>
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
            user={user}
            onProfileUpdated={handleAuthSuccess}
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
