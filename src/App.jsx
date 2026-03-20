import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Builder from './pages/Builder.jsx';
import Analytics from './pages/Analytics.jsx';
import PublicPage from './pages/PublicPage.jsx';
import Login from './pages/Login.jsx';

function SSOHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('portal_token', token);
      // Remove token from URL and redirect to builder
      navigate('/', { replace: true });
    }
  }, []);

  return null;
}

function Protected({ children }) {
  const token = localStorage.getItem('portal_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <SSOHandler />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/p/:slug" element={<PublicPage />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
