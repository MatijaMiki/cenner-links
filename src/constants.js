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

// ─── Theme config defaults ────────────────────────────────────────────────────
export const DEFAULT_THEME_CONFIG = {
  bg:           '#000000',
  bgType:       'color',      // 'color' | 'gradient' | 'image'
  bgOverlay:    0,            // 0–0.7 dark overlay for readability
  font:         'Inter',
  nameSize:     16,
  bioSize:      11,
  textColor:    '#ffffff',
  accentColor:  '#4ADE80',
  avatarSize:   72,           // px
  avatarShape:  'circle',     // 'circle' | 'rounded' | 'square'
  linkBg:       'rgba(255,255,255,0.08)',
  linkText:     '#ffffff',
  linkRadius:   11,           // px
  linkSpacing:  8,            // px
  textAlign:    'center',     // 'center' | 'left'
  contentPad:   20,           // px
};

// ─── Background presets ────────────────────────────────────────────────────────
export const BG_PRESETS = [
  // Solid
  { id: 'black',   label: 'Black',   bg: '#000000',   bgType: 'color' },
  { id: 'slate',   label: 'Slate',   bg: '#0D0D18',   bgType: 'color' },
  { id: 'white',   label: 'White',   bg: '#FFFFFF',   bgType: 'color' },
  { id: 'cream',   label: 'Cream',   bg: '#FAF8F5',   bgType: 'color' },
  // Gradients
  { id: 'cenner',  label: 'Cenner',  bg: 'linear-gradient(160deg,#030d07 0%,#0a1f10 100%)',          bgType: 'gradient' },
  { id: 'neon',    label: 'Neon',    bg: 'linear-gradient(160deg,#0a030d 0%,#1a0a2e 100%)',          bgType: 'gradient' },
  { id: 'aurora',  label: 'Aurora',  bg: 'linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)', bgType: 'gradient' },
  { id: 'sunset',  label: 'Sunset',  bg: 'linear-gradient(135deg,#1a0533 0%,#6b1a3a 60%,#d4316c 100%)', bgType: 'gradient' },
  { id: 'ocean',   label: 'Ocean',   bg: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)', bgType: 'gradient' },
  { id: 'rose',    label: 'Rose',    bg: 'linear-gradient(135deg,#2d0a1e 0%,#4a1535 60%,#c94b8a 100%)', bgType: 'gradient' },
  { id: 'space',   label: 'Space',   bg: 'linear-gradient(135deg,#020111 0%,#3a1c71 50%,#d76d77 100%)', bgType: 'gradient' },
  { id: 'forest',  label: 'Forest',  bg: 'linear-gradient(135deg,#0a1a0a 0%,#1a3a1a 60%,#2d5a2d 100%)', bgType: 'gradient' },
  // Photos
  { id: 'wave',    label: 'Wave',    bg: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80&auto=format&fit=crop', bgType: 'image' },
  { id: 'mesh',    label: 'Mesh',    bg: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&q=80&auto=format&fit=crop', bgType: 'image' },
  { id: 'abstract',label: 'Abstract',bg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&auto=format&fit=crop', bgType: 'image' },
  { id: 'dark-abs',label: 'Dark',    bg: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&q=80&auto=format&fit=crop', bgType: 'image' },
  { id: 'nature',  label: 'Nature',  bg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80&auto=format&fit=crop', bgType: 'image' },
  { id: 'beach',   label: 'Beach',   bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop', bgType: 'image' },
  { id: 'city',    label: 'City',    bg: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80&auto=format&fit=crop', bgType: 'image' },
  { id: 'flowers', label: 'Flowers', bg: 'https://images.unsplash.com/photo-1490750967868-88df5691cc1a?w=600&q=80&auto=format&fit=crop', bgType: 'image' },
];

// ─── Font options ──────────────────────────────────────────────────────────────
export const FONT_OPTIONS = [
  { id: 'Inter',           label: 'Inter',       stack: 'Inter, sans-serif' },
  { id: 'Poppins',         label: 'Poppins',     stack: 'Poppins, sans-serif' },
  { id: 'Montserrat',      label: 'Montserrat',  stack: 'Montserrat, sans-serif' },
  { id: 'Space Grotesk',   label: 'Grotesk',     stack: "'Space Grotesk', sans-serif" },
  { id: 'DM Sans',         label: 'DM Sans',     stack: "'DM Sans', sans-serif" },
  { id: 'Raleway',         label: 'Raleway',     stack: 'Raleway, sans-serif' },
  { id: 'Playfair Display',label: 'Playfair',    stack: "'Playfair Display', serif" },
];
