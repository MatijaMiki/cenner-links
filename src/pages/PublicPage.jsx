import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SocialIcon from '../components/SocialIcon.jsx';
import Footer from '../components/Footer.jsx';
import { SOCIAL_META, FONT_OPTIONS, DEFAULT_THEME_CONFIG } from '../constants.js';
import * as api from '../api.js';

const CTA_STYLES = {
  green: { background: 'linear-gradient(135deg,#4ADE80,#22C55E)', color: '#000' },
  pink:  { background: 'linear-gradient(135deg,#F472B6,#EC4899)', color: '#fff' },
  white: { background: '#fff', color: '#000' },
  glass: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' },
};

function getFont(fontId) {
  return FONT_OPTIONS.find(f => f.id === fontId)?.stack || 'Inter, sans-serif';
}

function avatarRadius(shape) {
  if (shape === 'rounded') return '18px';
  if (shape === 'square')  return '4px';
  return '50%';
}

function getTextShadow(level) {
  if (level === 1) return '0 1px 8px rgba(0,0,0,0.65)';
  if (level === 2) return '0 1px 12px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.5)';
  if (level === 3) return '0 1px 20px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.95)';
  return 'none';
}

export default function PublicPage() {
  const { slug } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.getPublicPage(slug)
      .then(res => {
        if (res.error || !res.page) setNotFound(true);
        else setData(res);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    api.trackEvent(slug, 'view', null);
  }, [slug]);

  function handleTrack(blockId, type) {
    api.trackEvent(slug, type, blockId);
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
      Loading…
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', gap: 12 }}>
      <div style={{ fontSize: 40 }}>🔗</div>
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>Page not found</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>links.cenner.hr/p/{slug} doesn't exist.</div>
      <a href="https://links.cenner.hr" style={{ fontSize: 12, color: '#4ADE80', marginTop: 8 }}>Create your own →</a>
    </div>
  );

  const { page, blocks } = data;
  const tc = { ...DEFAULT_THEME_CONFIG, ...(page.themeConfig || {}) };
  const activeBlocks = (blocks || []).filter(b => b.active).sort((a, b) => a.order - b.order);
  const fontFamily = getFont(tc.font);
  const isLeft = tc.textAlign === 'left';
  const linkBg = tc.accentColor + '14';
  const linkBorder = tc.accentColor + '28';
  const textShadow = getTextShadow(tc.textShadow || 0);

  const contentBgStyle = (() => {
    const v = tc.contentBg || 'none';
    const s = tc.contentBgStrength ?? 0.5;
    const card = { borderRadius: 20, padding: '28px 24px' };
    if (v === 'glass') return { ...card, background: `rgba(0,0,0,${(s * 0.55).toFixed(2)})`, backdropFilter: `blur(${Math.round(s * 28)}px)`, WebkitBackdropFilter: `blur(${Math.round(s * 28)}px)` };
    if (v === 'dark')  return { ...card, background: `rgba(0,0,0,${(s * 0.85).toFixed(2)})` };
    if (v === 'light') return { ...card, background: `rgba(255,255,255,${(s * 0.22).toFixed(2)})` };
    return {};
  })();

  // Background style
  const bgStyle = tc.bgType === 'image'
    ? { backgroundImage: `url(${tc.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
    : tc.bgType === 'gradient'
      ? { background: tc.bg }
      : { backgroundColor: tc.bg };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', fontFamily, color: tc.textColor }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, ...bgStyle }} />
      {tc.bgOverlay > 0 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: `rgba(0,0,0,${tc.bgOverlay})` }} />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', padding: '48px 16px 72px' }}>
        <div style={{
          width: '100%', maxWidth: tc.maxWidth || 480,
          display: 'flex', flexDirection: 'column',
          alignItems: isLeft ? 'flex-start' : 'center',
          padding: `0 ${tc.contentPad - 14}px`,
          ...contentBgStyle,
        }}>

          {/* Avatar */}
          {page.avatarUrl ? (
            <img src={page.avatarUrl} alt=""
              style={{
                width: tc.avatarSize * 1.2, height: tc.avatarSize * 1.2,
                borderRadius: avatarRadius(tc.avatarShape),
                objectFit: 'cover', marginBottom: 16, flexShrink: 0,
              }}
            />
          ) : (
            <div style={{
              width: tc.avatarSize * 1.2, height: tc.avatarSize * 1.2,
              borderRadius: avatarRadius(tc.avatarShape),
              background: `linear-gradient(135deg,${tc.accentColor},#F472B6)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: Math.round(tc.avatarSize * 0.5),
              marginBottom: 16, flexShrink: 0,
            }}>{page.emoji || '🎨'}</div>
          )}

          {/* Name + KYC badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap', justifyContent: isLeft ? 'flex-start' : 'center' }}>
            <span style={{ fontSize: tc.nameSize * 1.4, fontWeight: 800, letterSpacing: '-0.03em', fontFamily, lineHeight: 1.1, textShadow }}>
              {page.name}
            </span>
            {page.kycVerified && (
              <span title="Identity Verified" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#F59E0B,#D97706)',
                fontSize: 13, fontWeight: 900, color: '#000',
                boxShadow: '0 2px 8px rgba(245,158,11,0.45)',
              }}>✓</span>
            )}
          </div>

          {/* Handle */}
          <div style={{ fontSize: 14, opacity: (tc.textOpacity ?? 0.65) * 0.7, marginBottom: 10, textAlign: isLeft ? 'left' : 'center', textShadow }}>
            {page.handle}
          </div>

          {/* Bio */}
          {page.bio && (
            <div style={{ fontSize: tc.bioSize * 1.2, textAlign: isLeft ? 'left' : 'center', lineHeight: 1.65, opacity: tc.textOpacity ?? 0.65, marginBottom: 28, maxWidth: isLeft ? '100%' : 320, fontFamily, textShadow }}>
              {page.bio}
            </div>
          )}

          {/* Blocks */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: tc.linkSpacing + 2 }}>
            {activeBlocks.map(b => {
              if (b.type === 'link') return (
                <a key={b.id} href={/^https?:\/\//i.test(b.url) ? b.url : '#'} target="_blank" rel="noreferrer"
                  onClick={() => handleTrack(b.id, 'click')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 18px', borderRadius: tc.linkRadius + 2,
                    textDecoration: 'none', fontSize: 15, fontWeight: 550,
                    background: linkBg, border: `1px solid ${linkBorder}`,
                    color: tc.linkText || tc.textColor,
                    letterSpacing: '-0.01em', fontFamily,
                    transition: 'transform 0.12s, opacity 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(0.985)'; e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.opacity = '1'; }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{b.icon || '🔗'}</span>
                  <span style={{ flex: 1, textAlign: isLeft ? 'left' : 'center' }}>{b.title}</span>
                  <span style={{ opacity: 0.4, fontSize: 18 }}>›</span>
                </a>
              );

              if (b.type === 'social') return (
                <div key={b.id} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: isLeft ? 'flex-start' : 'center', padding: '4px 0' }}>
                  {(b.platforms || []).map(p => {
                    const m = SOCIAL_META[p] || {};
                    return (
                      <div key={p} title={m.label || p} style={{
                        width: 52, height: 52, borderRadius: tc.linkRadius + 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        background: linkBg,
                        border: `1px solid ${linkBorder}`,
                        transition: 'transform 0.12s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(0.92)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                      >
                        <SocialIcon platform={p} size={22} color={m.color || tc.textColor} />
                      </div>
                    );
                  })}
                </div>
              );

              if (b.type === 'cta') {
                const s = CTA_STYLES[b.variant] || CTA_STYLES.green;
                return (
                  <button key={b.id} onClick={() => handleTrack(b.id, 'click')}
                    style={{ ...s, width: '100%', padding: '15px 18px', border: s.border || 'none', borderRadius: tc.linkRadius + 2, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily, letterSpacing: '-0.01em' }}>
                    {b.title}
                  </button>
                );
              }

              if (b.type === 'text') return (
                <div key={b.id} style={{ fontSize: 13, lineHeight: 1.65, opacity: tc.textOpacity ?? 0.65, textAlign: isLeft ? 'left' : 'center', padding: '4px', fontFamily }}>
    {b.title}
                </div>
              );

              if (b.type === 'header') return (
                <div key={b.id} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: (tc.textOpacity ?? 0.65) * 0.55, textAlign: isLeft ? 'left' : 'center', paddingTop: 10 }}>
                  {b.title}
                </div>
              );

              return null;
            })}
          </div>

          {/* View profile on Cenner */}
          {page.cennerUserId && (
            <a
              href={`https://cenner.hr/freelancers/${page.cennerUserId}`}
              target="_blank" rel="noreferrer"
              style={{
                marginTop: 32, display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 16px', borderRadius: tc.linkRadius + 2,
                textDecoration: 'none', fontSize: 13, fontWeight: 600,
                background: linkBg, border: `1px solid ${linkBorder}`,
                color: tc.textColor, opacity: 0.65, fontFamily,
                alignSelf: isLeft ? 'flex-start' : 'center',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.65'}
            >
              <div style={{ width: 16, height: 16, borderRadius: 4, background: 'linear-gradient(135deg,#4ADE80,#22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#000' }}>C</span>
              </div>
              View full profile on Cenner
            </a>
          )}

          {/* Footer — hidden for Pro/Ultra */}
          {!page.removeBranding && (
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, opacity: 0.3, alignSelf: isLeft ? 'flex-start' : 'center' }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: 'linear-gradient(135deg,#4ADE80,#22C55E)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#000', lineHeight: 1, letterSpacing: '-0.05em' }}>C</span>
              </div>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.02em' }}>Powered by Cenner</span>
            </div>
          )}
        </div>
      </div>
      <Footer dark={true} />
    </div>
  );
}
