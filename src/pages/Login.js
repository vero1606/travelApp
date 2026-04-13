// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.post('http://localhost:3001/api/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify({
        name: data.user.name,
        email: data.user.email,
        location: '',
        memberSince: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      }));
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #3b5bdb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: '#fff', borderRadius: 20,
        padding: '2.5rem 2rem', width: '100%', maxWidth: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌏</div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1e3a5f' }}>TravelApp</h1>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: '0.9rem' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: '0.7rem 1rem', color: '#c00', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#444', marginBottom: 6 }}>Email</label>
          <input type="email" placeholder="you@email.com" value={form.email} onChange={set('email')}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#3b5bdb'}
            onBlur={e => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#444', marginBottom: 6 }}>Password</label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={set('password')}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#3b5bdb'}
            onBlur={e => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%', padding: '0.85rem',
          background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a5f, #3b5bdb)',
          color: '#fff', border: 'none', borderRadius: 10,
          fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.88rem', color: '#888' }}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={{ color: '#3b5bdb', fontWeight: 600, cursor: 'pointer' }}>
            Sign up
          </span>
        </p>

        <p onClick={() => navigate('/')} style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem', color: '#aaa', cursor: 'pointer' }}>
          ← Back to Dashboard
        </p>
      </div>
    </div>
  );
}

export default Login;