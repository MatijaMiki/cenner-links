import { useState, useEffect } from 'react';
import { SOCIAL_META } from '../constants.js';

export default function EditModal({ block, onSave, onClose }) {
  const [title, setTitle]     = useState('');
  const [url, setUrl]         = useState('');
  const [icon, setIcon]       = useState('🔗');
  const [variant, setVariant] = useState('green');
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    if (!block) return;
    setTitle(block.title || '');
    setUrl(block.url || '');
    setIcon(block.icon || '🔗');
    setVariant(block.variant || 'green');
    setPlatforms(block.platforms || []);
  }, [block]);

  if (!block) return null;

  function togglePlatform(p) {
    setPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  }

  function handleSave() {
    const update = { title };
    if (block.type === 'link')   Object.assign(update, { url, icon });
    if (block.type === 'social') Object.assign(update, { platforms });
    if (block.type === 'cta')    Object.assign(update, { variant });
    onSave(update);
  }

  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, backdropFilter: 'blur(6px)',
      }}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-2)',
        borderRadius: 14, padding: 22, width: 360,
        animation: 'fadeSlideIn 0.2s ease',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Edit {cap(block.type)} block
        </div>

        {/* Link fields */}
        {block.type === 'link' && (
          <>
            <Field label="Title">
              <input className="inp" value={title} onChange={e => setTitle(e.target.value)} placeholder="Link title" />
            </Field>
            <Field label="URL">
              <input className="inp" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" />
            </Field>
            <Field label="Icon (emoji)">
              <input className="inp" value={icon} onChange={e => setIcon(e.target.value)} placeholder="🔗" style={{ maxWidth: 80 }} />
            </Field>
          </>
        )}

        {/* Social fields */}
        {block.type === 'social' && (
          <Field label="Platforms">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Object.entries(SOCIAL_META).map(([p, m]) => (
                <div
                  key={p}
                  onClick={() => togglePlatform(p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px',
                    background: 'var(--surface-2)',
                    border: `1px solid ${platforms.includes(p) ? 'var(--green)' : 'var(--border-2)'}`,
                    borderRadius: 6, fontSize: 11.5,
                    cursor: 'pointer', userSelect: 'none',
                    color: platforms.includes(p) ? 'var(--green)' : 'var(--text)',
                    transition: 'all 0.15s',
                  }}
                >{m.icon} {m.label}</div>
              ))}
            </div>
          </Field>
        )}

        {/* CTA fields */}
        {block.type === 'cta' && (
          <>
            <Field label="Button Text">
              <input className="inp" value={title} onChange={e => setTitle(e.target.value)} placeholder="Button text" />
            </Field>
            <Field label="Style">
              <select className="inp" value={variant} onChange={e => setVariant(e.target.value)}>
                <option value="green">Green (Cenner)</option>
                <option value="pink">Pink</option>
                <option value="white">White</option>
                <option value="glass">Glass</option>
              </select>
            </Field>
          </>
        )}

        {/* Text / Header fields */}
        {(block.type === 'text' || block.type === 'header') && (
          <Field label={block.type === 'header' ? 'Header Label' : 'Text Content'}>
            {block.type === 'text'
              ? <textarea className="inp" rows={3} value={title} onChange={e => setTitle(e.target.value)} placeholder="Your text…" />
              : <input className="inp" value={title} onChange={e => setTitle(e.target.value)} placeholder="Section title" />
            }
          </Field>
        )}

        {/* Footer buttons */}
        <div style={{ display: 'flex', gap: 7, justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary"   onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 5 }}>
        {label}
      </div>
      {children}
    </div>
  );
}
