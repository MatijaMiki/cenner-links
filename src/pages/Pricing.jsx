import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api.js';

const PLANS = [
  {
    key: 'FREE',
    label: 'Free',
    price: '€0',
    period: 'forever',
    limit: '5 blocks',
    color: 'rgba(255,255,255,0.08)',
    border: 'var(--border-2)',
    badge: null,
    features: [
      '5 link blocks',
      'Custom theme & colors',
      'Background images',
      'Analytics (7 days)',
      'Cenner branding',
    ],
    cta: 'Current plan',
    ctaDisabled: true,
  },
  {
    key: 'PRO',
    label: 'Pro',
    price: '€5',
    period: '/month',
    limit: '10 blocks',
    color: 'rgba(74,222,128,0.06)',
    border: 'rgba(74,222,128,0.35)',
    badge: null,
    accent: '#4ADE80',
    features: [
      '10 link blocks',
      'Everything in Free',
      'Priority support',
      'Analytics (30 days)',
      'Remove Cenner branding',
    ],
    cta: 'Upgrade to Pro',
    ctaDisabled: false,
  },
  {
    key: 'ULTRA',
    label: 'Ultra',
    price: '€10',
    period: '/month',
    limit: 'Unlimited blocks',
    color: 'rgba(244,114,182,0.06)',
    border: 'rgba(244,114,182,0.35)',
    badge: 'Most popular',
    accent: '#F472B6',
    features: [
      'Unlimited link blocks',
      'Everything in Pro',
      'Custom domain (soon)',
      'Analytics (90 days)',
      'Early access to new features',
    ],
    cta: 'Upgrade to Ultra',
    ctaDisabled: false,
  },
];

