"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './DirectorQuoteSection.module.css';
import PartnerDialog from './PartnerDialog';

const DirectorQuoteSection = () => {
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.imageWrapper}>
            <div className={styles.imageContainer}>
              <Image 
                src="/images/leadership-team/Betty_Abera-PharmaLink-Project-Director.webp" 
                alt="Betty Abera - PharmaLink Project Director"
                fill
                className={styles.image}
                priority
              />
              <div className={styles.imageOverlay} />
            </div>
            <div className={styles.nameCard}>
              <div className={styles.leadingEdge} />
              <div className={styles.nameInfo}>
                <h3 className={styles.name}>Betty Abera</h3>
                <p className={styles.position}>Project Director, PharmaLink</p>
              </div>
            </div>
          </div>
          
          <div className={styles.content}>
            <div className={styles.quoteIcon}>
              <svg width="60" height="48" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 0C11.9 0 8 1.6 4.8 4.8C1.6 8 0 11.9 0 16.5C0 26.5 6.5 37.5 19.5 48L24 43.5C18 36.5 15 29.5 15 22.5V16.5H24V0H16.5ZM52.5 0C47.9 0 44 1.6 40.8 4.8C37.6 8 36 11.9 36 16.5C36 26.5 42.5 37.5 55.5 48L60 43.5C54 36.5 51 29.5 51 22.5V16.5H60V0H52.5Z" fill="#7a3dfc" fillOpacity="0.1"/>
              </svg>
            </div>
            
            <blockquote className={styles.quote}>
              “Engaging pharmacists to scale up vaccine delivery isn’t just innovation, it’s a necessity! By reimagining primary care through pharmacies, we remove barriers for patients, ease the public health burden, and fast-track Africa’s journey toward universal health coverage.”
            </blockquote>
            
            <div className={styles.actions}>
              <div className={styles.primaryActionWrapper}>
                <button 
                  onClick={() => setIsPartnerOpen(true)} 
                  className={styles.primaryButton}
                >
                  Partner with PharmaLink
                  <svg className={styles.hdsIconHoverArrow} width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M0.5 5.5h7" />
                    <path d="M1.5 1.5l4 4-4 4" />
                  </svg>
                </button>
                <p className={styles.actionSubtext}>Advance healthcare together. Align your organization with PharmaLink to scale healthcare delivery across Africa.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PartnerDialog 
        isOpen={isPartnerOpen} 
        onClose={() => setIsPartnerOpen(false)} 
      />
    </section>
  );
};

export default DirectorQuoteSection;
