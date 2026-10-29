import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { installInteractionSounds } from '../../utils/interactionSounds';
import AmbientBackground from '../common/AmbientBackground';

export default function PageLayout() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => installInteractionSounds(), []);
  
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      if (target.tagName === 'DETAILS') target.open = true;
      // Layout offsets stay stable while section reveal transforms animate.
      let top = 0;
      for (let element = target; element; element = element.offsetParent) {
        top += element.offsetTop;
      }
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      window.scrollTo({ top: top - headerHeight - 24, behavior: 'instant' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return (
    <div className="page-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <AmbientBackground />
    </div>
  );
}
