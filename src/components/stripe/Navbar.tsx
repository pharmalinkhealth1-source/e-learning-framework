"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { ThemeToggle } from './ThemeToggle';
import SearchModal from '../search/SearchModal';
import Megamenu, { AboutUsPanel, CommunityPanel, DataInsightsPanel, PodcastPanel, ContactUsPanel } from './Megamenu';
import MobileMenu from './MobileMenu';
import { NAV_DATA } from '@/lib/nav-data';
import { useUser } from '@clerk/nextjs';
import NotificationBell from './NotificationBell';

const PLATFORMS = [
  { 
    name: 'Google', 
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
        <path fill="#4285f4" d="M11.8846 4.91113H6.11987v2.31403h3.30546c-.06676.36934-.20976.72135-.42019 1.03438s-.48385.58047-.80343.78585V10.551h1.96699c.6038-.57079 1.0787-1.2598 1.394-2.02239.4722-1.14225.5273-2.4075.3219-3.61748" />
        <path fill="#34a853" d="M6.11985 12c1.64722 0 3.04228-.5278 4.04885-1.449L8.20168 9.0454c-.61936.39256-1.34496.59231-2.08183.5731-.76295-.00928-1.50387-.25249-2.11917-.69564-.61531-.44314-1.07424-1.06406-1.31264-1.77595H.652344v1.53908C1.16135 9.68188 1.9422 10.5192 2.90769 11.1044c.9655.5852 2.07762.8953 3.21216.8956" />
        <path fill="#fbbc04" d="M2.68809 7.14693c-.25717-.74696-.25717-1.55625 0-2.30321v-1.5499H.652386c-.427544.83671-.65018873 1.75993-.65018873 2.6961S.224842 7.84931.652386 8.68602z" />
        <path fill="#ea4335" d="M6.11985 2.37211c.87133-.0146 1.71351.30816 2.34449.89853l1.75046-1.71879C9.51693.932184 8.68295.478902 7.77771.227229 6.87246-.0244442 5.92032-.0677314 4.99527.100731c-.92505.168462-1.79809.544137-2.5513 1.097839-.75321.55369-1.3663 1.2705-1.791626 2.09473L2.68804 4.84371c.2384-.71189.69733-1.33281 1.31264-1.77595.6153-.44315 1.35622-.68636 2.11917-.69565" />
      </svg>
    )
  },
  { 
    name: 'Apple', 
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.96.95-2.04 1.72-3.23 1.72-1.16 0-1.57-.71-2.95-.71-1.39 0-1.85.7-2.94.7-1.15 0-2.2-.72-3.21-1.72-2.05-2.05-3.14-5.83-3.14-8.87 0-4.83 3.01-7.39 5.86-7.39 1.5 0 2.8.92 3.7 1.38.9-.46 2.2-1.38 3.7-1.38 2.3 0 4.11 1.48 5.16 3.03-4.14 2.45-3.48 7.7 1.13 9.48-.9 2.18-2.3 4.2-4.18 5.76zm-5.05-15.3c-.02-.91.33-1.83.92-2.54.89-1.08 2.21-1.68 3.42-1.68.04.93-.33 1.83-.89 2.53-.88 1.05-2.19 1.69-3.45 1.69z" />
      </svg>
    )
  },
  { 
    name: 'Microsoft', 
    icon: (
      <svg width="12" height="12" viewBox="0 0 23 23">
        <path fill="#f3f3f3" d="M0 0h23v23H0z" />
        <path fill="#f35325" d="M1 1h10v10H1z" />
        <path fill="#81bc06" d="M12 1h10v10H12z" />
        <path fill="#05a6f0" d="M1 12h10v10H1z" />
        <path fill="#ffba08" d="M12 12h10v10H12z" />
      </svg>
    )
  },
  { 
    name: 'LinkedIn', 
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#0077b5">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    )
  },
];

const RotatingAuthButton = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PLATFORMS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link 
      href="/login" 
      className={`${styles.hdsButton} ${styles.navigationCtaButton} ${styles.hdsButtonSecondary} ${styles.navbarButtonGoogle}`}
      style={{ width: '205px', justifyContent: 'flex-start' }} // Fixed width for longest text
    >
      <div style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
        {PLATFORMS[index].icon}
      </div>
      <span key={PLATFORMS[index].name} className={styles.rotatingText}>
        Sign in with {PLATFORMS[index].name}
      </span>
    </Link>
  );
};

