import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PhonePreview from '../components/PhonePreview.jsx';
import * as api from '../api.js';

export default function PublicPage() {
  const { slug } = useParams();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.getPublicPage(slug)
      .then(res => {
        if (res.error || !res.page) { setNotFound(true); }
        else setData(res);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    // Track page view
    api.trackEvent(slug, 'view', null);
  }, [slug]);

  function handleTrack(blockId, type) {
    api.trackEvent(slug, type, blockId);
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
      Loading…
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', gap: 12 }}>
      <div style={{ fontSize: 40 }}>🔗</div>
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Page not found</div>
      <div style={{ fontSize: 13, color: 'var(--text-3)' }}>cenner.hr/p/{slug} doesn't exist.</div>
      <a href="/" style={{ fontSize: 12, color: 'var(--green)', marginTop: 8 }}>Create your own →</a>
    </div>
  );

  const { page, blocks } = data;

  // Render the full bio page without the phone frame (it's the real page)
  const THEME_CLASSES = {
    dark:     { bg: '#09090F', color: '#F0F0FF', linkBg: '#14142A', linkBorder: 'transparent' },
    light:    { bg: '#F4F4FA', color: '#0D0D18', linkBg: '#fff',    linkBorder: 'transparent', linkShadow: '0 1px 4px rgba(0,0,0,0.08)' },
    cenner:   { bg: 'linear-gradient(160deg,#05120A,#100512)', color: '#F0F0FF', linkBg: 'rgba(74,222,128,0.08)', linkBorder: 'rgba(74,222,128,0.18)' },
    neon:     { bg: '#060612', color: '#F0F0FF', linkBg: 'rgba(244,114,182,0.08)', linkBorder: 'rgba(244,114,182,0.15)' },
    ivory:    { bg: '#FAF8F5', color: '#1A1410', linkBg: '#fff', linkBorder: '#E8E4DC' },
    midnight: { bg: 'linear-gradient(160deg,#060610,#0A0618)', color: '#E8E8FF', linkBg: 'rgba(255,255,255,0.06)', linkBorder: 'rgba(255,255,255,0.08)' },
  };

  const t = THEME_CLASSES[page.theme] || THEME_CLASSES.dark;
  const activeBlocks = (blocks || []).filter(b => b.active).sort((a, b) => a.order - b.order);

  const CTA_STYLES = {
    green: { background: 'linear-gradient(135deg,#4ADE80,#22C55E)', color: '#000' },
    pink:  { background: 'linear-gradient(135deg,#F472B6,#EC4899)', color: '#fff' },
    white: { background: '#fff', color: '#000' },
    glass: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' },
  };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.color, fontFamily: 'Inter,sans-serif', display: 'flex', justifyContent: 'center', padding: '40px 16px 60px' }}>
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Avatar */}
        <div style={{
          width: 90, height: 90, borderRadius: '50%',
          background: 'linear-gradient(135deg,#4ADE80,#F472B6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, marginBottom: 14,
        }}>{page.emoji || '🎨'}</div>

        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4, textAlign: 'center' }}>
          {page.name}
        </div>
        <div style={{ fontSize: 13, opacity: 0.45, marginBottom: 10, textAlign: 'center' }}>
          {page.handle}
        </div>
        {page.bio && (
          <div style={{ fontSize: 13, textAlign: 'center', lineHeight: 1.6, opacity: 0.6, marginBottom: 24, maxWidth: 300 }}>
            {page.bio}
          </div>
        )}

        {/* Blocks */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {activeBlocks.map(b => {
            if (b.type === 'link') return (
              <a key={b.id} href={b.url} target="_blank" rel="noreferrer"
                 onClick={() => handleTrack(b.id, 'click')}
                 style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 14, textDecoration: 'none', fontSize: 14, fontWeight: 550, background: t.linkBg, border: `1px solid ${t.linkBorder}`, color: t.color, boxShadow: t.linkShadow || 'none', transition: 'transform 0.12s', letterSpacing: '-0.01em' }}
                 onMouseEnter={e => e.currentTarget.style.transform = 'scale(0.98)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <span style={{ fontSize: 18 }}>{b.icon || '🔗'}</span>
                <span style={{ flex: 1, textAlign: 'center' }}>{b.title}</span>
                <span style={{ opacity: 0.4 }}>›</span>
              </a>
            );
            if (b.type === 'social') return (
              <div key={b.id} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', padding: '4px 0' }}>
                {(b.platforms || []).map(p => {
                  const icons = { instagram:'📸', twitter:'🐦', tiktok:'🎵', youtube:'▶️', linkedin:'💼', github:'💻', twitch:'🟣', spotify:'🎧' };
                  return (
                    <div key={p} style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, background: t.linkBg, border: `1px solid ${t.linkBorder}`, cursor: 'pointer' }}>
                      {icons[p] || '🔗'}
                    </div>
                  );
                })}
              </div>
            );
            if (b.type === 'cta') {
              const s = CTA_STYLES[b.variant] || CTA_STYLES.green;
              return (
                <button key={b.id} onClick={() => handleTrack(b.id, 'click')} style={{ ...s, width: '100%', padding: '14px 18px', border: s.border || 'none', borderRadius: 14, fontSize: 14, fontWeight: 650, cursor: 'pointer', fontFamily: 'Inter,sans-serif', letterSpacing: '-0.01em' }}>
                  {b.title}
                </button>
              );
            }
            if (b.type === 'text') return <div key={b.id} style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.55, textAlign: 'center', padding: '4px' }}>{b.title}</div>;
            if (b.type === 'header') return <div key={b.id} style={{ fontSize: 11, fontWeight: 650, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.35, alignSelf: 'flex-start', paddingTop: 8 }}>{b.title}</div>;
            return null;
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, opacity: 0.25 }}>
          <div style={{ width: 12, height: 12, background: 'linear-gradient(135deg,#4ADE80,#F472B6)', borderRadius: 3 }} />
          <span>Powered by Cenner</span>
        </div>
      </div>
    </div>
  );
}
