import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Compass, X } from 'lucide-react';
import BrandLockup from '../common/BrandLockup';
import SoundToggle from '../common/SoundToggle';
import '../../styles/components/header.css';

const navLinks = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Giới thiệu', path: '/about' },
  { label: 'Khám phá', path: '/explore' },
  { label: 'Trải nghiệm', path: '/demo' },
  { label: 'Đội ngũ', path: '/team' },
  { label: 'Liên hệ', path: '/contact' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);
  const toggleRef = useRef(null);

  const isActive = ({ path }) => {
    const [pathname, hash = ''] = path.split('#');
    return location.pathname === pathname && location.hash.slice(1) === hash;
  };

  useEffect(() => { setIsMobileMenuOpen(false); }, [location.key]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const scrollY = window.scrollY;
    const openedAddress = window.location.pathname + window.location.hash;
    const body = document.body;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    Object.assign(body.style, { position: 'fixed', top: `-${scrollY}px`, width: '100%', overflow: 'hidden' });
    drawerRef.current?.querySelector('button')?.focus({ preventScroll: true });
    return () => {
      Object.assign(body.style, previous);
      const address = window.location.pathname + window.location.hash;
      window.scrollTo({ top: address === openedAddress ? scrollY : 0, behavior: 'instant' });
      toggleRef.current?.focus({ preventScroll: true });
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1201px)');
    const closeOnDesktop = () => { if (desktop.matches) setIsMobileMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
      if (event.key === 'Tab') {
        const controls = drawerRef.current?.querySelectorAll('a[href], button');
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header className={`header heritage-surface ${isScrolled ? 'header--scrolled' : ''}`}>
      <span className="heritage-surface__shine" aria-hidden="true" />
      <div className="header__container">
        <BrandLockup className="header__logo" />
        <nav className="header__nav" aria-label="Điều hướng chính">
          <ul className="header__nav-list">
            {navLinks.map(link => (
              <li key={link.path}>
                <Link to={link.path}
                  className={`header__nav-link ${isActive(link) ? 'header__nav-link--active' : ''}`}
                  aria-current={isActive(link) ? 'location' : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SoundToggle />
        <div className="header__actions">
          <Link to="/demo" className="heritage-ticket header__cta">
            <Compass size={18} aria-hidden="true" /><span>Trải nghiệm ngay</span><ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <button ref={toggleRef} type="button"
          className={`header__hamburger ${isMobileMenuOpen ? 'header__hamburger--open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
          aria-expanded={isMobileMenuOpen} aria-controls="mobile-nav-drawer">
          <span className="header__hamburger-bar" /><span className="header__hamburger-bar" /><span className="header__hamburger-bar" />
        </button>
      </div>
      <span className="header__ornament" aria-hidden="true">◇</span>
      <div className={`header__backdrop ${isMobileMenuOpen ? 'header__backdrop--visible' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />
      <aside ref={drawerRef} id="mobile-nav-drawer"
        className={`header__drawer heritage-surface ${isMobileMenuOpen ? 'header__drawer--open' : ''}`}
        role={isMobileMenuOpen ? 'dialog' : undefined}
        aria-modal={isMobileMenuOpen ? true : undefined}
        aria-label="Menu điều hướng di động" aria-hidden={!isMobileMenuOpen} inert={!isMobileMenuOpen}>
        <span className="heritage-surface__shine" aria-hidden="true" />
        <div className="header__drawer-header">
          <BrandLockup onClick={() => setIsMobileMenuOpen(false)} />
          <button type="button" className="header__drawer-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Đóng menu"><X size={20} /></button>
        </div>
        <ul className="header__drawer-nav">
          {navLinks.map(link => (
            <li key={link.path}>
              <Link to={link.path} className={`header__drawer-link ${isActive(link) ? 'header__drawer-link--active' : ''}`}
                aria-current={isActive(link) ? 'location' : undefined} onClick={() => setIsMobileMenuOpen(false)}>
                <span>{link.label}</span><ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="header__drawer-actions">
          <Link to="/demo" className="heritage-ticket header__drawer-cta" onClick={() => setIsMobileMenuOpen(false)}>
            <Compass size={18} aria-hidden="true" /><span>Trải nghiệm ngay</span><ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </header>
  );
}
