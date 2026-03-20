import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api.js';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Enter your email and password'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await login(email.trim(), password);
      localStorage.setItem('portal_token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        width: 360, background: 'var(--surface)',
        border: '1px solid var(--border-2)',
        borderRadius: 16, padding: 32,
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <div style={{
            width: 28, height: 28, background: 'linear-gradient(135deg,#4ADE80,#F472B6)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: '#000',
          }}>C</div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>Cenner Links</span>
        </div>

        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>Sign in</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>
          Use your Cenner account to continue.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
              Email
            </div>
            <input
              className="inp"
              type="email"
              placeholder="you@cenner.hr"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              autoFocus
              autoComplete="email"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
              Password
            </div>
            <input
              className="inp"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password"
            />
          </div>

          {error && <div style={{ fontSize: 11.5, color: '#F87171', marginBottom: 10 }}>{error}</div>}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '9px 16px', fontSize: 13, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 20, lineHeight: 1.5 }}>
          Same account as <span style={{ color: 'var(--green)' }}>cenner.hr</span>
        </div>
      </div>
    </div>
  );
}
