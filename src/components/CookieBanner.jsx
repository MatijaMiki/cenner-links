import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'cenner_cookie_consent';

// Returns current consent: null (undecided), 'all', or 'necessary'
export function getConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const { value, ts } = JSON.parse(raw);
    // Re-ask after 12 months per ePrivacy guidance
    if (Date.now() - ts > 365 * 24 * 60 * 60 * 1000) return null;
    return value;
  } catch { return null; }
}

function saveConsent(value) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, ts: Date.now() }));
}

export default function CookieBanner({ onConsentChange }) {
  const [show, setShow]         = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setShow(true);
  }, []);

  function accept() {
    saveConsent('all');
    onConsentChange?.('all');
    setShow(false);
  }

  function reject() {
    saveConsent('necessary');
    onConsentChange?.('necessary');
    setShow(false);
  }

  if (!show) return null;

  return (
    <>
      {/* Backdrop for details panel only */}
      {showDetails && (
        <div
          onClick={() => setShowDetails(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998 }}
        />
      )}

      {/* Main banner — bottom of screen */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 9999,
          background: 'rgba(10,10,10,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Text */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
            We use cookies
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            We use essential cookies to keep you logged in and optional analytics cookies
            to understand how people use Cenner Links. No advertising or tracking.{' '}
            <button
              onClick={() => setShowDetails(d => !d)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: 12, textDecoration: 'underline', fontFamily: 'Inter, sans-serif' }}
            >
              Details
            </button>{' '}·{' '}
            <Link to="/cookie-policy" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Buttons — equal visual weight (GDPR requirement) */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={reject}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'}
          >
            Reject non-essential
          </button>
          <button
            onClick={accept}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: '#4ADE80', border: '1px solid transparent',
              color: '#000', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              transition: 'opacity 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Accept all
          </button>
        </div>
      </div>

      {/* Details panel */}
      {showDetails && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10000, width: 'min(480px, calc(100vw - 32px))',
          background: '#111', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: '24px',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            Cookie details
          </div>

          <CookieCategory
            name="Strictly necessary"
            locked
            description="Authentication tokens that keep you logged in. These cannot be disabled as the site would not function without them."
            cookies={['portal_token — session authentication (localStorage)']}
          />

          <CookieCategory
            name="Analytics"
            optional
            description="Vercel Analytics counts page views and unique visitors. No personal data is stored, IP addresses are not logged, and data is never sold or shared."
            cookies={['Vercel Analytics — aggregate page-view counts, no PII']}
          />

          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 16, lineHeight: 1.7 }}>
            You can change your preference at any time via the cookie settings link in the footer.
            Your consent is valid for 12 months.
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
            <button
              onClick={reject}
              style={{
                padding: '7px 16px', borderRadius: 7, fontSize: 12.5, fontWeight: 600,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              Reject non-essential
            </button>
            <button
              onClick={accept}
              style={{
                padding: '7px 16px', borderRadius: 7, fontSize: 12.5, fontWeight: 600,
                background: '#4ADE80', border: 'none',
                color: '#000', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              Accept all
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function CookieCategory({ name, locked, optional, description, cookies }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', borderRadius: 10,
      padding: '14px 16px', marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{name}</div>
        {locked && (
          <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.07)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
            Always on
          </span>
        )}
        {optional && (
          <span style={{ fontSize: 10.5, color: 'rgba(74,222,128,0.9)', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
            Optional
          </span>
        )}
      </div>
      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 8 }}>
        {description}
      </div>
      {cookies.map(c => (
        <div key={c} style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', padding: '3px 0' }}>
          · {c}
        </div>
      ))}
    </div>
  );
}
