'use client';

import React from 'react';
import styles from './PartnerLogos.module.css';

const PARTNERS = [
  { name: 'BMW', color: '#0066b3' },
  { name: 'amazon', color: '#232f3e' },
  { name: 'N26', color: '#36a18b' },
  { name: 'NVIDIA', color: '#76b900' },
  { name: 'axel springer', color: '#005293' },
  { name: 'Google', color: '#4285f4' },
  { name: 'MILES', color: '#000000' },
  { name: 'shopify', color: '#96bf48' },
];

const PartnerLogos = () => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {PARTNERS.map((partner) => (
          <div key={partner.name} className={styles.partner}>
            <span style={{ color: partner.color }} className={styles.logoText}>
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerLogos;
