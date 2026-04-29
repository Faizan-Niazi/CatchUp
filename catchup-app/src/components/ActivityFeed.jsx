import React, { useState, useEffect } from 'react';

const ActivityFeed = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = () => {
      fetch('http://localhost:5000/api/logs')
        .then(res => res.json())
        .then(data => setLogs(data))
        .catch(err => console.error("Failed to fetch logs", err));
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
      <h3 style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Robot Activity Log</h3>
      {logs.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent activity. Robot is sleeping...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {logs.map(log => {
            const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <li key={log.id} style={{ fontSize: '0.85rem', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '4px' }}>🤖 {time}</div>
                <div style={{ color: 'var(--text)' }}>{log.message}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed;
