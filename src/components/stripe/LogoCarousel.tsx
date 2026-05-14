"use client";

import React from 'react';
import styles from './LogoCarousel.module.css';

const logos = [
  { name: 'Takeda', src: '/images/logos/partners-logos/Takeda_idUdjJ8WQa_0.svg' },
  { name: 'APhA', src: '/images/logos/partners-logos/Apha_logo.svg' },
  { name: 'Ethiopian MoH', src: '/images/logos/partners-logos/Ministry-of-Health-Ethiopia.svg' },
  { name: 'EPA', src: '/images/logos/partners-logos/Ethiopian-Pharmaceutical-Association.webp' },
  { name: 'ACPN', src: '/images/logos/partners-logos/Association-of-Community-Pharmacists-of-Nigeria.svg' },
  { name: 'NPHCDA', src: '/images/logos/partners-logos/National-Primary-Health-Care-Development-Agency-NPHCDA.svg' },
  { name: 'PSK', src: '/images/logos/partners-logos/The-Pharmaceutical-Society-of-Kenya-PSK.svg' },
  { name: 'Nairobi CC', src: '/images/logos/partners-logos/Nairobi_City_Logotype.png' },
];

const LogoCarousel = () => {
  return (
    <div className={styles.carousel}>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {logos.map((logo, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.logoWrapper}>
                <img 
                  src={logo.src} 
                  alt={logo.name} 
                  className={styles.logoImage}
                  loading="lazy"
                />
                <div className={styles.tooltip}>{logo.name}</div>
              </div>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {logos.map((logo, i) => (
            <div key={`dup-${i}`} className={styles.item}>
              <div className={styles.logoWrapper}>
                <img 
                  src={logo.src} 
                  alt={logo.name} 
                  className={styles.logoImage}
                  loading="lazy"
                />
                <div className={styles.tooltip}>{logo.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel;
