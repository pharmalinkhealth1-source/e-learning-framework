"use client";

import React from 'react';
import styles from './AuthLayout.module.css';
import MeshGradient from './MeshGradient';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.gradientBg}>
        <MeshGradient 
          colors={['#f3f9ff', '#e8f2ff', '#ffffff', '#f0f7ff']} 
          speed={0.005} 
        />
      </div>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <svg viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
            <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.27 2.55 1.61 0 2.98-.37 3.91-.9l.79 2.44c-1.27.77-3.14 1.25-5.23 1.25-4.47 0-7.24-2.61-7.24-7.06 0-4.35 2.72-7.12 6.73-7.12 4.03 0 6.16 2.68 6.16 6.3 0 .62-.06 1.29-.33 2.54zm-8.11-2.36h4.68c-.17-1.61-1.49-2.34-2.38-2.34-1.24 0-2.1 1-2.3 2.34zM26.83 19.2V7.12h3.3v1.54c1.11-1.34 2.49-1.99 4.31-1.99 3.51 0 5.47 2.34 5.47 6.1v6.43h-3.41v-6.04c0-2.11-1.11-3.32-2.91-3.32-1.4 0-2.43.91-2.82 2.21v7.15h-3.94zm-8.32-3.35c0 2.25 1.74 3.32 4.14 3.32 1.34 0 2.34-.33 3.09-.77l.79 2.4c-.94.6-2.54 1.11-4.57 1.11-4.06 0-7.06-2.11-7.06-6.3V7.12h-2.34V4.41l2.34-.65 1.11-3.14h2.51v3.79h4.31v2.71h-4.31v8.73zm-2.48-12.35c0 1.24-1.02 2.24-2.25 2.24-1.24 0-2.25-1-2.25-2.24 0-1.24 1.02-2.25 2.25-2.25 1.23 0 2.25 1.01 2.25 2.25zm-4.14 15.7V7.12h3.41v12.08h-3.41zM0 19.2V4.41l3.41-.65v2.51c1.11-1.85 3.14-2.71 5.25-2.71 3.54 0 6.64 2.3 6.64 6.3 0 4.14-3.1 6.57-6.64 6.57-2.11 0-4.14-.86-5.25-2.71v5.49L0 19.2zm3.41-8.11c0 2.21 1.61 3.54 3.51 3.54s3.51-1.34 3.51-3.54c0-2.2-1.61-3.51-3.51-3.51s-3.51 1.31-3.51 3.51z" fill-rule="evenodd"/>
          </svg>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
