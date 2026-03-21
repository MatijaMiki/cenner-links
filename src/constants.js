export const EMOJIS = ['🎨','🎯','🔥','⚡','🌟','💫','🦄','🎸','🎪','💎','🌈','🚀','🎭','🍀','🦋'];

export const SOCIAL_META = {
  instagram:  { label: 'Instagram',  color: '#E1306C' },
  twitter:    { label: 'X / Twitter',color: '#ffffff' },
  tiktok:     { label: 'TikTok',     color: '#ffffff' },
  youtube:    { label: 'YouTube',    color: '#FF0000' },
  linkedin:   { label: 'LinkedIn',   color: '#0A66C2' },
  github:     { label: 'GitHub',     color: '#ffffff' },
  twitch:     { label: 'Twitch',     color: '#9146FF' },
  spotify:    { label: 'Spotify',    color: '#1DB954' },
  facebook:   { label: 'Facebook',   color: '#1877F2' },
  discord:    { label: 'Discord',    color: '#5865F2' },
  pinterest:  { label: 'Pinterest',  color: '#E60023' },
  snapchat:   { label: 'Snapchat',   color: '#FFFC00' },
  reddit:     { label: 'Reddit',     color: '#FF4500' },
  whatsapp:   { label: 'WhatsApp',   color: '#25D366' },
  telegram:   { label: 'Telegram',   color: '#26A5E4' },
  behance:    { label: 'Behance',    color: '#1769FF' },
  dribbble:   { label: 'Dribbble',   color: '#EA4C89' },
  medium:     { label: 'Medium',     color: '#ffffff' },
  substack:   { label: 'Substack',   color: '#FF6719' },
  patreon:    { label: 'Patreon',    color: '#FF424D' },
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
  { id: 'g-violet',label: 'Violet',  bg: 'linear-gradient(160deg,#0a030d 0%,#1a0a2e 100%)',          bgType: 'gradient' },
  { id: 'g-teal',   label: 'Teal',    bg: 'linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)', bgType: 'gradient' },
  { id: 'g-sunset', label: 'Sunset',  bg: 'linear-gradient(135deg,#1a0533 0%,#6b1a3a 60%,#d4316c 100%)', bgType: 'gradient' },
  { id: 'g-deep',   label: 'Deep',    bg: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)', bgType: 'gradient' },
  { id: 'g-rose',   label: 'Rose',    bg: 'linear-gradient(135deg,#2d0a1e 0%,#4a1535 60%,#c94b8a 100%)', bgType: 'gradient' },
  { id: 'g-space',  label: 'Space',   bg: 'linear-gradient(135deg,#020111 0%,#3a1c71 50%,#d76d77 100%)', bgType: 'gradient' },
  { id: 'g-grove',  label: 'Grove',   bg: 'linear-gradient(135deg,#0a1a0a 0%,#1a3a1a 60%,#2d5a2d 100%)', bgType: 'gradient' },
  // Photos
  { id: 'drift',  label: 'Drift',  bg: '/backgrounds/bg-drift.jpg',  bgType: 'image' },
  { id: 'prism',  label: 'Prism',  bg: '/backgrounds/bg-prism.jpg',  bgType: 'image' },
  { id: 'flow',   label: 'Flow',   bg: '/backgrounds/bg-flow.jpg',   bgType: 'image' },
  { id: 'dusk',   label: 'Dusk',   bg: '/backgrounds/bg-dusk.jpg',   bgType: 'image' },
  { id: 'ink',    label: 'Ink',    bg: '/backgrounds/bg-ink.jpg',    bgType: 'image' },
  { id: 'splash', label: 'Splash', bg: '/backgrounds/bg-splash.jpg', bgType: 'image' },
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
