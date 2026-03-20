import { useState, useEffect, useCallback, useRef } from 'react';
import Nav from '../components/Nav.jsx';
import PhonePreview from '../components/PhonePreview.jsx';
import BlockItem from '../components/BlockItem.jsx';
import EditModal from '../components/EditModal.jsx';
import Toast from '../components/Toast.jsx';
import ThemeEditor from '../components/ThemeEditor.jsx';
import { EMOJIS, BLOCK_TYPES, DEFAULT_THEME_CONFIG } from '../constants.js';
import * as api from '../api.js';

const DEFAULT_PAGE = {
  slug: '',
  name: 'Your Name',
  handle: '@yourname',
  bio: 'Creator & entrepreneur. Building cool things. ✨',
  emoji: '🎨',
  theme: 'dark',
  published: false,
};

function useToast() {
  const [state, setState] = useState({ msg: '', visible: false });
  const timer = useRef(null);

  const show = useCallback((msg) => {
    clearTimeout(timer.current);
    setState({ msg, visible: true });
    timer.current = setTimeout(() => setState(s => ({ ...s, visible: false })), 2600);
  }, []);

  return [state, show];
}

const TIER_LABELS = { free: 'Free', starter: 'Free', pro: 'Pro', enterprise: 'Ultra' };
const TIER_COLORS = { free: 'var(--text-3)', starter: 'var(--text-3)', pro: 'var(--green)', enterprise: 'var(--pink)' };
const UPGRADE_URL = 'https://cenner.hr/pricing';

