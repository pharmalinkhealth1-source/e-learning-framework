"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './ModularSolutions.module.css';

const ForumGraphic = () => {
  // Generate random positions for "topic orbs"
  const orbs = useMemo(() => [
    { id: 1, x: '20%', y: '30%', size: 40, delay: 0, color: '#b8a9d1' }, // Muted Purple
    { id: 2, x: '70%', y: '20%', size: 55, delay: 1, color: '#f2c2e0' }, // Muted Pink
    { id: 3, x: '50%', y: '60%', size: 45, delay: 0.5, color: '#a5d6a7' }, // Muted Clinical Green
    { id: 4, x: '80%', y: '70%', size: 35, delay: 1.5, color: '#b8a9d1' }, // Muted Purple
    { id: 5, x: '15%', y: '75%', size: 50, delay: 0.8, color: '#f2c2e0' }, // Muted Pink
  ], []);

  // Avatars for the orbs
  const avatars = [
    '/images/avatars/female-1.png',
    '/images/avatars/male-1.png',
    '/images/avatars/female-2.png',
    '/images/avatars/male-2.png',
    '/images/avatars/female-3.png',
  ];

  return (
    <div className={styles.forumGraphicWrapper}>
      <svg className={styles.forumConnections} width="100%" height="100%">
        {/* Simple lines connecting orbs */}
        <line x1="20%" y1="30%" x2="50%" y2="60%" stroke="#e5edf5" strokeWidth="1" />
        <line x1="50%" y1="60%" x2="70%" y2="20%" stroke="#e5edf5" strokeWidth="1" />
        <line x1="50%" y1="60%" x2="80%" y2="70%" stroke="#e5edf5" strokeWidth="1" />
        <line x1="20%" y1="30%" x2="15%" y2="75%" stroke="#e5edf5" strokeWidth="1" />
      </svg>

      {orbs.map((orb, i) => (
        <motion.div
          key={orb.id}
          className={styles.forumOrb}
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            borderColor: orb.color,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: orb.delay },
            scale: { duration: 0.5, delay: orb.delay },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: orb.delay,
            }
          }}
        >
          <img 
            src={avatars[i % avatars.length]} 
            alt="User" 
            className={styles.orbAvatar} 
          />
          {/* Orbital Spinning Dot */}
          <motion.div 
            className={styles.orbOrbit}
            animate={{ rotate: 360 }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "linear" }}
          >
            <div className={styles.orbSpinningDot} style={{ backgroundColor: orb.color }} />
          </motion.div>
        </motion.div>
      ))}

      {/* Floating Message Bubbles */}
      <motion.div 
        className={styles.forumBubble}
        style={{ top: '40%', left: '35%' }}
        animate={{ y: [0, -15, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={styles.bubbleTip} />
        New Post in "Clinical Trials"
      </motion.div>

      <motion.div 
        className={styles.forumBubble}
        style={{ top: '25%', left: '55%' }}
        animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className={styles.bubbleTip} />
        Peer support active
      </motion.div>
    </div>
  );
};

export default ForumGraphic;
