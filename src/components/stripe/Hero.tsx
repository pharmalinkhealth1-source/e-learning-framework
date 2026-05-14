"use client";

import React from 'react';
import styles from './Hero.module.css';
import GDPCounter from './GDPCounter';
import LogoCarousel from './LogoCarousel';

const Hero = () => {
  const line1 = "Elevating the Frontline.";
  const line2 = "Transforming Care.";
  const line3 = "Strengthening Health Systems Across Africa.";

  return (
    <section className={`${styles.heroSectionContainer} ${styles.section} ${styles.sectionWhite} ${styles.hdsModeLight}`}>
      <div className={`${styles.sectionContainer} ${styles.heroSectionLayout}`}>
        <div className={styles.heroSectionLayoutGrid}>
          <div className={styles.heroSectionEyebrow} aria-hidden="true">
            <span className={styles.heroSectionEyebrowLabel}>Scaling Pan-African Frontline Care:</span>
            <span className={`${styles.heroSectionEyebrowValue} ${styles.tabularNumsTight}`}>
              <GDPCounter /> members networked
            </span>
          </div>
          
          <h1 className={`${styles.hdsHeading} ${styles.heroSectionTitle} ${styles.heroSectionTitleBackground} ${styles.hdsHeadingXl}`} aria-hidden="false" data-testid="homepage-hero-title">
            <em className={styles.heroSectionTitleMain}>
              {line1}<br />
              <i className={styles.heroSectionTitleHighlight}>{line2}</i><br />
              <span className={styles.heroSectionTitleGradient}>{line3}</span>
            </em>
          </h1>
          
          <h1 className={`${styles.hdsHeading} ${styles.heroSectionTitle} ${styles.heroSectionTitleForeground} ${styles.hdsHeadingXl}`} aria-hidden="true">
            <em className={styles.heroSectionTitleMain}>
              {line1}<br />
              <i className={styles.heroSectionTitleHighlight}>{line2}</i><br />
              <span className={styles.heroSectionTitleGradient}>{line3}</span>
            </em>
          </h1>

          <p className={styles.heroSectionDescription}>
            PharmaLink equips pharmacists with the training, community, and data insights they need to deliver world-class primary healthcare – right where their communities need it most.
          </p>
          
          <div className={`${styles.hdsButtonGroup} ${styles.heroSectionActions}`}>
            <a href="https://dashboard.stripe.com/register" className={`${styles.hdsButton} ${styles.hdsButtonPrimary}`} data-analytics-label="hero__get_started">
              Join the Network
              <svg className={styles.hdsIconHoverArrow} width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M0.5 5.5h7" />
                <path d="M1.5 1.5l4 4-4 4" />
              </svg>
            </a>
            <a href="https://dashboard.stripe.com/login/oauth/google/init" className={`${styles.hdsButton} ${styles.hdsButtonSecondary} ${styles.heroSectionButtonGoogle}`} data-analytics-label="hero__sign_up_with_google">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              Explore Courses
            </a>
          </div>
        </div>
      </div>

      <div className={`${styles.sectionContainer} ${styles.heroLogoSection}`}>
        <LogoCarousel />
      </div>
    </section>
  );
};

export default Hero;
