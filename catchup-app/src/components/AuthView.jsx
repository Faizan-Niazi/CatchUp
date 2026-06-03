import React, { useState } from 'react';
import { useToast } from './ToastContext';
import { Zap, ArrowLeft } from 'lucide-react';

const AuthView = ({ onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? '/api/login' : '/api/register';
    const payload = isLogin ? { email, password } : { name, email, password };
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      addToast(isLogin ? 'Welcome back!' : 'Account created successfully!', 'success');
      onAuthSuccess(data.token, data.user);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '24px', position: 'relative' }}>
      
      {onBack && (
        <button 
          onClick={onBack}
          style={{ position: 'absolute', top: '32px', left: '32px', display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
        >
          <ArrowLeft size={18} /> Back to Home
        </button>
      )}

      <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            <Zap className="logo-icon" size={40} color="var(--primary)" strokeWidth={3} />
            <h1 style={{ fontSize: '2.5rem' }}>CatchUp</h1>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>{isLogin ? 'Sign in to your dashboard' : 'Create your free account'}</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" className="input-field" required value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" className="input-field" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input-field" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', padding: '12px' }} disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthView;
