'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApplyForm } from './ApplyForm';
import styles from './ApplyModal.module.css';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, onClose, jobTitle }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSuccess = () => setSubmitted(true);

  const handleClose = () => {
    onClose();
    setTimeout(() => setSubmitted(false), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {submitted ? (
              <div className={styles.successView}>
                <div className={styles.successIcon}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M6 16l7 7L26 9" stroke="var(--hds-color-util-brand-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className={styles.title}>Application sent!</h3>
                <p className={styles.subtitle}>
                  Thank you for applying for <strong>{jobTitle}</strong>. We&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.header}>
                  <h2 className={styles.title}>Apply for {jobTitle}</h2>
                  <p className={styles.subtitle}>Complete the form below and we&apos;ll review your application.</p>
                </div>
                <ApplyForm jobTitle={jobTitle} onSuccess={handleSuccess} />
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