export default function Pricing({ currentTier = 'free' }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [error, setError]   = useState('');

  async function handleUpgrade(plan) {
    const token = localStorage.getItem('portal_token');
    if (!token) { navigate('/login'); return; }
    setLoading(plan);
    setError('');
    try {
      const { url } = await api.createCheckout(plan);
      window.location.href = url;
    } catch (e) {
      setError(e.message || 'Failed to start checkout');
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading('portal');
    setError('');
    try {
      const { url } = await api.openPortal();
      window.location.href = url;
    } catch (e) {
      setError(e.message || 'Failed to open billing portal');
      setLoading(null);
    }
  }

  const tier = currentTier.toUpperCase();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Nav */}
      <nav style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        height: 52,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxSizing: 'border-box',
      }}>
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text)', fontWeight: 700, fontSize: 14,
          letterSpacing: '-0.01em', fontFamily: 'Inter,sans-serif',
        }}>
          <div style={{
            width: 22, height: 22, background: 'linear-gradient(135deg,#4ADE80,#22C55E)',
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 900, color: '#000',
          }}>C</div>
          Cenner Links
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {tier !== 'FREE' && (
            <button
              onClick={handlePortal}
              disabled={loading === 'portal'}
              style={{
                padding: '5px 12px', borderRadius: 7, border: '1px solid var(--border-2)',
                background: 'transparent', color: 'var(--text-2)', cursor: 'pointer',
                fontSize: 12.5, fontFamily: 'Inter,sans-serif',
              }}
            >
              {loading === 'portal' ? 'Loading…' : 'Manage subscription'}
            </button>
          )}
          <button onClick={() => navigate('/')} style={{
            padding: '5px 12px', borderRadius: 7, border: '1px solid var(--border-2)',
            background: 'transparent', color: 'var(--text-2)', cursor: 'pointer',
            fontSize: 12.5, fontFamily: 'Inter,sans-serif',
          }}>
            Back to builder
          </button>
        </div>
      </nav>

      <div style={{ width: '100%', maxWidth: 960, padding: '60px 24px', boxSizing: 'border-box' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-block',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--green)',
            background: 'rgba(74,222,128,0.08)',
            padding: '4px 12px', borderRadius: 99,
            marginBottom: 16,
          }}>
            Cenner Links
          </div>
          <h1 style={{
            margin: '0 0 12px', fontSize: 40, fontWeight: 800,
            letterSpacing: '-0.03em', color: 'var(--text)',
            lineHeight: 1.15,
          }}>
            Simple, transparent pricing
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: 'var(--text-3)', lineHeight: 1.6 }}>
            Start free. Upgrade when your audience grows.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 24,
            color: '#F87171', fontSize: 13, textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Plan cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {PLANS.map(plan => {
            const isCurrentPlan = tier === plan.key;
            const isDowngrade = (
              (tier === 'ULTRA' && plan.key === 'PRO') ||
              (tier !== 'FREE' && plan.key === 'FREE')
            );
            return (
              <div key={plan.key} style={{
                position: 'relative',
                background: isCurrentPlan ? plan.color : 'var(--surface)',
                border: `1px solid ${isCurrentPlan ? plan.border : 'var(--border-2)'}`,
                borderRadius: 16,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.2s',
              }}>
                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: plan.accent,
                    color: '#000', fontSize: 10.5, fontWeight: 700,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    padding: '3px 12px', borderRadius: 99,
                    whiteSpace: 'nowrap',
                  }}>
                    {plan.badge}
                  </div>
                )}

                {/* Tier label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span style={{
                    fontSize: 15, fontWeight: 700,
                    color: plan.accent || 'var(--text-2)',
                  }}>{plan.label}</span>
                  {isCurrentPlan && (
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: plan.accent ? `${plan.accent}22` : 'rgba(255,255,255,0.08)',
                      color: plan.accent || 'var(--text-3)',
                      padding: '2px 7px', borderRadius: 99,
                    }}>Active</span>
                  )}
                </div>

                {/* Price */}
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-3)', marginLeft: 4 }}>
                    {plan.period}
                  </span>
                </div>

                {/* Feature list */}
                <ul style={{ margin: '0 0 28px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.4 }}>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                        <circle cx="7.5" cy="7.5" r="7.5" fill={plan.accent ? `${plan.accent}20` : 'rgba(255,255,255,0.06)'} />
                        <path d="M4.5 7.5L6.5 9.5L10.5 5.5" stroke={plan.accent || '#888'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrentPlan ? (
                  <div style={{
                    textAlign: 'center', padding: '10px 0',
                    fontSize: 13, fontWeight: 600,
                    color: plan.accent || 'var(--text-3)',
                  }}>
                    Your current plan
                  </div>
                ) : isDowngrade ? (
                  <button
                    onClick={handlePortal}
                    disabled={loading === 'portal'}
                    style={{
                      width: '100%', padding: '11px 0',
                      background: 'transparent',
                      border: '1px solid var(--border-2)',
                      borderRadius: 9, color: 'var(--text-3)',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'Inter,sans-serif',
                    }}
                  >
                    {loading === 'portal' ? 'Loading…' : 'Manage subscription'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.key)}
                    disabled={!!loading}
                    style={{
                      width: '100%', padding: '11px 0',
                      background: plan.accent
                        ? `linear-gradient(135deg, ${plan.accent}, ${plan.key === 'PRO' ? '#22C55E' : '#EC4899'})`
                        : 'var(--surface-2)',
                      border: 'none',
                      borderRadius: 9,
                      color: plan.accent ? '#000' : 'var(--text-2)',
                      fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1,
                      fontFamily: 'Inter,sans-serif',
                      letterSpacing: '-0.01em',
                      transition: 'opacity 0.15s',
                    }}
                  >
                    {loading === plan.key ? 'Loading…' : plan.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', marginTop: 36, fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.6 }}>
          All plans billed monthly. Cancel anytime from the billing portal.
          Prices include VAT where applicable.{' '}
          <a href="mailto:support@cenner.hr" style={{ color: 'var(--green)', textDecoration: 'none' }}>Questions?</a>
        </p>
      </div>
    </div>
  );
}
