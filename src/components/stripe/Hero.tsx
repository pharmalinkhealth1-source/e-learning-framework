"use client";

import React from 'react';
import { motion } from 'framer-motion';
import MeshGradient from './MeshGradient';
import styles from './Hero.module.css';

const Hero = () => {
  const stripeColors = ['#ef9cda', '#7241dc', '#1a56ff', '#00d4ff'];

  return (
    <section className={styles.hero}>
      <div className={styles.gradientWrapper}>
        <MeshGradient colors={stripeColors} speed={0.005} />
      </div>
      
      <div className={`container ${styles.container}`}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.title}>
            Financial infrastructure <br />
            <span>for the internet</span>
          </h1>
          
          <p className={styles.subtitle}>
            Millions of companies of all sizes—from startups to Fortune 500s—use 
            Stripe’s software and APIs to accept payments, send payouts, and 
            manage their businesses online.
          </p>
          
          <div className={styles.actions}>
            <button className={styles.primaryBtn}>
              Start now
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
            
            <button className={styles.secondaryBtn}>
              Contact sales
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
      
      <div className={styles.bottomSkew} />
    </section>
  );
};

export default Hero;
