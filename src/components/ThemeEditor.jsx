import { useState } from 'react';
import { BG_PRESETS, FONT_OPTIONS, DEFAULT_THEME_CONFIG } from '../constants.js';

const TABS = ['Background', 'Style', 'Layout'];

const AVATAR_SHAPES = [
  { id: 'circle',  label: 'Circle',  radius: '50%' },
  { id: 'rounded', label: 'Rounded', radius: '16px' },
  { id: 'square',  label: 'Square',  radius: '4px' },
];

const ALIGN_OPTIONS = [
  { id: 'center', label: 'Center' },
  { id: 'left',   label: 'Left' },
];

function Label({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
      {children}
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)', fontVariantNumeric: 'tabular-nums' }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--green)', cursor: 'pointer', height: 3 }}
      />
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace' }}>{value}</span>
        <label style={{
          width: 26, height: 26, borderRadius: 6, cursor: 'pointer', flexShrink: 0,
          border: '2px solid var(--border-2)', overflow: 'hidden',
          background: value,
        }}>
          <input type="color" value={value.startsWith('#') ? value : '#4ADE80'} onChange={e => onChange(e.target.value)}
            style={{ opacity: 0, width: 1, height: 1 }} />
        </label>
      </div>
    </div>
  );
}

export default function ThemeEditor({ tc, onChange }) {
  const [tab, setTab] = useState(0);
  const cfg = { ...DEFAULT_THEME_CONFIG, ...tc };

  function set(key, value) {
    onChange({ ...cfg, [key]: value });
  }

  // Determine if background is dark (for overlay hint)
  const isDarkBg = cfg.bgType !== 'color' || cfg.bg === '#000000' || cfg.bg.startsWith('#0') || cfg.bg.startsWith('#1');

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 14, background: 'var(--surface-2)', borderRadius: 8, padding: 3 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            flex: 1, padding: '5px 0', fontSize: 11.5, fontWeight: 600,
            borderRadius: 6, border: 'none', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            background: tab === i ? 'var(--surface-3)' : 'transparent',
            color: tab === i ? 'var(--text)' : 'var(--text-3)',
            transition: 'all 0.15s',
          }}>{t}</button>
        ))}
      </div>

      {/* ── Background tab ── */}
      {tab === 0 && (
        <div>
          <Label>Preset</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 14 }}>
            {BG_PRESETS.map(p => {
              const isSelected = cfg.bg === p.bg;
              const thumbStyle = p.bgType === 'image'
                ? { backgroundImage: `url(${p.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: p.bg };
              return (
                <div key={p.id} onClick={() => onChange({ ...cfg, bg: p.bg, bgType: p.bgType })}
                  title={p.label}
                  style={{
                    aspectRatio: '1', borderRadius: 8, cursor: 'pointer',
                    outline: isSelected ? '2px solid var(--green)' : '2px solid transparent',
                    outlineOffset: 2, transition: 'all 0.15s', overflow: 'hidden',
                    ...thumbStyle,
                  }}
                />
              );
            })}
          </div>

          {cfg.bgType !== 'image' && (
            <ColorRow label="Custom color" value={cfg.bg.startsWith('#') ? cfg.bg : '#000000'} onChange={v => onChange({ ...cfg, bg: v, bgType: 'color' })} />
          )}

          {(cfg.bgType === 'image' || cfg.bgType === 'gradient') && (
            <Slider label="Dark overlay" value={cfg.bgOverlay} min={0} max={0.75} step={0.05} onChange={v => set('bgOverlay', v)} />
          )}

          <Label>Content backdrop</Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {[
              { v: 'none',  l: 'None',  preview: 'transparent', border: 'var(--border-2)' },
              { v: 'glass', l: 'Glass', preview: 'rgba(255,255,255,0.12)', blur: true },
              { v: 'dark',  l: 'Dark',  preview: 'rgba(0,0,0,0.55)' },
              { v: 'light', l: 'Light', preview: 'rgba(255,255,255,0.14)' },
            ].map(({ v, l, preview, blur }) => {
              const sel = (cfg.contentBg || 'none') === v;
              return (
                <button key={v} onClick={() => set('contentBg', v)} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 10px', borderRadius: 7, border: '1px solid',
                  borderColor: sel ? 'var(--green)' : 'var(--border-2)',
                  background: sel ? 'rgba(74,222,128,0.07)' : 'var(--surface-2)',
                  color: sel ? 'var(--green)' : 'var(--text-2)',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', textAlign: 'left',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                    background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23555'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23555'/%3E%3Crect x='10' width='10' height='10' fill='%23333'/%3E%3Crect y='10' width='10' height='10' fill='%23333'/%3E%3C/svg%3E")`,
                    position: 'relative', overflow: 'hidden',
                    border: '1px solid var(--border-2)',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: preview,
                      backdropFilter: blur ? 'blur(6px)' : undefined,
                    }} />
                  </div>
                  {l}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Style tab ── */}
      {tab === 1 && (
        <div>
          <Label>Font</Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 14 }}>
            {FONT_OPTIONS.map(f => (
              <button key={f.id} onClick={() => set('font', f.id)}
                style={{
                  padding: '7px 10px', borderRadius: 7, border: '1px solid',
                  borderColor: cfg.font === f.id ? 'var(--green)' : 'var(--border-2)',
                  background: cfg.font === f.id ? 'rgba(74,222,128,0.07)' : 'var(--surface-2)',
                  color: cfg.font === f.id ? 'var(--green)' : 'var(--text-2)',
                  fontSize: 12, fontFamily: f.stack, fontWeight: 500,
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}>
                {f.label}
              </button>
            ))}
          </div>

          <Label>Colors</Label>
          <ColorRow label="Accent"    value={cfg.accentColor} onChange={v => set('accentColor', v)} />
          <ColorRow label="Text"      value={cfg.textColor}   onChange={v => set('textColor', v)} />
          <ColorRow label="Link fill" value={cfg.linkText}    onChange={v => set('linkText', v)} />

          <div style={{ marginTop: 4 }}>
            <Label>Text sizes</Label>
            <Slider label="Name"  value={cfg.nameSize} min={12} max={28} unit="px" onChange={v => set('nameSize', v)} />
            <Slider label="Bio"   value={cfg.bioSize}  min={9}  max={16} unit="px" onChange={v => set('bioSize', v)} />
          </div>

          <div style={{ marginTop: 4 }}>
            <Label>Text shadow</Label>
            <div style={{ display: 'flex', gap: 5 }}>
              {[{ v: 0, l: 'None' }, { v: 1, l: 'Soft' }, { v: 2, l: 'Medium' }, { v: 3, l: 'Strong' }].map(({ v, l }) => (
                <button key={v} onClick={() => set('textShadow', v)} style={{
                  flex: 1, padding: '6px 0', borderRadius: 7, border: '1px solid',
                  borderColor: cfg.textShadow === v ? 'var(--green)' : 'var(--border-2)',
                  background: cfg.textShadow === v ? 'rgba(74,222,128,0.07)' : 'var(--surface-2)',
                  color: cfg.textShadow === v ? 'var(--green)' : 'var(--text-3)',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Layout tab ── */}
      {tab === 2 && (
        <div>
          <Label>Avatar</Label>
          <Slider label="Size" value={cfg.avatarSize} min={40} max={120} unit="px" onChange={v => set('avatarSize', v)} />
          <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
            {AVATAR_SHAPES.map(s => (
              <button key={s.id} onClick={() => set('avatarShape', s.id)} style={{
                flex: 1, padding: '6px 0',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                borderRadius: 7, border: '1px solid',
                borderColor: cfg.avatarShape === s.id ? 'var(--green)' : 'var(--border-2)',
                background: cfg.avatarShape === s.id ? 'rgba(74,222,128,0.07)' : 'var(--surface-2)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <div style={{
                  width: 22, height: 22,
                  background: 'linear-gradient(135deg,#4ADE80,#F472B6)',
                  borderRadius: s.radius,
                }} />
                <span style={{ fontSize: 10, color: cfg.avatarShape === s.id ? 'var(--green)' : 'var(--text-3)', fontWeight: 600 }}>{s.label}</span>
              </button>
            ))}
          </div>

          <Label>Alignment</Label>
          <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
            {ALIGN_OPTIONS.map(a => (
              <button key={a.id} onClick={() => set('textAlign', a.id)} style={{
                flex: 1, padding: '7px 0', borderRadius: 7, border: '1px solid',
                borderColor: cfg.textAlign === a.id ? 'var(--green)' : 'var(--border-2)',
                background: cfg.textAlign === a.id ? 'rgba(74,222,128,0.07)' : 'var(--surface-2)',
                color: cfg.textAlign === a.id ? 'var(--green)' : 'var(--text-2)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              }}>{a.label}</button>
            ))}
          </div>

          <Label>Link style</Label>
          <Slider label="Corner radius" value={cfg.linkRadius}  min={0}  max={24} unit="px" onChange={v => set('linkRadius', v)} />
          <Slider label="Spacing"       value={cfg.linkSpacing} min={2}  max={20} unit="px" onChange={v => set('linkSpacing', v)} />

          <Label>Padding</Label>
          <Slider label="Content padding" value={cfg.contentPad} min={10} max={40} unit="px" onChange={v => set('contentPad', v)} />
        </div>
      )}
    </div>
  );
}
