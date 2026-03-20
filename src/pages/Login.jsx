import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!token.trim()) { setError('Paste your portal token'); return; }
    localStorage.setItem('portal_token', token.trim());
    navigate('/');
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
          Paste your Cenner portal token to continue.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Portal Token
            </div>
            <input
              className="inp"
              type="password"
              placeholder="eyJ…"
              value={token}
              onChange={e => { setToken(e.target.value); setError(''); }}
              autoFocus
            />
            {error && <div style={{ fontSize: 11.5, color: '#F87171', marginTop: 5 }}>{error}</div>}
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '9px 16px', fontSize: 13 }}
          >
            Continue
          </button>
        </form>

        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 20, lineHeight: 1.5 }}>
          Get your token from the Cenner portal → Settings → Developer.
        </div>
      </div>
    </div>
  );
}
