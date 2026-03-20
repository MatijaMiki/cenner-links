import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Builder from './pages/Builder.jsx';
import Analytics from './pages/Analytics.jsx';
import PublicPage from './pages/PublicPage.jsx';
import Login from './pages/Login.jsx';

function Protected({ children }) {
  const token = localStorage.getItem('portal_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
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
