import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { installInteractionSounds } from '../../utils/interactionSounds';
import AmbientBackground from '../common/AmbientBackground';

export default function PageLayout() {
  const { pathname } = useLocation();
  useEffect(() => installInteractionSounds(), []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
