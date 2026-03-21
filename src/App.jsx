import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as api from './api.js';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import Builder from './pages/Builder.jsx';
import Analytics from './pages/Analytics.jsx';
import PublicPage from './pages/PublicPage.jsx';
import Login from './pages/Login.jsx';
import Terms from './pages/Terms.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import CookiePolicy from './pages/CookiePolicy.jsx';
import CookieBanner, { getConsent } from './components/CookieBanner.jsx';
import Pricing from './pages/Pricing.jsx';

function SSOHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('portal_token', token);
      navigate('/', { replace: true });
    }
  }, []);

  return null;
}

function PricingWrapper() {
  const [tier, setTier] = useState('free');
  useEffect(() => {
    api.getSubscriptionStatus().then(d => setTier(d.tier)).catch(() => {});
  }, []);
  return <Pricing currentTier={tier} />;
}

function Protected({ children }) {
  const token = localStorage.getItem('portal_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [consent, setConsent] = useState(() => getConsent());

  return (
    <>
      <BrowserRouter>
        <SSOHandler />
        <Routes>
          <Route path="/login"         element={<Login />} />
          <Route path="/p/:slug"       element={<PublicPage />} />
          <Route path="/terms"         element={<Terms />} />
          <Route path="/privacy"       element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route
            path="/"
            element={
              <Protected>
                <Builder />
              </Protected>
            }
          />
          <Route
            path="/analytics"
            element={
              <Protected>
                <Analytics />
              </Protected>
            }
          />
          <Route
            path="/pricing"
            element={
              <Protected>
                <PricingWrapper />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <CookieBanner onConsentChange={setConsent} />
      </BrowserRouter>

      {/* Only inject Vercel Analytics script after explicit consent */}
      {consent === 'all' && <VercelAnalytics />}
    </>
  );
}
