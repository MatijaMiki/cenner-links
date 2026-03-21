import { API_BASE } from './constants.js';

function getToken() {
  return localStorage.getItem('portal_token');
}

async function req(method, path, body) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function socialLogin(idToken) {
  const res = await fetch(`${API_BASE}/portal/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Social login failed');
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/portal/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

// ─── Link page ───────────────────────────────────────────────────────────────
export const getMyPage   = ()       => req('GET',  '/links/page');
export const upsertPage  = (data)   => req('PUT',  '/links/page', data);
export const publishPage = (pub)    => req('PUT',  '/links/page', { published: pub });

export async function uploadAvatar(file) {
  const token = getToken();
  const form = new FormData();
  form.append('avatar', file);
  const res = await fetch(`${API_BASE}/links/avatar`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

// ─── Blocks ──────────────────────────────────────────────────────────────────
export const addBlock    = (data)   => req('POST',   '/links/blocks', data);
export const updateBlock = (id, d)  => req('PUT',    `/links/blocks/${id}`, d);
export const deleteBlock = (id)     => req('DELETE', `/links/blocks/${id}`);
export const reorderBlocks = (ids)  => req('PUT',    '/links/blocks/reorder', { ids });

// ─── Analytics ───────────────────────────────────────────────────────────────
export const getAnalytics = (days = 7) => req('GET', `/links/analytics?days=${days}`);

// ─── Public (no auth) ────────────────────────────────────────────────────────
export const getPublicPage  = (slug) => fetch(`${API_BASE}/links/p/${slug}`).then(r => r.json());
export const trackEvent     = (slug, type, blockId) =>
  fetch(`${API_BASE}/links/p/${slug}/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, blockId }),
  });
