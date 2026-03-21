import { useState, useEffect, useCallback, useRef } from 'react';
import Nav from '../components/Nav.jsx';
import PhonePreview from '../components/PhonePreview.jsx';
import BlockItem from '../components/BlockItem.jsx';
import EditModal from '../components/EditModal.jsx';
import Toast from '../components/Toast.jsx';
import ThemeEditor from '../components/ThemeEditor.jsx';
import { EMOJIS, BLOCK_TYPES, DEFAULT_THEME_CONFIG } from '../constants.js';
import * as api from '../api.js';
import Footer from '../components/Footer.jsx';

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
  const [userAvatar, setUserAvatar]   = useState(null);
  const [kycVerified, setKycVerified] = useState(false);
  const [avatarPanel, setAvatarPanel] = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [slugStatus, setSlugStatus]   = useState(null); // null | 'checking' | 'available' | 'taken' | 'invalid'
  const [dragOver, setDragOver]       = useState(null);
  const [toast, showToast]            = useToast();
  const fileInputRef  = useRef(null);
  const dragSrc       = useRef(null);
  const slugCheckTimer = useRef(null);

  // Debounce ref for profile auto-save
  const saveTimer = useRef(null);

  // ─── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    api.getMyPage()
      .then(data => {
        setPage(data.page || DEFAULT_PAGE);
        setBlocks((data.blocks || []).sort((a, b) => a.order - b.order));
        if (data.page?.themeConfig) setThemeConfig({ ...DEFAULT_THEME_CONFIG, ...data.page.themeConfig });
        if (data.tier)        setTier(data.tier);
        if (data.limit)       setLimit(data.limit);
        if (data.userAvatar)  setUserAvatar(data.userAvatar);
        if (data.kycVerified) setKycVerified(data.kycVerified);
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
    // Send only themeConfig — avoids slug validation failing for new accounts
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try { await api.upsertPage({ themeConfig: newTc }); }
      catch (e) { showToast('Could not save theme — set a URL slug first'); }
    }, 800);
  }

  // ─── Slug availability check ──────────────────────────────────────────────
  function triggerSlugCheck(slug) {
    clearTimeout(slugCheckTimer.current);
    if (!slug) { setSlugStatus(null); return; }
    if (!/^[a-z0-9-]{1,60}$/.test(slug)) { setSlugStatus('invalid'); return; }
    setSlugStatus('checking');
    slugCheckTimer.current = setTimeout(async () => {
      try {
        const res = await api.checkSlug(slug);
        setSlugStatus(res.available ? 'available' : 'taken');
      } catch { setSlugStatus(null); }
    }, 600);
  }

  // ─── Drag-and-drop reorder ────────────────────────────────────────────────
  function handleDragStart(idx) {
    dragSrc.current = idx;
  }

  function handleDragOver(e, idx) {
    e.preventDefault();
    setDragOver(idx);
    if (dragSrc.current === null || dragSrc.current === idx) return;
    const updated = [...blocks];
    const [item] = updated.splice(dragSrc.current, 1);
    updated.splice(idx, 0, item);
    setBlocks(updated);
    dragSrc.current = idx;
  }

  async function handleDragEnd() {
    setDragOver(null);
    dragSrc.current = null;
    try { await api.reorderBlocks(blocks.map(b => b.id)); } catch {}
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
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div
                    onClick={() => setAvatarPanel(v => !v)}
                    title="Change avatar"
                    style={{
                      width: 52, height: 52, borderRadius: '50%',
                      border: '1.5px dashed var(--border-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.15s', userSelect: 'none', overflow: 'hidden',
                      background: page.avatarUrl ? 'transparent' : 'linear-gradient(135deg,rgba(74,222,128,0.15),rgba(244,114,182,0.15))',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
                  >
                    {page.avatarUrl
                      ? <img src={page.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 24 }}>{page.emoji}</span>
                    }
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 16, height: 16, borderRadius: '50%', background: 'var(--surface-3)',
                    border: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, pointerEvents: 'none',
                  }}>✏️</div>
                </div>
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

              {/* Avatar panel */}
              {avatarPanel && (
                <div style={{
                  background: 'var(--surface-2)', border: '1px solid var(--border-2)',
                  borderRadius: 10, padding: 12, marginBottom: 10,
                }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Profile Image
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
                    style={{ display: 'none' }}
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5 MB'); return; }
                      setUploading(true);
                      try {
                        const result = await api.uploadAvatar(file);
                        updatePage('avatarUrl', result.url);
                        setAvatarPanel(false);
                        showToast('✓ Avatar updated');
                      } catch (err) {
                        showToast('Upload failed: ' + err.message);
                      } finally {
                        setUploading(false);
                        e.target.value = '';
                      }
                    }}
                  />

                  {/* Upload button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      width: '100%', padding: '9px 12px', marginBottom: 8,
                      background: 'rgba(74,222,128,0.06)', border: '1px dashed rgba(74,222,128,0.4)',
                      borderRadius: 8, cursor: uploading ? 'wait' : 'pointer',
                      color: 'var(--green)', fontSize: 12, fontWeight: 600,
                      fontFamily: 'Inter,sans-serif', opacity: uploading ? 0.6 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    {uploading ? 'Uploading…' : '↑ Upload image (JPG, PNG, WEBP — max 5 MB)'}
                  </button>

                  {/* Use Cenner profile picture */}
                  {userAvatar && (
                    <button
                      onClick={() => { updatePage('avatarUrl', userAvatar); setAvatarPanel(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '7px 10px', marginBottom: 8,
                        background: page.avatarUrl === userAvatar ? 'rgba(74,222,128,0.07)' : 'var(--surface)',
                        border: `1px solid ${page.avatarUrl === userAvatar ? 'var(--green)' : 'var(--border-2)'}`,
                        borderRadius: 7, cursor: 'pointer',
                        color: page.avatarUrl === userAvatar ? 'var(--green)' : 'var(--text-2)',
                        fontSize: 12, fontWeight: 500, fontFamily: 'Inter,sans-serif', textAlign: 'left',
                      }}
                    >
                      <img src={userAvatar} alt="" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      Use my Cenner profile picture
                    </button>
                  )}

                  {/* Remove */}
                  {page.avatarUrl && (
                    <button
                      onClick={() => { updatePage('avatarUrl', ''); setAvatarPanel(false); }}
                      style={{
                        width: '100%', padding: '5px', background: 'transparent',
                        border: '1px solid var(--border-2)', borderRadius: 6, color: 'var(--text-3)',
                        fontSize: 11, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                      }}
                    >Remove image — use emoji</button>
                  )}

                  {!userAvatar && (
                    <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 8, lineHeight: 1.4 }}>
                      No profile picture set. Add one at <a href="https://cenner.hr/profile" target="_blank" rel="noreferrer" style={{ color: 'var(--green)' }}>cenner.hr/profile</a>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>URL slug</div>
                    {slugStatus === 'checking'  && <span style={{ fontSize: 9.5, color: 'var(--text-3)' }}>Checking…</span>}
                    {slugStatus === 'available' && <span style={{ fontSize: 9.5, color: 'var(--green)', fontWeight: 600 }}>✓ Available</span>}
                    {slugStatus === 'taken'     && <span style={{ fontSize: 9.5, color: '#F87171', fontWeight: 600 }}>✗ Already taken</span>}
                    {slugStatus === 'invalid'   && <span style={{ fontSize: 9.5, color: '#F87171', fontWeight: 600 }}>✗ Invalid format</span>}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 0,
                    background: 'var(--surface-2)',
                    border: `1px solid ${slugStatus === 'taken' || slugStatus === 'invalid' ? '#F87171' : slugStatus === 'available' ? 'var(--green)' : 'var(--border-2)'}`,
                    borderRadius: 7, overflow: 'hidden', transition: 'border-color 0.2s',
                  }}>
                    <span style={{ padding: '7px 8px', fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap', borderRight: '1px solid var(--border-2)', flexShrink: 0 }}>links.cenner.hr/p/</span>
                    <input
                      style={{ flex: 1, padding: '7px 8px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 12, fontFamily: 'Inter,sans-serif' }}
                      placeholder="your-name"
                      value={page.slug || ''}
                      onChange={e => {
                        const v = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                        updatePage('slug', v);
                        triggerSlugCheck(v);
                      }}
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
                    {blocks.map((b, idx) => (
                      <BlockItem
                        key={b.id}
                        block={b}
                        selected={editingBlock?.id === b.id}
                        isDragOver={dragOver === idx}
                        onToggle={handleToggle}
                        onEdit={id => setEditingBlock(blocks.find(b => b.id === id))}
                        onDelete={handleDeleteBlock}
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={e => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
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
          <PhonePreview page={{ ...page, themeConfig, kycVerified }} blocks={blocks} />
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
      <Footer />
    </div>
  );
}
