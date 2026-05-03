"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Megamenu.module.css';

interface MegamenuProps {
  activeTab: string | null;
  tabs: { id: string; label: string; content: React.ReactNode }[];
}

const Megamenu: React.FC<MegamenuProps> = ({ activeTab, tabs }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, left: 0 });
  const activeContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeContentRef.current) {
      const { offsetWidth, offsetHeight } = activeContentRef.current;
      setDimensions({
        width: offsetWidth,
        height: offsetHeight,
        left: 0, // Left is handled by the parent relative to the link
      });
    }
  }, [activeTab]);

  const activeContent = tabs.find(t => t.id === activeTab)?.content;

  return (
    <div className={styles.dropdownWrapper}>
      <AnimatePresence>
        {activeTab && (
          <motion.div
            layoutId="dropdown-container"
            className={styles.dropdownContainer}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              width: dimensions.width || 'auto',
              height: dimensions.height || 'auto',
            }}
          >
            <div className={styles.dropdownContent} ref={activeContentRef}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeContent}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className={styles.arrow} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ProductsContent = () => (
  <div className={styles.pane}>
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>Payments</h4>
      <ul className={styles.list}>
        <li>Online Payments</li>
        <li>Checkout</li>
        <li>Elements</li>
      </ul>
    </div>
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>Financial Services</h4>
      <ul className={styles.list}>
        <li>Issuing</li>
        <li>Treasury</li>
        <li>Capital</li>
      </ul>
    </div>
  </div>
);

export const SolutionsContent = () => (
  <div className={styles.pane}>
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>By Industry</h4>
      <ul className={styles.list}>
        <li>E-commerce</li>
        <li>SaaS</li>
        <li>Marketplaces</li>
      </ul>
    </div>
  </div>
);

export const DevelopersContent = () => (
  <div className={styles.pane}>
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>Documentation</h4>
      <ul className={styles.list}>
        <li>Quickstart</li>
        <li>Libraries</li>
        <li>API Reference</li>
      </ul>
    </div>
  </div>
);

export default Megamenu;
