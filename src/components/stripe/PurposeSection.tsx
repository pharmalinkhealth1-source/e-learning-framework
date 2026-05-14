"use client";

import React from 'react';
import Image from 'next/image';
import styles from './PurposeSection.module.css';
import { motion } from 'framer-motion';

const PurposeSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.contentColumn}>
            <div className={styles.header}>
              <span className={styles.eyebrow}>The PharmaLink Mission</span>
              <h2 className={styles.title}>Bridging Gaps with Innovative Care</h2>
            </div>

            <div className={styles.narrative}>
              <motion.div 
                className={styles.missionItem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className={styles.itemTitle}>
                  <svg width="22" height="21" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', flexShrink: 0 }}>
                    <defs>
                      <clipPath id="gapDiagTop">
                        <polygon points="0,0 40,0 40,40" />
                      </clipPath>
                      <clipPath id="gapDiagBottom">
                        <polygon points="0,0 0,40 40,40" />
                      </clipPath>
                    </defs>
                    {/* Top-right Africa half — shifted up-right */}
                    <g clipPath="url(#gapDiagTop)" transform="translate(2,-2)">
                      <path d="M13,1 L28,1 L33,6 L36,12 L35,17 L34,22 L30,30 L22,39 L18,39 L14,33 L8,25 L6,17 L6,11 L8,6 L11,3 Z" fill="#F9AEEB" />
                    </g>
                    {/* Bottom-left Africa half — shifted down-left */}
                    <g clipPath="url(#gapDiagBottom)" transform="translate(-2,2)">
                      <path d="M13,1 L28,1 L33,6 L36,12 L35,17 L34,22 L30,30 L22,39 L18,39 L14,33 L8,25 L6,17 L6,11 L8,6 L11,3 Z" fill="#F9AEEB" />
                    </g>
                    {/* Arrows over both halves */}
                    <path fillRule="evenodd" clipRule="evenodd" d="M29.9997 15.5335V19h-7.9993c-1.1046 0-2.0007.8954-2.0007 2s.8961 2 2.0007 2h7.9993v3.4665c0 .6241.7178.9752 1.2105.592l7.0283-5.4665c.3861-.3002.3861-.8837 0-1.184l-7.0283-5.4665c-.4927-.3832-1.2105-.0321-1.2105.592Zm-19.9997 6V25h7.9987C19.1032 25 20 25.8954 20 27s-.8968 2-2.0013 2H10v3.4665c0 .6241-.71781.9752-1.21045.592L1.76116 27.592c-.38606-.3002-.38606-.8837 0-1.184l7.02839-5.4665C9.28219 20.5583 10 20.9094 10 21.5335Z" fill="#6C30C0" />
                  </svg>
                  <span className={styles.label}>The Gap:</span>
                </h3>
                <p>
                  Across Africa, pharmacists are the invisible backbone of healthcare—reaching patients formal systems miss, yet operating under-resourced and under-connected.
                </p>
              </motion.div>

              <motion.div 
                className={styles.missionItem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className={styles.itemTitle}>
                  <svg width="22" height="21" viewBox="11 29 41 39" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', flexShrink: 0 }}>
                    <defs>
                      <path id="fixShield" d="M29.5 31.2727C29.5 31.2727 35.8 35.866 43 35.866V45.9713C43 60.6698 31.3 66.1818 29.5 66.1818C27.7 66.1818 16 60.6698 16 45.9713V35.866C23.2 35.866 29.5 31.2727 29.5 31.2727Z" />
                      <path id="fixContent" fillRule="evenodd" clipRule="evenodd" d="M12 31.27H47V66.27H12V31.27ZM26.0385 46.7422C26.0385 44.8246 27.5882 43.27 29.5 43.27C31.4118 43.27 32.9615 44.8246 32.9615 46.7422V48.1311H33.3077C33.69 48.1311 34 48.442 34 48.8256V52.9922C34 53.7593 33.3801 54.3811 32.6154 54.3811H26.3846C25.6199 54.3811 25 53.7593 25 52.9922V48.8256C25 48.442 25.31 48.1311 25.6923 48.1311H26.0385V46.7422ZM29.5 44.6589C30.6471 44.6589 31.5769 45.5917 31.5769 46.7423V48.1312H27.4231V46.7423C27.4231 45.5917 28.353 44.6589 29.5 44.6589Z" />
                      <path id="fixCheck" d="M42 30C46.9706 30 51 34.0294 51 39C51 43.9706 46.9706 48 42 48C37.0294 48 33 43.9706 33 39C33 34.0294 37.0294 30 42 30ZM45.94 34.73L40 40.78L38.43 39C38.1336 38.7182 37.6762 38.6943 37.352 38.9436C37.0279 39.193 36.9337 39.6413 37.13 40L39 43.2C39.1823 43.4942 39.5039 43.6732 39.85 43.6732C40.1961 43.6732 40.5177 43.4942 40.7 43.2C41 42.79 46.7 35.63 46.7 35.63C47.45 34.83 46.54 34.12 45.94 34.73Z" />
                      <clipPath id="fixShieldClip">
                        <use href="#fixShield" />
                      </clipPath>
                    </defs>
                    <use href="#fixCheck" fill="#6C30C0" />
                    <g clipPath="url(#fixShieldClip)">
                      <use href="#fixContent" fill="#F9AEEB" />
                      <use href="#fixCheck" fill="#CC2DA8" />
                    </g>
                  </svg>
                  <span className={styles.label}>The Fix:</span>
                </h3>
                <p>
                  PharmaLink equips these trusted providers with modern tools and peer networks, bringing them in from the margins.
                </p>
              </motion.div>

              <motion.div 
                className={styles.missionItem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className={styles.itemTitle}>
                  <svg viewBox="0 0 39 37" xmlns="http://www.w3.org/2000/svg" width="22" height="21" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', flexShrink: 0 }}>
                    <defs>
                      <clipPath id="areaChartClip">
                        <path d="M1.55 35.68l12.32-6.4a1 1 0 0 0 .44-.45L24.8 6.7a1 1 0 0 1 1.56-.33l12.3 10.64a1 1 0 0 1 .34.76V33a4 4 0 0 1-4 4H1.87a.7.7 0 0 1-.32-1.32z" />
                      </clipPath>
                    </defs>
                    <path d="M1.55 35.68l12.32-6.4a1 1 0 0 0 .44-.45L24.8 6.7a1 1 0 0 1 1.56-.33l12.3 10.64a1 1 0 0 1 .34.76V33a4 4 0 0 1-4 4H1.87a.7.7 0 0 1-.32-1.32z" fill="#F9AEEB" />
                    <path d="M.76 34.6L12.1 19.26a1 1 0 0 1 1.09-.37l11.65 3.4a1 1 0 0 0 1.17-.5L37.1.6a1 1 0 0 1 1.89.46V33a4 4 0 0 1-4 4H1.97a1.5 1.5 0 0 1-1.2-2.4z" fill="#6C30C0" />
                    <g clipPath="url(#areaChartClip)">
                      <path d="M.76 34.6L12.1 19.26a1 1 0 0 1 1.09-.37l11.65 3.4a1 1 0 0 0 1.17-.5L37.1.6a1 1 0 0 1 1.89.46V33a4 4 0 0 1-4 4H1.97a1.5 1.5 0 0 1-1.2-2.4z" fill="#CC2DA8" />
                    </g>
                  </svg>
                  <span className={styles.label}>The Impact:</span>
                </h3>
                <p>
                  We are proving that when frontline providers are equipped and valued, communities get healthier and health systems get stronger.
                </p>
              </motion.div>
            </div>
          </div>
          
          <div className={styles.imageColumn}>
            <motion.div 
              className={styles.imageWrapper}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className={styles.imageContainer}>
                <Image 
                  src="/images/homepage/Nigeria-Pharmacist.webp" 
                  alt="Professional African Pharmacist"
                  fill
                  className={styles.image}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={styles.imageOverlay} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PurposeSection;
