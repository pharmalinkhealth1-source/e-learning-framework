"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Bento.module.css';

interface BentoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  span?: number;
  rowSpan?: number;
  className?: string;
  children?: React.ReactNode;
}

export const BentoCard: React.FC<BentoCardProps> = ({ 
  title, 
  description, 
  icon, 
  span = 1, 
  rowSpan = 1,
  className = "",
  children 
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div 
      ref={cardRef}
      className={`${styles.card} ${className}`}
      style={{ 
        gridColumn: `span ${span}`,
        gridRow: `span ${rowSpan}`
      }}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >

      <div className={styles.cardHeader}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.cardContent}>
        {children}
      </div>
      <div className={styles.glow} />
    </motion.div>
  );
};

export const BentoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.grid}>
      {children}
    </div>
  );
};

export const BentoTag: React.FC<{ label: string; color?: string }> = ({ label, color }) => (
  <span className={styles.tag} style={{ color }}>{label}</span>
);
