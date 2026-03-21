import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';

const LAST_UPDATED = '1 March 2026';

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#4ADE80,#22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#000' }}>C</div>
        <Link to="/" style={{ fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: '-0.01em' }}>Cenner Links</Link>
      </div>

      <div style={{ flex: 1, maxWidth: 720, margin: '0 auto', padding: '48px 24px', width: '100%' }}>
        <LegalDoc title="Privacy Policy" updated={LAST_UPDATED}>

          <p>This Privacy Policy explains how Cenner ("we", "us", "our") collects, uses, and protects your personal data when you use Cenner Links (links.cenner.hr). It complies with the General Data Protection Regulation (EU) 2016/679 (GDPR) and the Croatian Personal Data Protection Act (NN 42/2018).</p>

          <Section title="1. Data Controller">
            <p>The data controller for personal data processed via Cenner Links is:</p>
            <p style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '12px 16px', fontSize: 13 }}>
              <strong>Cenner</strong><br />
              Croatia<br />
              Email: <a href="mailto:privacy@cenner.hr" style={{ color: '#4ADE80' }}>privacy@cenner.hr</a>
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <p><strong>Account data (provided by you):</strong> Your name, email address, profile handle, bio, and avatar image are stored as part of your Cenner Links profile.</p>
            <p><strong>Content data:</strong> Link titles, URLs, and other content blocks you add to your page.</p>
            <p><strong>Technical data:</strong> IP address (processed transiently for security and rate limiting, not stored long-term), browser type, and operating system.</p>
            <p><strong>Analytics data (with consent only):</strong> Aggregate page view counts and unique visitor estimates via Vercel Analytics. This data is not linked to individuals and does not include full IP addresses.</p>
            <p><strong>Authentication data:</strong> A signed JWT token stored in your browser's localStorage to maintain your session.</p>
          </Section>

          <Section title="3. Legal Basis for Processing">
            <p>We process your personal data on the following legal bases under Article 6 GDPR:</p>
            <ul>
              <li><strong>Contract performance (Art. 6(1)(b)):</strong> Profile data and content data are necessary to provide the Cenner Links service you have signed up for.</li>
              <li><strong>Consent (Art. 6(1)(a)):</strong> Analytics tracking via Vercel Analytics is only activated if you provide explicit consent via the cookie banner.</li>
              <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> Rate limiting and security measures to protect the service and its users.</li>
            </ul>
          </Section>

          <Section title="4. How We Use Your Data">
            <ul>
              <li>To create and display your public Cenner Links profile page</li>
              <li>To authenticate you and maintain your session</li>
              <li>To provide analytics about your page's performance (if consented)</li>
              <li>To enforce our Terms of Service and prevent abuse</li>
              <li>To send service-related communications (e.g. account notices)</li>
            </ul>
          </Section>

          <Section title="5. Data Sharing and Third Parties">
            <p>We do not sell your personal data. We share data only with:</p>
            <ul>
              <li><strong>Vercel Inc.</strong> (hosting provider, USA) — your profile page is hosted on Vercel infrastructure. Data transfers to the US are covered by Standard Contractual Clauses (SCCs). If analytics consent is given, aggregate analytics data is processed by Vercel Analytics. <a href="https://vercel.com/legal/privacy-policy" style={{ color: '#4ADE80' }}>Vercel Privacy Policy</a></li>
              <li><strong>Coolify / Hetzner</strong> — the Cenner API backend runs on Hetzner infrastructure within the EU.</li>
            </ul>
            <p>No personal data is shared with advertising networks or data brokers.</p>
          </Section>

          <Section title="6. Data Retention">
            <p>Your profile data is retained for as long as your account is active. If you delete your account, your profile data is permanently deleted within 30 days, except where we are required to retain it by law.</p>
            <p>Aggregate analytics data (page view counts) may be retained for up to 24 months.</p>
          </Section>

          <Section title="7. Your Rights Under GDPR">
            <p>As a data subject, you have the following rights:</p>
            <ul>
              <li><strong>Right of access (Art. 15):</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to rectification (Art. 16):</strong> Correct inaccurate or incomplete data.</li>
              <li><strong>Right to erasure (Art. 17):</strong> Request deletion of your data ("right to be forgotten").</li>
              <li><strong>Right to restrict processing (Art. 18):</strong> Ask us to limit how we use your data.</li>
              <li><strong>Right to data portability (Art. 20):</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Right to object (Art. 21):</strong> Object to processing based on legitimate interests.</li>
              <li><strong>Right to withdraw consent:</strong> Withdraw analytics consent at any time via the cookie settings link in the footer.</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:privacy@cenner.hr" style={{ color: '#4ADE80' }}>privacy@cenner.hr</a>. We will respond within 30 days.</p>
          </Section>

          <Section title="8. Supervisory Authority">
            <p>If you believe we have not handled your data lawfully, you have the right to lodge a complaint with the Croatian Personal Data Protection Agency (AZOP):</p>
            <p style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '12px 16px', fontSize: 13 }}>
              <strong>Agencija za zaštitu osobnih podataka (AZOP)</strong><br />
              Selska cesta 136, 10 000 Zagreb, Croatia<br />
              Web: <a href="https://azop.hr" style={{ color: '#4ADE80' }}>azop.hr</a><br />
              Email: <a href="mailto:azop@azop.hr" style={{ color: '#4ADE80' }}>azop@azop.hr</a>
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>Cenner Links is not intended for use by persons under the age of 18. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us immediately.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We will notify you of material changes to this Privacy Policy via email or in-app notice at least 30 days before they take effect.</p>
          </Section>

          <Section title="11. Contact">
            <p>For any privacy-related questions or requests: <a href="mailto:privacy@cenner.hr" style={{ color: '#4ADE80' }}>privacy@cenner.hr</a></p>
          </Section>

        </LegalDoc>
      </div>
      <Footer />
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
