export const EMOJIS = ['🎨','🎯','🔥','⚡','🌟','💫','🦄','🎸','🎪','💎','🌈','🚀','🎭','🍀','🦋'];

export const SOCIAL_META = {
  instagram: { icon: '📸', label: 'Instagram' },
  twitter:   { icon: '🐦', label: 'X / Twitter' },
  tiktok:    { icon: '🎵', label: 'TikTok' },
  youtube:   { icon: '▶️', label: 'YouTube' },
  linkedin:  { icon: '💼', label: 'LinkedIn' },
  github:    { icon: '💻', label: 'GitHub' },
  twitch:    { icon: '🟣', label: 'Twitch' },
  spotify:   { icon: '🎧', label: 'Spotify' },
};

export const THEMES = [
  { id: 'dark',     label: 'Dark',     bg: '#09090F', bar: '#14142A', accent: '#4ADE80' },
  { id: 'light',    label: 'Light',    bg: '#F4F4FA', bar: '#fff',    accent: '#4ADE80' },
  { id: 'cenner',   label: 'Cenner',   bg: '#05120A', bar: 'rgba(74,222,128,0.15)', accent: '#4ADE80' },
  { id: 'neon',     label: 'Neon',     bg: '#060612', bar: 'rgba(244,114,182,0.15)', accent: '#F472B6' },
  { id: 'ivory',    label: 'Ivory',    bg: '#FAF8F5', bar: '#fff',    accent: '#4ADE80' },
  { id: 'midnight', label: 'Midnight', bg: '#060610', bar: 'rgba(255,255,255,0.08)', accent: '#A78BFA' },
];

export const BLOCK_TYPES = {
  link:   { icon: '🔗', label: 'Link',       colorClass: 'bti-link'   },
  social: { icon: '📱', label: 'Social',     colorClass: 'bti-social' },
  cta:    { icon: '⚡', label: 'CTA Button', colorClass: 'bti-cta'    },
  text:   { icon: '📝', label: 'Text',       colorClass: 'bti-text'   },
  header: { icon: '📌', label: 'Header',     colorClass: 'bti-header' },
};

export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
