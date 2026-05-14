'use client';

import React from 'react';
import styles from './NetworkJoinGraphic.module.css';
import { PhoneMockup, BrowserMockup } from './NetworkMockups';

const NetworkJoinGraphic = () => {
  return (
    <div className={styles.container}>
      {/* Animated Phone Component */}
      <PhoneMockup />

      {/* Animated Browser Component */}
      <BrowserMockup />
    </div>
  );
};

export default NetworkJoinGraphic;
