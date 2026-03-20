import { SOCIAL_META, FONT_OPTIONS, DEFAULT_THEME_CONFIG } from '../constants.js';

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

function BioLink({ block, tc, onTrack }) {
  const linkBg = tc.accentColor + '14'; // ~8% opacity tint of accent
  return (
    <a href={block.url || '#'} target="_blank" rel="noreferrer"
      onClick={() => onTrack && onTrack(block.id, 'click')}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: `10px 14px`,
        borderRadius: tc.linkRadius,
        fontSize: 12, fontWeight: 550, cursor: 'pointer',
        letterSpacing: '-0.01em', width: '100%',
        textDecoration: 'none', transition: 'transform 0.12s',
        background: linkBg,
        border: `1px solid ${tc.accentColor}28`,
        color: tc.linkText || tc.textColor,
        fontFamily: getFont(tc.font),
      }}>
      <span style={{ fontSize: 15, flexShrink: 0 }}>{block.icon || '🔗'}</span>
      <span style={{ flex: 1, textAlign: tc.textAlign === 'left' ? 'left' : 'center' }}>{block.title}</span>
      <span style={{ fontSize: 11, opacity: 0.4 }}>›</span>
    </a>
  );
}

function BioSocial({ block, tc }) {
  const platforms = block.platforms || [];
  const socBg = tc.accentColor + '14';
  return (
    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: tc.textAlign === 'left' ? 'flex-start' : 'center', padding: '4px 0' }}>
      {platforms.map(p => {
        const m = SOCIAL_META[p] || { icon: '🔗' };
        return (
          <div key={p} title={p} style={{
            width: 40, height: 40, borderRadius: tc.linkRadius,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, cursor: 'pointer',
            background: socBg,
            border: `1px solid ${tc.accentColor}28`,
          }}>{m.icon}</div>
        );
      })}
    </div>
  );
}

function BioCta({ block, tc }) {
  const s = CTA_STYLES[block.variant] || CTA_STYLES.green;
  return (
    <button style={{
      ...s, width: '100%', padding: '12px 14px',
      border: s.border || 'none', borderRadius: tc.linkRadius,
      fontSize: 12, fontWeight: 650, cursor: 'pointer',
      letterSpacing: '-0.01em',
      fontFamily: getFont(tc.font),
    }}>{block.title}</button>
  );
}

export default function PhonePreview({ page, blocks, onTrackEvent }) {
  if (!page) return null;

  const tc = { ...DEFAULT_THEME_CONFIG, ...(page.themeConfig || {}) };

  // Build background style
  const bgStyle = tc.bgType === 'image'
    ? { backgroundImage: `url(${tc.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : tc.bgType === 'gradient'
      ? { background: tc.bg }
      : { backgroundColor: tc.bg };

  const activeBlocks = (blocks || []).filter(b => b.active);
  const fontFamily = getFont(tc.font);
  const isLeft = tc.textAlign === 'left';

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
      <div style={{ height: 'calc(100% - 24px)', overflowY: 'auto', scrollbarWidth: 'none', position: 'relative' }}>
        {/* Background layer */}
        <div style={{ position: 'absolute', inset: 0, ...bgStyle, transition: 'all 0.3s' }} />
        {/* Overlay */}
        {tc.bgOverlay > 0 && (
          <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${tc.bgOverlay})` }} />
        )}

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1,
          minHeight: '100%',
          padding: `${tc.contentPad}px ${tc.contentPad - 6}px 28px`,
          display: 'flex', flexDirection: 'column',
          alignItems: isLeft ? 'flex-start' : 'center',
          color: tc.textColor,
          fontFamily,
          transition: 'all 0.3s',
        }}>
          {/* Avatar */}
          <div style={{
            width: tc.avatarSize, height: tc.avatarSize,
            borderRadius: avatarRadius(tc.avatarShape),
            background: `linear-gradient(135deg,${tc.accentColor},#F472B6)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: Math.round(tc.avatarSize * 0.42),
            marginBottom: 10, flexShrink: 0,
            transition: 'all 0.3s',
          }}>{page.emoji || '🎨'}</div>

          {/* Name */}
          <div style={{
            fontSize: tc.nameSize, fontWeight: 700, letterSpacing: '-0.02em',
            marginBottom: 3, textAlign: isLeft ? 'left' : 'center',
            fontFamily, transition: 'all 0.3s',
          }}>{page.name}</div>

          {/* Handle */}
          <div style={{
            fontSize: 11, opacity: 0.45, marginBottom: 7,
            textAlign: isLeft ? 'left' : 'center',
          }}>{page.handle}</div>

          {/* Bio */}
          {page.bio && (
            <div style={{
              fontSize: tc.bioSize, textAlign: isLeft ? 'left' : 'center',
              lineHeight: 1.55, opacity: 0.6,
              marginBottom: 18, maxWidth: isLeft ? '100%' : 210,
              fontFamily, transition: 'all 0.3s',
            }}>{page.bio}</div>
          )}

          {/* Blocks */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: tc.linkSpacing }}>
            {activeBlocks.map(b => {
              if (b.type === 'link')   return <BioLink   key={b.id} block={b} tc={tc} onTrack={onTrackEvent} />;
              if (b.type === 'social') return <BioSocial key={b.id} block={b} tc={tc} />;
              if (b.type === 'cta')    return <BioCta    key={b.id} block={b} tc={tc} />;
              if (b.type === 'text')   return (
                <div key={b.id} style={{ fontSize: 11, lineHeight: 1.6, opacity: 0.5, textAlign: isLeft ? 'left' : 'center', padding: '2px 4px', fontFamily }}>
                  {b.title}
                </div>
              );
              if (b.type === 'header') return (
                <div key={b.id} style={{ fontSize: 9.5, fontWeight: 650, letterSpacing: '0.09em', textTransform: 'uppercase', opacity: 0.35, textAlign: isLeft ? 'left' : 'center', padding: '6px 2px 0' }}>
                  {b.title}
                </div>
              );
              return null;
            })}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 5, fontSize: 9.5, opacity: 0.25, flexShrink: 0, alignSelf: isLeft ? 'flex-start' : 'center' }}>
            <div style={{ width: 11, height: 11, background: 'linear-gradient(135deg,#4ADE80,#F472B6)', borderRadius: 3 }} />
            <span>Powered by Cenner</span>
          </div>
        </div>
      </div>
    </div>
  );
}
