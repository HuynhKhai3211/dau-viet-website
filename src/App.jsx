import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import OnePage from './pages/OnePage';
import NotFoundPage from './pages/NotFoundPage';

function LegacySection({ section }) {
  const { hash } = useLocation();
  return <Navigate to={`/${hash || `#${section}`}`} replace />;
}

function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<OnePage />} />
        <Route path="/about" element={<LegacySection section="gioi-thieu" />} />
        <Route path="/explore" element={<LegacySection section="kham-pha" />} />
        <Route path="/demo" element={<LegacySection section="trai-nghiem" />} />
        <Route path="/team" element={<LegacySection section="doi-ngu" />} />
        <Route path="/contact" element={<LegacySection section="lien-he" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
