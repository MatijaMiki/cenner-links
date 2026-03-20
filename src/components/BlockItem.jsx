import { BLOCK_TYPES } from '../constants.js';

const ICON_BG = {
  'bti-link':   'rgba(74,222,128,0.12)',
  'bti-social': 'rgba(244,114,182,0.12)',
  'bti-cta':    'rgba(251,191,36,0.12)',
  'bti-text':   'rgba(96,165,250,0.12)',
  'bti-header': 'rgba(167,139,250,0.12)',
};

function blockSubtitle(b) {
  if (b.type === 'link')   return b.url || 'No URL';
  if (b.type === 'social') return (b.platforms || []).join(', ') || 'No platforms';
  if (b.type === 'cta')    return `CTA · ${b.variant || 'green'}`;
  if (b.type === 'text' || b.type === 'header') {
    const t = b.title || '';
    return t.length > 36 ? t.slice(0, 36) + '…' : t;
  }
  return '';
}

export default function BlockItem({ block, selected, onToggle, onEdit, onDelete }) {
  const meta = BLOCK_TYPES[block.type] || { icon: '?', colorClass: '' };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '9px 10px',
      background: selected ? 'rgba(74,222,128,0.04)' : 'var(--surface-2)',
      border: `1px solid ${selected ? 'var(--green)' : 'var(--border-2)'}`,
      borderRadius: 9,
      cursor: 'default',
      transition: 'border-color 0.15s',
      animation: 'fadeSlideIn 0.2s ease both',
    }}>
      <span style={{ color: 'var(--text-3)', fontSize: 12, cursor: 'grab', flexShrink: 0 }}>⠿</span>

      {/* Icon */}
      <div style={{
        width: 30, height: 30, borderRadius: 7,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, flexShrink: 0,
        background: ICON_BG[meta.colorClass] || 'var(--surface-3)',
      }}>{meta.icon}</div>

      {/* Meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>
          {block.title}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {blockSubtitle(block)}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        {/* Toggle */}
        <div
          onClick={() => onToggle(block.id)}
          style={{
            width: 26, height: 15, borderRadius: 99,
            background: block.active ? 'var(--green)' : 'var(--border-2)',
            cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute', width: 11, height: 11, background: '#fff',
            borderRadius: '50%', top: 2, left: 2,
            transform: block.active ? 'translateX(11px)' : 'none',
            transition: 'transform 0.2s',
          }} />
        </div>

        {/* Edit */}
        <button
          onClick={() => onEdit(block.id)}
          style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, fontSize: 12, cursor: 'pointer', color: 'var(--text-3)', border: 'none', background: 'transparent', fontFamily: 'Inter,sans-serif', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)'; }}
        >✏️</button>

        {/* Delete */}
        <button
          onClick={() => onDelete(block.id)}
          style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, fontSize: 12, cursor: 'pointer', color: 'var(--text-3)', border: 'none', background: 'transparent', fontFamily: 'Inter,sans-serif', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#F87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)'; }}
        >✕</button>
      </div>
    </div>
  );
}
