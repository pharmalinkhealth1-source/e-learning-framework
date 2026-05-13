"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './CongressSection.module.css';

const CongressSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth transition from original background to #24124a, remaining dark once fully scrolled to
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4],
    ["#ffffff", "#24124a"]
  );

  return (
    <motion.section 
      ref={containerRef}
      className={styles.section}
      style={{ backgroundColor }}
    >
      <div className={styles.container}>
        <div className={styles.card}>
          <img 
            src="/images/marketing/conference-bg.webp" 
            alt="World Vaccine Congress audience" 
            className={styles.backgroundImage}
          />
          <div className={styles.overlay} />
          
          <div className={styles.content}>
            <div className={styles.eyebrow}>Join us at</div>
            <h2 className={styles.title}>World Vaccine Congress 2027</h2>
            <a href="https://www.terrapinn.com/conference/world-vaccine-congress-washington/index.stm" className={styles.ctaButton}>
              Register for Congress
              <svg className={styles.ctaIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line className={styles.iconLine} x1="3" y1="12" x2="19" y2="12"></line>
                <polyline className={styles.iconChevron} points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
          
          <div className={styles.footer}>
            <div className={styles.branding}>
              <div className={styles.leadingEdge} />
              <span className={styles.pharmaLink}>PHARMALINK</span>
              <span className={styles.xSeparator}>×</span>
              <span className={styles.partner}>WVCDC</span>
            </div>
            
            <div className={styles.metadata}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Schedule</span>
                <span className={styles.metaValue}>8–11 March, 2027</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Location</span>
                <span className={styles.metaValue}>Washington D.C., USA</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.sectionFooter}>
          <a href="/events" className={styles.viewAllCta}>
            View all events and webinars
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 7h12M7 1l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default CongressSection;
