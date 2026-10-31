import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { installInteractionSounds } from '../../utils/interactionSounds';
import AmbientBackground from '../common/AmbientBackground';

import '../../styles/components/heritageBackground.css';

// Vite watches this optional asset, including when it is first added.
const heritageBackground = Object.values(import.meta.glob(
  '/public/images/backgrounds/heritage-background.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
))[0];

export default function PageLayout() {
  const { pathname, hash } = useLocation();
  useEffect(() => installInteractionSounds(), []);
  
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <div className="page-layout">
      <Header />
      <main className="main-content">
        <div className="heritage-backdrop" aria-hidden="true" style={{ '--heritage-landscape': heritageBackground ? `url("${heritageBackground}")` : 'none' }} />
        <Outlet />
      </main>
      <Footer />
      <AmbientBackground />
    </div>
  );
}
