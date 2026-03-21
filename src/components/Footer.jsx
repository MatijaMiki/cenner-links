import { Link, useNavigate } from 'react-router-dom';

const CONSENT_KEY = 'cenner_cookie_consent';

export default function Footer({ dark = true }) {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  function openCookieSettings() {
    localStorage.removeItem(CONSENT_KEY);
    window.location.reload();
  }

  const text  = dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.35)';
  const hover = dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.7)';
  const border= dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

  const linkStyle = {
    color: text, fontSize: 11.5, textDecoration: 'none',
    fontFamily: 'Inter, sans-serif', transition: 'color 0.15s',
    cursor: 'pointer', background: 'none', border: 'none', padding: 0,
  };

  return (
    <footer style={{
      borderTop: `1px solid ${border}`,
      padding: '14px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 10,
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Left: branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 16, height: 16, borderRadius: 4,
          background: 'linear-gradient(135deg,#4ADE80,#22C55E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 900, color: '#000', flexShrink: 0,
        }}>C</div>
        <span style={{ fontSize: 11, color: text, fontWeight: 500 }}>
          © {year} Cenner
        </span>
      </div>

      {/* Right: links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Terms',          to: '/terms' },
          { label: 'Privacy Policy', to: '/privacy' },
          { label: 'Cookie Policy',  to: '/cookie-policy' },
        ].map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            style={linkStyle}
            onMouseEnter={e => e.currentTarget.style.color = hover}
            onMouseLeave={e => e.currentTarget.style.color = text}
          >
            {label}
          </Link>
        ))}

        {/* Separator */}
        <span style={{ color: border, fontSize: 11 }}>·</span>

        <button
          onClick={openCookieSettings}
          style={linkStyle}
          onMouseEnter={e => e.currentTarget.style.color = hover}
          onMouseLeave={e => e.currentTarget.style.color = text}
        >
          Cookie settings
        </button>
      </nav>
    </footer>
  );
}
