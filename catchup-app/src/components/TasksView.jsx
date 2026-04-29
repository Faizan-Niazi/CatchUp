import React, { useState, useEffect } from 'react';

const TasksView = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTaskText })
    })
      .then(res => res.json())
      .then(saved => {
        setTasks([saved, ...tasks]);
        setNewTaskText('');
      });
  };

  const toggleTask = (id, currentStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentStatus })
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Manual Tasks</h2>
      
      <form onSubmit={addTask} style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="e.g. Call John about the invoice..." 
          value={newTaskText} 
          onChange={e => setNewTaskText(e.target.value)} 
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary">Add Task</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.map(task => (
          <div key={task.id} className="flex justify-between items-center" style={{ padding: '16px', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)', opacity: task.completed ? 0.6 : 1 }}>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTask(task.id, task.completed)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none', fontSize: '1.05rem' }}>
                {task.text}
              </span>
            </div>
            <button 
              onClick={() => deleteTask(task.id)}
              style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ✕
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No pending tasks. You're all caught up!</p>
        )}
      </div>
    </div>
  );
};

export default TasksView;
