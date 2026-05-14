"use client";

import React from 'react';
import styles from './KeynoteSection.module.css';

interface Speaker {
  name: string;
  role: string;
  company: string;
}

interface KeynoteSectionProps {
  title: string;
  ctaText: string;
  ctaLink: string;
  logo?: React.ReactNode;
  speakers: Speaker[];
  themeColor?: string;
}

const KeynoteSection = ({ 
  title, 
  ctaText, 
  ctaLink, 
  logo, 
  speakers,
  themeColor = '#302554'
}: KeynoteSectionProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.keynoteWrapper} style={{ backgroundColor: themeColor }}>
          <div className={styles.keynoteContent}>
            <div className={styles.headerText}>
              {title}
              <div style={{ marginTop: '24px' }}>
                <a href={ctaLink} className={styles.ctaButton}>
                  {ctaText}
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M0.5 5.5h7" />
                    <path d="M1.5 1.5l4 4-4 4" />
                  </svg>
                </a>
              </div>
            </div>
            
            {logo && (
              <div className={styles.logoWrapper}>
                {logo}
              </div>
            )}
          </div>
          
          <div className={styles.speakers}>
            {speakers.map((speaker, index) => (
              <div 
                key={speaker.name} 
                className={`${styles.speakerCard} ${styles[`speaker${index + 1}`]}`}
              >
                <div className={styles.speakerImage} />
                <div className={styles.speakerInfo}>
                  <div className={styles.speakerName}>{speaker.name}</div>
                  <div className={styles.speakerTitle}>{speaker.company}, {speaker.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeynoteSection;
