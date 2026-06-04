import React from 'react';
import { LayoutDashboard, Users, CheckSquare, BarChart3, Settings, Zap, Sun, Moon } from 'lucide-react';

const Sidebar = ({ theme, toggleTheme, currentView, setView, onLogout, user, isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <Zap className="logo-icon" size={32} color="var(--primary)" strokeWidth={3} />
          <h2>CatchUp</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-links">
          <li>
            <a href="#" className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setView('dashboard'); }}>
              <LayoutDashboard size={20} className="icon" /> Dashboard
            </a>
          </li>
          <li>
            <a href="#" className={`nav-link ${currentView === 'leads' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setView('leads'); }}>
              <Users size={20} className="icon" /> Leads
            </a>
          </li>
          <li>
            <a href="#" className={`nav-link ${currentView === 'tasks' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setView('tasks'); }}>
              <CheckSquare size={20} className="icon" /> Tasks
            </a>
          </li>
          <li>
            <a href="#" className={`nav-link ${currentView === 'reports' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setView('reports'); }}>
              <BarChart3 size={20} className="icon" /> Reports
            </a>
          </li>
          <li>
            <a href="#" className={`nav-link ${currentView === 'settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setView('settings'); }}>
              <Settings size={20} className="icon" /> Settings
            </a>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {theme === 'dark' ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
