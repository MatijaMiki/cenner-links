import { useNavigate, useLocation } from 'react-router-dom';

export default function Nav({ slug, published, onPublish, saving }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isBuilder   = pathname === '/';
  const isAnalytics = pathname === '/analytics';

  function handleCopy() {
    if (!slug) return;
    navigator.clipboard.writeText(`https://links.cenner.hr/p/${slug}`).catch(() => {});
  }

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      height: 52,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(0,0,0,0.95)',
      backdropFilter: 'blur(12px)',
      gap: 0,
      position: 'relative',
      zIndex: 10,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em', marginRight: 24 }}>
        <div style={{
          width: 22, height: 22,
          background: 'linear-gradient(135deg,#4ADE80,#F472B6)',
          borderRadius: 6, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#000',
        }}>C</div>
        Cenner Links
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2 }}>
        {[['/', 'Builder'], ['/analytics', 'Analytics']].map(([path, label]) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: (path === '/' ? isBuilder : isAnalytics) ? 'var(--text)' : 'var(--text-2)',
              cursor: 'pointer',
              border: 'none',
              background: (path === '/' ? isBuilder : isAnalytics) ? 'var(--surface-2)' : 'transparent',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s',
              letterSpacing: '-0.01em',
            }}
          >{label}</button>
        ))}
      </div>

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        {slug && (
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 10px',
              background: 'var(--surface)',
              border: '1px solid var(--border-2)',
              borderRadius: 7,
              fontSize: 11.5,
              color: 'var(--text-2)',
              cursor: 'pointer',
              fontFamily: 'Inter, monospace',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: published ? 'var(--green)' : 'var(--text-3)',
              flexShrink: 0,
            }} />
            links.cenner.hr/p/{slug}
          </button>
        )}

        <button
          onClick={onPublish}
          disabled={saving}
          style={{
            padding: '6px 14px',
            background: published ? 'transparent' : 'var(--green)',
            border: published ? '1px solid var(--border-2)' : 'none',
            borderRadius: 7,
            fontSize: 12.5,
            fontWeight: 650,
            color: published ? 'var(--text-2)' : '#000',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.01em',
            transition: 'all 0.15s',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving…' : published ? 'Unpublish' : 'Publish'}
        </button>
      </div>
    </nav>
  );
}