const MessagesNavButton = () => {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchCount = () => {
      fetch('/api/messages/unread-count')
        .then((r) => r.json())
        .then((data) => setUnread(data?.total ?? 0))
        .catch(() => {});
    };
    fetchCount();
    const id = setInterval(fetchCount, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <Link
      href="/messages"
      className={`${styles.hdsButton} ${styles.hdsButtonTransparent}`}
      style={{ padding: '8px', minWidth: 'auto', position: 'relative' }}
      title="Messages"
      aria-label={unread > 0 ? `Messages (${unread} unread)` : 'Messages'}
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {unread > 0 && (
        <span style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          background: 'var(--hds-color-foreground-critical, #e53e3e)',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 700,
          lineHeight: 1,
          minWidth: '16px',
          height: '16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 3px',
        }}>
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  );
};

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [contentOffset, setContentOffset] = useState<number | null>(null);
  const [arrowOffsets, setArrowOffsets] = useState<Record<string, number>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navButtonRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const handleMouseEnter = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveTab(id);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveTab(null), 150);
  };

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const firstBtn = navButtonRefs.current[NAV_DATA[0].id];
      if (firstBtn) {
        setContentOffset(firstBtn.getBoundingClientRect().left - containerRect.left);
      }
      const offsets: Record<string, number> = {};
      for (const [id, btn] of Object.entries(navButtonRefs.current)) {
        if (btn) {
          const r = btn.getBoundingClientRect();
          offsets[id] = r.left - containerRect.left + r.width / 2;
        }
      }
      setArrowOffsets(offsets);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const PANEL_MAP: Record<string, React.ReactNode> = {
    'about-us': <AboutUsPanel />,
    'community': <CommunityPanel />,
    'data-insights': <DataInsightsPanel />,
    'podcast': <PodcastPanel />,
    'contact-us': <ContactUsPanel />,
  };

  const tabs = NAV_DATA.map(item => ({
    id: item.id,
    label: item.label,
    content: PANEL_MAP[item.id],
  }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!activeTab) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTab(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeTab]);

  return (
    <>
      <header className={`${styles.navigation} ${styles.section}`}>
        <div ref={containerRef} className={`${styles.sectionContainer} ${styles.navigationLayout}`}>
          <nav className={styles.hdsNavigationMenu} id="navigation-menu" role="navigation">
            <Link href="/" className={styles.navigationMenuHomeLink} aria-label="PharmaLink homepage">
              <div className={styles.logoWrapper}>
                <Image 
                  src="/images/logos/pharmalink-logos/pharmalink.svg" 
                  alt="PharmaLink logo" 
                  width={120} 
                  height={40} 
                  className={styles.logoImage}
                  priority
                />
              </div>
            </Link>
            
            <div className={styles.navigationMenuContent}>
              <ul className={`${styles.hdsNavigationMenuList} ${styles.hdsNavigationMenuListHorizontal}`}>
                {NAV_DATA.map((item) => (
                  <li key={item.id} className={styles.navigationItem}>
                    <Link
                      ref={el => { navButtonRefs.current[item.id] = el; }}
                      href={item.href}
                      className={`${styles.hdsButton} ${styles.hdsNavigationMenuTrigger} ${styles.hdsButtonTransparent}`}
                      onMouseEnter={() => handleMouseEnter(item.id)}
                      onMouseLeave={handleMouseLeave}
                      aria-haspopup="true"
                      aria-expanded={activeTab === item.id}
                      aria-controls={`panel-${item.id}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveTab(item.id);
                        }
                        if (e.key === 'Escape') {
                          setActiveTab(null);
                          e.currentTarget.focus();
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <ul className={styles.navigationButtons}>
              <li className={styles.navigationItem}>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className={`${styles.hdsButton} ${styles.hdsButtonTransparent}`}
                  style={{ padding: '8px', minWidth: 'auto' }}
                  title="Search (Cmd+K)"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              </li>
              <li className={styles.navigationItem}>
                <ThemeToggle />
              </li>
              {isSignedIn ? (
                <>
                  <li className={styles.navigationItem}>
                    <NotificationBell />
                  </li>
                  <li className={styles.navigationItem}>
                    <MessagesNavButton />
                  </li>
                </>
              ) : (
                <>
                  <li className={styles.navigationItem}>
                    <RotatingAuthButton />
                  </li>
                  <li className={styles.navigationItem}>
                    <Link href="/sign-up" className={`${styles.hdsButton} ${styles.navigationCtaButton} ${styles.hdsButtonPrimary}`}>
                      Get Started
                      <svg className={styles.hdsIconHoverArrow} width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M0.5 5.5h7" />
                        <path d="M1.5 1.5l4 4-4 4" />
                      </svg>
                    </Link>
                  </li>
                </>
              )}
              <li className={`${styles.navigationItem} ${styles.hamburgerItem}`}>
                <button
                  ref={hamburgerRef}
                  className={styles.hamburger}
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open navigation menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className={styles.hamburgerBar} />
                  <span className={styles.hamburgerBar} />
                  <span className={styles.hamburgerBar} />
                </button>
              </li>
            </ul>
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              triggerRef={hamburgerRef}
            />
          </nav>
          <div
            className={styles.megamenuWrapper}
            onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
            onMouseLeave={handleMouseLeave}
          >
            <Megamenu
              activeTab={activeTab}
              tabs={tabs}
              contentOffset={contentOffset ?? undefined}
              arrowLeft={activeTab ? arrowOffsets[activeTab] : undefined}
            />
          </div>
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;

