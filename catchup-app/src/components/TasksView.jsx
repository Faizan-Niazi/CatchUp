import React, { useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { CheckCircle2, Circle, Trash2, Plus, Clock, Inbox } from 'lucide-react';

const TasksView = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const { addToast } = useToast();

  const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    if (!token) return;
    fetch('/api/tasks', { headers: authHeaders })
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    fetch('/api/tasks', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ text: newTaskText })
    })
      .then(res => res.json())
      .then(saved => {
        setTasks([saved, ...tasks]);
        setNewTaskText('');
        addToast('Task added', 'success');
      })
      .catch(() => addToast('Failed to add task', 'error'));
  };

  const toggleTask = (id, currentStatus) => {
    fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ completed: !currentStatus })
    }).then(() => {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    }).catch(() => addToast('Failed to update task', 'error'));
  };

  const deleteTask = (id) => {
    fetch(`/api/tasks/${id}`, { method: 'DELETE', headers: authHeaders })
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id));
        addToast('Task deleted', 'success');
      })
      .catch(() => addToast('Failed to delete task', 'error'));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="tasks-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Action Items</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Track manual follow-ups and client commitments.</p>
        </div>
        <div style={{ background: 'var(--bg)', padding: '8px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} /> {tasks.filter(t => !t.completed).length} Pending Tasks
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Plus size={20} color="var(--primary)" />
        <form onSubmit={addTask} style={{ flex: 1, display: 'flex' }}>
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={newTaskText} 
            onChange={e => setNewTaskText(e.target.value)} 
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '1.05rem', padding: '12px 0', fontFamily: 'inherit', color: 'var(--text)' }}
          />
          <button type="submit" style={{ display: 'none' }}>Add</button>
        </form>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        {tasks.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'var(--bg)', padding: '24px', borderRadius: '50%' }}>
              <Inbox size={48} color="var(--text-muted)" opacity={0.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>All caught up!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>You have no pending tasks. Enjoy your day.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tasks.map((task, index) => (
              <div key={task.id} style={{ padding: '20px 24px', borderBottom: index < tasks.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s', background: task.completed ? 'var(--bg)' : 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <button onClick={() => toggleTask(task.id, task.completed)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: task.completed ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <span style={{ fontSize: '1.05rem', color: task.completed ? 'var(--text-muted)' : 'var(--text)', textDecoration: task.completed ? 'line-through' : 'none', fontWeight: task.completed ? 400 : 500, transition: 'all 0.2s' }}>
                    {task.text}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '8px', opacity: 0.5, transition: 'opacity 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.opacity = 1}
                  onMouseOut={e => e.currentTarget.style.opacity = 0.5}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksView;
