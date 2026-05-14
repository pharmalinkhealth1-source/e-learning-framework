"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { NAV_DATA } from '@/lib/nav-data';
import styles from './Megamenu.module.css';

interface MegamenuProps {
  activeTab: string | null;
  tabs: { id: string; label: string; content: React.ReactNode }[];
  contentOffset?: number;
  arrowLeft?: number;
}

const Megamenu: React.FC<MegamenuProps> = ({ activeTab, tabs, contentOffset, arrowLeft }) => {
  const activeContent = tabs.find(t => t.id === activeTab)?.content;

  return (
    <AnimatePresence>
      {activeTab && (
        <motion.div
          className={styles.dropdownContainer}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div
            className={styles.dropdownContent}
            style={contentOffset != null ? { paddingInlineStart: contentOffset } : undefined}
            role="region"
            aria-label={activeTab ? `${activeTab} navigation panel` : undefined}
            id={activeTab ? `panel-${activeTab}` : undefined}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                {activeContent}
              </motion.div>
            </AnimatePresence>
          </div>
          {arrowLeft != null && (
            <div
              className={styles.arrow}
              style={{ left: arrowLeft, transform: 'translateX(-50%) rotate(45deg)' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const AboutUsPanel = () => {
  const item = NAV_DATA.find(n => n.id === 'about-us')!;
  const { featuredCard } = item;

  return (
    <div className={styles.section}>
      <div className={styles.columnGrid}>
        {item.columns.map(col => (
          <div key={col.heading} className={styles.column}>
            <p className={styles.columnHeader}>{col.heading}</p>
            <hr className={styles.columnSeparator} />
            {col.links.map(link => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                <span className={styles.navLinkTitle}>{link.label}</span>
                <span className={styles.navLinkDescriptor}>{link.descriptor}</span>
              </Link>
            ))}
          </div>
        ))}

        <div className={styles.featuredCard}>
          <div className={styles.featuredCardBody}>
            <p className={styles.featuredCardTitle}>{featuredCard.title}</p>
            <p className={styles.featuredCardDescription}>{featuredCard.description}</p>
          </div>
          <Link href={featuredCard.ctaHref} className={styles.featuredCardCta}>
            {featuredCard.ctaLabel} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export const CommunityPanel = () => {
  const item = NAV_DATA.find(n => n.id === 'community')!;
  const { featuredCard } = item;

  return (
    <div className={styles.section}>
      <div className={styles.columnGrid}>
        {item.columns.map(col => (
          <div key={col.heading} className={styles.column}>
            <p className={styles.columnHeader}>{col.heading}</p>
            <hr className={styles.columnSeparator} />
            {col.links.map(link => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                <span className={styles.navLinkTitle}>{link.label}</span>
                <span className={styles.navLinkDescriptor}>{link.descriptor}</span>
              </Link>
            ))}
          </div>
        ))}

        <div className={styles.featuredCard}>
          <div className={styles.featuredCardBody}>
            <p className={styles.featuredCardTitle}>{featuredCard.title}</p>
            <p className={styles.featuredCardDescription}>{featuredCard.description}</p>
          </div>
          <Link href={featuredCard.ctaHref} className={styles.featuredCardCta}>
            {featuredCard.ctaLabel} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export const DataInsightsPanel = () => {
  const item = NAV_DATA.find(n => n.id === 'data-insights')!;
  const { featuredCard } = item;

  return (
    <div className={styles.section}>
      <div className={styles.columnGrid}>
        {item.columns.map(col => (
          <div key={col.heading} className={styles.column}>
            <p className={styles.columnHeader}>{col.heading}</p>
            <hr className={styles.columnSeparator} />
            {col.links.map(link => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                <span className={styles.navLinkTitle}>{link.label}</span>
                <span className={styles.navLinkDescriptor}>{link.descriptor}</span>
              </Link>
            ))}
          </div>
        ))}

        <div className={styles.featuredCard}>
          <div className={styles.featuredCardBody}>
            <p className={styles.featuredCardTitle}>{featuredCard.title}</p>
            <p className={styles.featuredCardDescription}>{featuredCard.description}</p>
          </div>
          <Link href={featuredCard.ctaHref} className={styles.featuredCardCta}>
            {featuredCard.ctaLabel} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export const PodcastPanel = () => {
  const item = NAV_DATA.find(n => n.id === 'podcast')!;
  const { featuredCard } = item;

  return (
    <div className={styles.section}>
      <div className={styles.columnGrid}>
        {item.columns.map(col => (
          <div key={col.heading} className={styles.column}>
            <p className={styles.columnHeader}>{col.heading}</p>
            <hr className={styles.columnSeparator} />
            {col.links.map(link => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                <span className={styles.navLinkTitle}>{link.label}</span>
                <span className={styles.navLinkDescriptor}>{link.descriptor}</span>
              </Link>
            ))}
          </div>
        ))}

        <div className={styles.featuredCard}>
          <div className={styles.featuredCardBody}>
            <p className={styles.featuredCardTitle}>{featuredCard.title}</p>
            <p className={styles.featuredCardDescription}>{featuredCard.description}</p>
          </div>
          <Link href={featuredCard.ctaHref} className={styles.featuredCardCta}>
            {featuredCard.ctaLabel} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ContactUsPanel = () => {
  const item = NAV_DATA.find(n => n.id === 'contact-us')!;
  const { featuredCard } = item;

  return (
    <div className={styles.section}>
      <div className={styles.columnGrid}>
        <div className={styles.featuredCard}>
          <div className={styles.featuredCardBody}>
            <p className={styles.featuredCardTitle}>{featuredCard.title}</p>
            <p className={styles.featuredCardDescription}>{featuredCard.description}</p>
          </div>
          <Link href={featuredCard.ctaHref} className={styles.featuredCardCta}>
            {featuredCard.ctaLabel} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Megamenu;
