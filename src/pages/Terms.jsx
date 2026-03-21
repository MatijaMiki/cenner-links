import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';

const LAST_UPDATED = '1 March 2026';

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#4ADE80,#22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#000' }}>C</div>
        <Link to="/" style={{ fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: '-0.01em' }}>Cenner Links</Link>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 720, margin: '0 auto', padding: '48px 24px', width: '100%' }}>
        <LegalDoc title="Terms of Service" updated={LAST_UPDATED}>

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using Cenner Links ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the Service.</p>
            <p>These Terms govern your use of Cenner Links, a link-in-bio service operated by Cenner ("we", "us", or "our"). Cenner Links is part of the Cenner platform available at cenner.hr.</p>
          </Section>

          <Section title="2. Eligibility">
            <p>You must be at least 18 years old to use the Service. By using Cenner Links, you confirm that you are at least 18 years of age and have the legal capacity to enter into a binding agreement.</p>
          </Section>

          <Section title="3. Account and Access">
            <p>Access to Cenner Links is provided through your existing Cenner account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>
            <p>You must notify us immediately at <a href="mailto:legal@cenner.hr" style={{ color: '#4ADE80' }}>legal@cenner.hr</a> if you become aware of any unauthorised use of your account.</p>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to use Cenner Links to:</p>
            <ul>
              <li>Publish content that is unlawful, harmful, defamatory, obscene, or otherwise objectionable under Croatian or European Union law</li>
              <li>Distribute malware, viruses, or any code designed to disrupt or damage systems</li>
              <li>Engage in phishing, fraud, or impersonation of any person or entity</li>
              <li>Violate any intellectual property rights of third parties</li>
              <li>Spam or send unsolicited communications via links on your page</li>
              <li>Link to content that violates the EU Digital Services Act (DSA) or any applicable regulation</li>
              <li>Publish adult, sexually explicit, or NSFW content of any kind</li>
              <li>Circumvent or attempt to circumvent the Service's security measures</li>
            </ul>
            <p>We reserve the right to remove content or suspend accounts that violate these rules without prior notice.</p>
          </Section>

          <Section title="5. Subscription Tiers and Payments">
            <p>Cenner Links is available on the following tiers, linked to your Cenner subscription:</p>
            <ul>
              <li><strong>Free / Starter:</strong> Up to 2 link blocks</li>
              <li><strong>Pro:</strong> Up to 5 link blocks</li>
              <li><strong>Ultra (Enterprise):</strong> Up to 10 link blocks</li>
            </ul>
            <p>Subscription fees, billing cycles, and upgrade/downgrade procedures are governed by the Cenner main platform Terms available at <a href="https://cenner.hr/terms" style={{ color: '#4ADE80' }}>cenner.hr/terms</a>.</p>
          </Section>

          <Section title="6. URL Slugs">
            <p>When you claim a URL slug (e.g., links.cenner.hr/p/yourname), that slug is reserved exclusively for your account. Slugs are allocated on a first-come, first-served basis. Certain slugs are reserved by us and cannot be claimed. We reserve the right to reclaim slugs that violate these Terms or impersonate other persons or entities.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>You retain ownership of all content you publish through Cenner Links. By publishing content, you grant us a non-exclusive, worldwide, royalty-free licence to host, display, and serve that content as part of the Service.</p>
            <p>The Cenner name, logo, and all related marks are our intellectual property. You may not use them without our prior written consent.</p>
          </Section>

          <Section title="8. Disclaimer of Warranties">
            <p>The Service is provided "as is" and "as available" without any warranty of any kind, express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or free of harmful components.</p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>To the fullest extent permitted by Croatian and EU law, Cenner shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability to you for any claim shall not exceed the amount you paid to us in the three months preceding the claim.</p>
          </Section>

          <Section title="10. Termination">
            <p>We may suspend or terminate your access to Cenner Links at any time, with or without cause, and with or without notice. Upon termination, your right to use the Service ceases immediately. You may delete your account at any time by contacting <a href="mailto:support@cenner.hr" style={{ color: '#4ADE80' }}>support@cenner.hr</a>.</p>
          </Section>

          <Section title="11. Governing Law and Disputes">
            <p>These Terms are governed by the laws of the Republic of Croatia. Any dispute arising out of or in connection with these Terms shall first be attempted to be resolved amicably. If unresolved, disputes shall be subject to the exclusive jurisdiction of the competent courts in Croatia.</p>
            <p>If you are an EU consumer, you may also use the European Commission's Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" style={{ color: '#4ADE80' }}>ec.europa.eu/consumers/odr</a>.</p>
          </Section>

          <Section title="12. Changes to These Terms">
            <p>We reserve the right to update these Terms at any time. We will notify registered users of material changes via email or an in-app notice at least 30 days before the changes take effect. Continued use of the Service after that date constitutes acceptance of the revised Terms.</p>
          </Section>

          <Section title="13. Contact">
            <p>For any questions about these Terms, please contact us at <a href="mailto:legal@cenner.hr" style={{ color: '#4ADE80' }}>legal@cenner.hr</a>.</p>
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
      <div style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>{children}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  );
}
