import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import '../../styles/components/header.css';
import SoundToggle from '../common/SoundToggle';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);
  const toggleRef = useRef(null);

  // Navigation link list
  const navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Giới thiệu', path: '/about' },
    { label: 'Khám phá', path: '/explore' },
    { label: 'Trải nghiệm', path: '/demo' },
    { label: 'Đội ngũ', path: '/team' },
    { label: 'Liên hệ', path: '/contact' },
  ];

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Track window scroll for elevation styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore the exact scroll position after closing the mobile drawer (also on iOS).
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const scrollY = window.scrollY;
    const openedPath = window.location.pathname;
    const body = document.body;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    Object.assign(body.style, { position: 'fixed', top: `-${scrollY}px`, width: '100%', overflow: 'hidden' });
    drawerRef.current?.querySelector('button')?.focus({ preventScroll: true });

    return () => {
      Object.assign(body.style, previous);
      window.scrollTo({ top: window.location.pathname === openedPath ? scrollY : 0, behavior: 'instant' });
      toggleRef.current?.focus({ preventScroll: true });
    };
  }, [isMobileMenuOpen]);

  // A hidden mobile drawer must never leave desktop scrolling locked after rotation.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    const closeOnDesktop = () => { if (desktop.matches) setIsMobileMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  // Keep keyboard focus inside the open drawer.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isMobileMenuOpen) return;
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
      if (event.key === 'Tab') {
        const controls = drawerRef.current?.querySelectorAll('a[href], button');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        {/* Official Dấu Việt Logo */}
        <Link to="/" className="header__logo" aria-label="Dấu Việt - Trang chủ">
          <div className="header__logo-img-wrap">
            <img
              src="/images/branding/logo-dau-viet.jpg"
              alt="Logo Dấu Việt"
              className="header__logo-img"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav" aria-label="Điều hướng chính">
          <ul className="header__nav-list">
            {navLinks.map((link) => (
              <li key={link.path} className="header__nav-item">
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Action Button */}
        <SoundToggle />
        <div className="header__actions">
          <Link to="/demo" className="btn btn--primary header__cta">
            Trải nghiệm ngay
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          ref={toggleRef}
          type="button"
          className={`header__hamburger ${isMobileMenuOpen ? 'header__hamburger--open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-drawer"
        >
          <span className="header__hamburger-bar" />
          <span className="header__hamburger-bar" />
          <span className="header__hamburger-bar" />
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`header__backdrop ${isMobileMenuOpen ? 'header__backdrop--visible' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside
        ref={drawerRef}
        id="mobile-nav-drawer"
        className={`header__drawer ${isMobileMenuOpen ? 'header__drawer--open' : ''}`}
        aria-label="Menu điều hướng di động"
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
      >
        <div className="header__drawer-header">
          <Link
            to="/"
            className="header__logo"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Dấu Việt - Trang chủ"
          >
            <div className="header__logo-img-wrap">
              <img
                src="/images/branding/logo-dau-viet.jpg"
                alt="Logo Dấu Việt"
                className="header__logo-img"
              />
            </div>
          </Link>
          <button
            type="button"
            className="header__drawer-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Đóng menu"
          >
            ✕
          </button>
        </div>

        <ul className="header__drawer-nav">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `header__drawer-link ${isActive ? 'header__drawer-link--active' : ''}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{link.label}</span>
                <span aria-hidden="true">›</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="header__drawer-actions">
          <Link
            to="/demo"
            className="btn btn--primary header__drawer-cta"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Trải nghiệm ngay
          </Link>
        </div>
      </aside>
    </header>
  );
}
