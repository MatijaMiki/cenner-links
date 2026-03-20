import {
  SiInstagram, SiX, SiTiktok, SiYoutube, SiGithub,
  SiTwitch, SiSpotify, SiFacebook, SiDiscord, SiPinterest, SiSnapchat,
  SiReddit, SiWhatsapp, SiTelegram, SiBehance, SiDribbble, SiMedium,
  SiSubstack, SiPatreon,
} from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa6';

const ICONS = {
  instagram: SiInstagram,
  twitter:   SiX,
  tiktok:    SiTiktok,
  youtube:   SiYoutube,
  linkedin:  FaLinkedinIn,
  github:    SiGithub,
  twitch:    SiTwitch,
  spotify:   SiSpotify,
  facebook:  SiFacebook,
  discord:   SiDiscord,
  pinterest: SiPinterest,
  snapchat:  SiSnapchat,
  reddit:    SiReddit,
  whatsapp:  SiWhatsapp,
  telegram:  SiTelegram,
  behance:   SiBehance,
  dribbble:  SiDribbble,
  medium:    SiMedium,
  substack:  SiSubstack,
  patreon:   SiPatreon,
};

export default function SocialIcon({ platform, size = 18, color }) {
  const Icon = ICONS[platform];
  if (!Icon) return <span style={{ fontSize: size * 0.8 }}>🔗</span>;
  return <Icon size={size} color={color} />;
}