export default function Builder() {
  const [page, setPage]           = useState(DEFAULT_PAGE);
  const [themeConfig, setThemeConfig] = useState(DEFAULT_THEME_CONFIG);
  const [blocks, setBlocks]       = useState([]);
  const [tier, setTier]           = useState('free');
  const [limit, setLimit]         = useState(2);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [emojiIdx, setEmojiIdx]   = useState(0);
  const [toast, showToast]        = useToast();

  // Debounce ref for profile auto-save
  const saveTimer = useRef(null);

  // ─── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    api.getMyPage()
      .then(data => {
        setPage(data.page || DEFAULT_PAGE);
        setBlocks((data.blocks || []).sort((a, b) => a.order - b.order));
        if (data.page?.themeConfig) setThemeConfig({ ...DEFAULT_THEME_CONFIG, ...data.page.themeConfig });
        if (data.tier)  setTier(data.tier);
        if (data.limit) setLimit(data.limit);
      })
      .catch(() => { /* no page yet – stay at defaults */ })
      .finally(() => setLoading(false));
  }, []);

  // ─── Profile auto-save (debounced) ────────────────────────────────────────
  const saveProfile = useCallback((updates) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await api.upsertPage(updates);
      } catch {}
    }, 800);
  }, []);

  function updatePage(field, value) {
    const updated = { ...page, [field]: value };
    setPage(updated);
    saveProfile(updated);
  }

  function handleThemeChange(newTc) {
    setThemeConfig(newTc);
    saveProfile({ ...page, themeConfig: newTc });
  }

  // ─── Publish ───────────────────────────────────────────────────────────────
  async function handlePublish() {
    setSaving(true);
    try {
      const updated = await api.upsertPage({ ...page, published: !page.published });
      setPage(p => ({ ...p, published: !p.published }));
      showToast(page.published ? '🔒 Unpublished' : '✓ Published!');
    } catch (e) {
      showToast('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  // ─── Blocks ────────────────────────────────────────────────────────────────
  async function handleAddBlock(type) {
    const defaults = {
      link:   { title: 'New Link',       url: 'https://', icon: '🔗' },
      social: { title: 'Social Links',   platforms: ['instagram', 'twitter'] },
      cta:    { title: 'Get in touch',   variant: 'green' },
      text:   { title: 'Add your text…' },
      header: { title: 'Links' },
    };
    try {
      const block = await api.addBlock({
        type,
        ...defaults[type],
        order: blocks.length,
        active: true,
      });
      setBlocks(prev => [...prev, block]);
      setEditingBlock(block);
    } catch (e) {
      if (e.message && e.message.includes('limit')) {
        showToast('Upgrade your plan to add more links');
      } else {
        showToast('Error: ' + e.message);
      }
    }
  }

  async function handleToggle(id) {
    const b = blocks.find(b => b.id === id);
    if (!b) return;
    const updated = { ...b, active: !b.active };
    setBlocks(prev => prev.map(x => x.id === id ? updated : x));
    try {
      await api.updateBlock(id, { active: !b.active });
    } catch {}
  }

  async function handleSaveBlock(updates) {
    if (!editingBlock) return;
    const merged = { ...editingBlock, ...updates };
    setBlocks(prev => prev.map(b => b.id === editingBlock.id ? merged : b));
    setEditingBlock(null);
    try {
      await api.updateBlock(editingBlock.id, updates);
      showToast('✓ Block saved');
    } catch (e) {
      showToast('Error: ' + e.message);
    }
  }

  async function handleDeleteBlock(id) {
    setBlocks(prev => prev.filter(b => b.id !== id));
    try {
      await api.deleteBlock(id);
      showToast('🗑️ Block removed');
    } catch {}
  }

  // ─── Emoji cycle ──────────────────────────────────────────────────────────
  function cycleEmoji() {
    const next = (emojiIdx + 1) % EMOJIS.length;
    setEmojiIdx(next);
    updatePage('emoji', EMOJIS[next]);
  }

  // ─── Slug auto-generate from name ────────────────────────────────────────
  function handleNameChange(val) {
    updatePage('name', val);
    if (!page.slug) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      updatePage('slug', slug);
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontFamily: 'Inter,sans-serif' }}>
      Loading…
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000', fontFamily: 'Inter,sans-serif' }}>
      <Nav
        slug={page.slug}
        published={page.published}
        onPublish={handlePublish}
        saving={saving}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* ── Editor sidebar ── */}
        <div style={{
          width: 360, flexShrink: 0,
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', height: '100%',
          overflow: 'hidden',
        }}>
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'var(--border-2) transparent' }}>

            {/* Profile panel */}
            <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
              <div className="panel-label">Profile</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                {/* Avatar */}
                <div
                  onClick={cycleEmoji}
                  title="Click to change"
                  style={{
                    width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg,rgba(74,222,128,0.15),rgba(244,114,182,0.15))',
                    border: '1.5px dashed var(--border-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, cursor: 'pointer', transition: 'all 0.15s', userSelect: 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
                >{page.emoji}</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input className="inp" placeholder="Display name" value={page.name}
                    onChange={e => handleNameChange(e.target.value)} />
                  <input className="inp" placeholder="@handle" value={page.handle}
                    onChange={e => updatePage('handle', e.target.value)} />
                </div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <textarea className="inp" rows={2} placeholder="Short bio…" value={page.bio || ''}
                  onChange={e => updatePage('bio', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>URL slug</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 7, overflow: 'hidden' }}>
                    <span style={{ padding: '7px 8px', fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap', borderRight: '1px solid var(--border-2)' }}>cenner.hr/p/</span>
                    <input
                      style={{ flex: 1, padding: '7px 8px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 12, fontFamily: 'Inter,sans-serif' }}
                      placeholder="your-name"
                      value={page.slug || ''}
                      onChange={e => updatePage('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Theme panel */}
            <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
              <div className="panel-label">Theme</div>
              <ThemeEditor tc={themeConfig} onChange={handleThemeChange} />
            </div>

            {/* Blocks panel */}
            <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div className="panel-label" style={{ marginBottom: 0 }}>Blocks</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 500 }}>
                    {blocks.length}/{limit}
                  </span>
                  <span style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                    color: TIER_COLORS[tier] || 'var(--text-3)',
                    background: tier === 'enterprise' ? 'rgba(244,114,182,0.1)' : tier === 'pro' ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.06)',
                    padding: '2px 6px', borderRadius: 4,
                  }}>
                    {TIER_LABELS[tier] || 'Free'}
                  </span>
                </div>
              </div>
              {blocks.length === 0
                ? <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', padding: '12px 0' }}>No blocks yet.</div>
                : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {blocks.map(b => (
                      <BlockItem
                        key={b.id}
                        block={b}
                        selected={editingBlock?.id === b.id}
                        onToggle={handleToggle}
                        onEdit={id => setEditingBlock(blocks.find(b => b.id === id))}
                        onDelete={handleDeleteBlock}
                      />
                    ))}
                  </div>
                )
              }
            </div>

            {/* Add block panel */}
            <div style={{ padding: 16 }}>
              <div className="panel-label">Add Block</div>
              {blocks.length >= limit ? (
                <div style={{
                  background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.2)',
                  borderRadius: 10, padding: '14px 14px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pink)', marginBottom: 4 }}>
                    {limit}-link limit reached
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginBottom: 12, lineHeight: 1.5 }}>
                    {tier === 'pro' ? 'Upgrade to Ultra for 10 links.' : 'Upgrade to Pro for 5 links or Ultra for 10.'}
                  </div>
                  <a
                    href={UPGRADE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg,#4ADE80,#F472B6)',
                      color: '#000', fontWeight: 700, fontSize: 12,
                      padding: '7px 16px', borderRadius: 7, textDecoration: 'none',
                    }}
                  >
                    Upgrade plan
                  </a>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {Object.entries(BLOCK_TYPES).map(([type, meta]) => (
                    <button
                      key={type}
                      onClick={() => handleAddBlock(type)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '9px 10px',
                        background: 'var(--surface-2)',
                        border: '1px dashed var(--border-2)',
                        borderRadius: 8, color: 'var(--text-2)',
                        fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                        letterSpacing: '-0.01em', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.background = 'rgba(74,222,128,0.05)'; e.currentTarget.style.color = 'var(--text)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-2)'; }}
                    >
                      <div style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                        {meta.icon}
                      </div>
                      {meta.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Canvas ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#000',
          backgroundImage: 'linear-gradient(rgba(26,26,26,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(26,26,26,0.6) 1px,transparent 1px)',
          backgroundSize: '32px 32px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Glow orbs */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 600px 400px at 20% 60%,rgba(74,222,128,0.03) 0%,transparent 70%),radial-gradient(ellipse 500px 400px at 80% 40%,rgba(244,114,182,0.03) 0%,transparent 70%)',
          }} />
          <div style={{ position: 'absolute', top: 16, left: 20, fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', zIndex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--green)' }} />
            Live preview
          </div>
          <PhonePreview page={{ ...page, themeConfig }} blocks={blocks} />
        </div>
      </div>

      {editingBlock && (
        <EditModal
          block={editingBlock}
          onSave={handleSaveBlock}
          onClose={() => setEditingBlock(null)}
        />
      )}

      <Toast message={toast.msg} visible={toast.visible} />
    </div>
  );
}
