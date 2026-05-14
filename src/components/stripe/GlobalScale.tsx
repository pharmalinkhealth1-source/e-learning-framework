"use client";

import React from 'react';
import styles from './GlobalScale.module.css';

const stats = [
  { label: 'API requests per day', value: '500M+' },
  { label: 'Historical uptime', value: '99.999%' },
  { label: 'Currencies supported', value: '135+' },
  { label: 'Local acquiring', value: '47' },
];

const GlobalScale = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.text}>
            <h2 className={styles.title}>Global scale. Local presence.</h2>
            <p className={styles.description}>
              A single integration to accept payments in 47 countries and 135+ currencies, 
              with local acquiring to help you reach more customers.
            </p>
          </div>
          
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Simplified Globe Placeholder */}
        <div className={styles.globeWrapper}>
          <div className={styles.globeGlow} />
        </div>
      </div>
    </section>
  );
};

export default GlobalScale;
