import React from 'react';

const Sidebar = ({ theme, toggleTheme, currentView, setView }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <h2>CatchUp</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-links">
          <li>
            <a href="#" className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setView('dashboard'); }}>
              <span className="icon">🏠</span> Dashboard
            </a>
          </li>
          <li>
            <a href="#" className={`nav-link ${currentView === 'leads' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setView('leads'); }}>
              <span className="icon">👥</span> Leads
            </a>
          </li>
          <li>
            <a href="#" className={`nav-link ${currentView === 'tasks' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setView('tasks'); }}>
              <span className="icon">✓</span> Tasks
            </a>
          </li>
          <li>
            <a href="#" className={`nav-link ${currentView === 'reports' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setView('reports'); }}>
              <span className="icon">📈</span> Reports
            </a>
          </li>
          <li>
            <a href="#" className={`nav-link ${currentView === 'settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setView('settings'); }}>
              <span className="icon">⚙️</span> Settings
            </a>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <div className="sidebar-profile flex items-center gap-3">
          <img src="https://ui-avatars.com/api/?name=Admin&background=random&color=fff&rounded=true" alt="Admin" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admin User</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
