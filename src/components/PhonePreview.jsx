import { SOCIAL_META } from '../constants.js';

const THEME_CLASSES = {
  dark:     { bg: '#09090F', color: '#F0F0FF', linkBg: '#14142A', linkBorder: 'transparent', socBg: '#14142A' },
  light:    { bg: '#F4F4FA', color: '#0D0D18', linkBg: '#fff', linkBorder: 'transparent', socBg: '#fff', linkShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  cenner:   { bg: 'linear-gradient(160deg,#05120A,#100512)', color: '#F0F0FF', linkBg: 'rgba(74,222,128,0.08)', linkBorder: 'rgba(74,222,128,0.18)', socBg: 'rgba(74,222,128,0.08)', socBorder: 'rgba(74,222,128,0.18)' },
  neon:     { bg: '#060612', color: '#F0F0FF', linkBg: 'rgba(244,114,182,0.08)', linkBorder: 'rgba(244,114,182,0.15)', socBg: 'rgba(244,114,182,0.08)', socBorder: 'rgba(244,114,182,0.15)' },
  ivory:    { bg: '#FAF8F5', color: '#1A1410', linkBg: '#fff', linkBorder: '#E8E4DC', socBg: '#fff', socBorder: '#E8E4DC' },
  midnight: { bg: 'linear-gradient(160deg,#060610,#0A0618)', color: '#E8E8FF', linkBg: 'rgba(255,255,255,0.06)', linkBorder: 'rgba(255,255,255,0.08)', socBg: 'rgba(255,255,255,0.06)', socBorder: 'rgba(255,255,255,0.08)' },
};

const CTA_STYLES = {
  green: { background: 'linear-gradient(135deg,#4ADE80,#22C55E)', color: '#000' },
  pink:  { background: 'linear-gradient(135deg,#F472B6,#EC4899)', color: '#fff' },
  white: { background: '#fff', color: '#000' },
  glass: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' },
};

function BioLink({ block, t, onTrack }) {
  const lk = {
    display: 'flex', alignItems: 'center', gap: 9,
    padding: '11px 14px', borderRadius: 11,
    fontSize: 12, fontWeight: 550, cursor: 'pointer',
    letterSpacing: '-0.01em', width: '100%',
    textDecoration: 'none', transition: 'transform 0.12s',
    background: t.linkBg || 'transparent',
    border: `1px solid ${t.linkBorder || 'transparent'}`,
    color: t.color,
    boxShadow: t.linkShadow || 'none',
  };
  return (
    <a href={block.url || '#'} style={lk} target="_blank" rel="noreferrer"
       onClick={() => onTrack && onTrack(block.id, 'click')}>
      <span style={{ fontSize: 15, flexShrink: 0 }}>{block.icon || '🔗'}</span>
      <span style={{ flex: 1, textAlign: 'center' }}>{block.title}</span>
      <span style={{ fontSize: 11, opacity: 0.4 }}>›</span>
    </a>
  );
}

function BioSocial({ block, t }) {
  const platforms = block.platforms || [];
  return (
    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'center', padding: '4px 0' }}>
      {platforms.map(p => {
        const m = SOCIAL_META[p] || { icon: '🔗' };
        return (
          <div key={p} title={p} style={{
            width: 40, height: 40, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, cursor: 'pointer',
            background: t.socBg || t.linkBg,
            border: `1px solid ${t.socBorder || t.linkBorder || 'transparent'}`,
          }}>{m.icon}</div>
        );
      })}
    </div>
  );
}

function BioCta({ block }) {
  const s = CTA_STYLES[block.variant] || CTA_STYLES.green;
  return (
    <button style={{
      ...s, width: '100%', padding: '12px 14px',
      border: s.border || 'none', borderRadius: 11,
      fontSize: 12, fontWeight: 650, cursor: 'pointer',
      letterSpacing: '-0.01em',
    }}>{block.title}</button>
  );
}

export default function PhonePreview({ page, blocks, onTrackEvent }) {
  if (!page) return null;
  const t = THEME_CLASSES[page.theme] || THEME_CLASSES.dark;

  const activeBlocks = (blocks || []).filter(b => b.active);

  return (
    <div style={{
      width: 300, height: 600, borderRadius: 38,
      border: '7px solid #242436',
      background: '#111122',
      overflow: 'hidden',
      boxShadow: '0 0 0 1px #2E2E48, 0 50px 100px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.03)',
      flexShrink: 0,
    }}>
      {/* Dynamic island */}
      <div style={{
        width: 80, height: 24, background: '#0A0A18',
        borderRadius: '0 0 18px 18px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 8, height: 8, background: '#1A1A2A', borderRadius: '50%' }} />
      </div>

      {/* Scrollable content */}
      <div style={{ height: 'calc(100% - 24px)', overflowY: 'auto', scrollbarWidth: 'none' }}>
        <div style={{
          minHeight: '100%', padding: '20px 14px 28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: t.bg, color: t.color,
          transition: 'background 0.3s, color 0.3s',
        }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg,#4ADE80,#F472B6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, marginBottom: 10, flexShrink: 0,
          }}>{page.emoji || '🎨'}</div>

          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 3, textAlign: 'center' }}>
            {page.name}
          </div>
          <div style={{ fontSize: 11, opacity: 0.4, marginBottom: 8, textAlign: 'center' }}>
            {page.handle}
          </div>
          {page.bio && (
            <div style={{ fontSize: 11, textAlign: 'center', lineHeight: 1.55, opacity: 0.55, marginBottom: 18, maxWidth: 210 }}>
              {page.bio}
            </div>
          )}

          {/* Blocks */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeBlocks.map(b => {
              if (b.type === 'link')   return <BioLink   key={b.id} block={b} t={t} onTrack={onTrackEvent} />;
              if (b.type === 'social') return <BioSocial key={b.id} block={b} t={t} />;
              if (b.type === 'cta')    return <BioCta    key={b.id} block={b} />;
              if (b.type === 'text')   return (
                <div key={b.id} style={{ fontSize: 11, lineHeight: 1.6, opacity: 0.5, textAlign: 'center', padding: '2px 4px' }}>
                  {b.title}
                </div>
              );
              if (b.type === 'header') return (
                <div key={b.id} style={{ fontSize: 9.5, fontWeight: 650, letterSpacing: '0.09em', textTransform: 'uppercase', opacity: 0.35, alignSelf: 'flex-start', padding: '6px 2px 0' }}>
                  {b.title}
                </div>
              );
              return null;
            })}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 5, fontSize: 9.5, opacity: 0.25, flexShrink: 0 }}>
            <div style={{ width: 11, height: 11, background: 'linear-gradient(135deg,#4ADE80,#F472B6)', borderRadius: 3 }} />
            <span>Powered by Cenner</span>
          </div>
        </div>
      </div>
    </div>
  );
}
