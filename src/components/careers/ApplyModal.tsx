'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ApplyModal.module.css';
import { useUser } from '@clerk/nextjs';
import { ApplyForm } from './ApplyForm';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, onClose, jobTitle }) => {
  const { user, isLoaded } = useUser();

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div 
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {!isSuccess ? (
            <>
              <div className={styles.header}>
                <h2 className={styles.title}>Apply for {jobTitle}</h2>
                <p className={styles.subtitle}>Complete the form below to submit your application.</p>
              </div>

              <ApplyForm 
                jobTitle={jobTitle} 
                onSuccess={() => setIsSuccess(true)} 
              />
            </>
          ) : (
            <motion.div 
              className={styles.successView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.successIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#635bff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2 className={styles.title}>Application Sent!</h2>
              <p className={styles.subtitle}>
                Thank you for applying for the <strong>{jobTitle}</strong> position. 
                Our team will review your application and get back to you soon.
              </p>
              <button className={styles.submitButton} onClick={onClose}>
                Close
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
