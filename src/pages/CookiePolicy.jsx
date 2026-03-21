import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';

const LAST_UPDATED = '1 March 2026';

export default function CookiePolicy() {
  function resetConsent() {
    localStorage.removeItem('cenner_cookie_consent');
    window.location.reload();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#4ADE80,#22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#000' }}>C</div>
        <Link to="/" style={{ fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: '-0.01em' }}>Cenner Links</Link>
      </div>

      <div style={{ flex: 1, maxWidth: 720, margin: '0 auto', padding: '48px 24px', width: '100%' }}>
        <LegalDoc title="Cookie Policy" updated={LAST_UPDATED}>

          <p>This Cookie Policy explains what cookies and similar storage technologies Cenner Links uses, why we use them, and how you can manage your preferences. It applies to links.cenner.hr and complies with the EU ePrivacy Directive (2002/58/EC as amended), GDPR, and applicable Croatian law.</p>

          <Section title="1. What Are Cookies?">
            <p>Cookies are small text files stored on your device when you visit a website. Cenner Links primarily uses browser <strong>localStorage</strong> rather than traditional cookies, but the same legal framework applies to both under EU law.</p>
          </Section>

          <Section title="2. Storage We Use">
            <CookieTable cookies={[
              {
                name: 'portal_token',
                type: 'Strictly necessary',
                storage: 'localStorage',
                purpose: 'Stores your encrypted authentication token to keep you logged in to Cenner Links.',
                duration: 'Until you log out or after 24 hours of inactivity',
                thirdParty: 'No',
              },
              {
                name: 'cenner_cookie_consent',
                type: 'Strictly necessary',
                storage: 'localStorage',
                purpose: 'Stores your cookie consent choice (accepted / rejected) so we do not show the banner on every visit.',
                duration: '12 months',
                thirdParty: 'No',
              },
              {
                name: 'Vercel Analytics',
                type: 'Analytics (optional)',
                storage: 'No persistent cookie set on your device',
                purpose: 'Counts page views and unique visitors in aggregate. No personal data is stored. IP addresses are not logged. Data is processed by Vercel Inc.',
                duration: 'Session only (no persistent tracking)',
                thirdParty: 'Yes — Vercel Inc. (USA, covered by SCCs)',
              },
            ]} />
          </Section>

          <Section title="3. Strictly Necessary Storage">
            <p>Strictly necessary storage is essential for the website to function. It includes your authentication token and your consent preference. Under the ePrivacy Directive, strictly necessary cookies and storage do not require consent. You cannot opt out of these without losing access to the service.</p>
          </Section>

          <Section title="4. Analytics Storage">
            <p>We use Vercel Analytics to understand how visitors interact with Cenner Links in aggregate — for example, how many people visit a particular public profile page. Vercel Analytics is designed to be privacy-friendly:</p>
            <ul>
              <li>No personal data or persistent identifiers are stored on your device</li>
              <li>IP addresses are not logged or stored</li>
              <li>No cross-site tracking</li>
              <li>No advertising profiling</li>
            </ul>
            <p>Analytics are only activated if you click "Accept all" on the cookie banner. You can withdraw this consent at any time using the button below.</p>
          </Section>

          <Section title="5. No Advertising or Social Media Cookies">
            <p>Cenner Links does not use advertising, retargeting, or social media tracking cookies. We do not share data with advertising networks.</p>
          </Section>

          <Section title="6. Managing Your Preferences">
            <p>You can change your cookie preferences at any time:</p>
            <div style={{ margin: '8px 0' }}>
              <button
                onClick={resetConsent}
                style={{
                  padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: '#4ADE80', border: 'none', color: '#000',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}
              >
                Change cookie preferences
              </button>
            </div>
            <p>You can also control cookies through your browser settings. Note that blocking strictly necessary storage will prevent you from logging in.</p>
            <p>Browser opt-out guides:</p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" style={{ color: '#4ADE80' }}>Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" style={{ color: '#4ADE80' }}>Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" style={{ color: '#4ADE80' }}>Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-168dab11-0753-043d-7c16-ede5947fc64d" style={{ color: '#4ADE80' }}>Microsoft Edge</a></li>
            </ul>
          </Section>

          <Section title="7. Changes to This Policy">
            <p>We may update this Cookie Policy from time to time. We will notify you of material changes via the in-app notice or email. The date at the top of this page indicates when the policy was last updated.</p>
          </Section>

          <Section title="8. Contact">
            <p>Questions about our use of cookies? Contact us at <a href="mailto:privacy@cenner.hr" style={{ color: '#4ADE80' }}>privacy@cenner.hr</a>.</p>
          </Section>

        </LegalDoc>
      </div>
      <Footer />
    </div>
  );
}

function CookieTable({ cookies }) {
  const hdStyle = { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 12px', background: 'rgba(255,255,255,0.04)' };
  const tdStyle = { fontSize: 12, color: 'rgba(255,255,255,0.65)', padding: '10px 12px', lineHeight: 1.6, verticalAlign: 'top', borderTop: '1px solid rgba(255,255,255,0.06)' };
  return (
    <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', marginTop: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {['Name', 'Category', 'Storage', 'Purpose', 'Duration', 'Third party'].map(h => (
              <th key={h} style={hdStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cookies.map(c => (
            <tr key={c.name}>
              <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#4ADE80', whiteSpace: 'nowrap' }}>{c.name}</td>
              <td style={tdStyle}>
                <span style={{
                  fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                  background: c.type.startsWith('Strictly') ? 'rgba(255,255,255,0.07)' : 'rgba(74,222,128,0.1)',
                  color: c.type.startsWith('Strictly') ? 'rgba(255,255,255,0.45)' : '#4ADE80',
                }}>{c.type}</span>
              </td>
              <td style={tdStyle}>{c.storage}</td>
              <td style={tdStyle}>{c.purpose}</td>
              <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{c.duration}</td>
              <td style={tdStyle}>{c.thirdParty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LegalDoc({ title, updated, children }) {
  return (
    <div>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>{title}</h1>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 40 }}>Last updated: {updated}</p>
      <div style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', display: 'flex', flexDirection: 'column', gap: 0 }}>{children}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}
