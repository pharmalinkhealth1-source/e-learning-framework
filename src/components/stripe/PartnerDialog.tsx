"use client";

import React, { useEffect, useState } from 'react';
import styles from './PartnerDialog.module.css';
import { X, User, Briefcase, Mail, Phone, CheckCircle2 } from 'lucide-react';
import CountrySelect from '@/components/shared/CountrySelect';
import { motion, AnimatePresence } from 'framer-motion';

interface PartnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}


export default function PartnerDialog({ isOpen, onClose }: PartnerDialogProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent scrolling on body when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSubmitted(false); // Reset when reopening
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={styles.dialog}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
          >
            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
            
            <div className={styles.content}>
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.header}>
                      <h2 className={styles.heading}>Partner with PharmaLink</h2>
                      <p className={styles.text}>
                        Advance healthcare together. Align your organization with PharmaLink to scale healthcare delivery across Africa.
                      </p>
                    </div>
                    
                    <form className={styles.form} onSubmit={handleSubmit}>
                      <div className={styles.fieldGroup}>
                        <label htmlFor="fullName" className={styles.label}>Full Name</label>
                        <div className={styles.inputWrapper}>
                          <User size={18} className={styles.inputIcon} />
                          <input type="text" id="fullName" name="fullName" className={styles.input} placeholder="Enter your full name" required />
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="jobTitle" className={styles.label}>Job Title</label>
                        <div className={styles.inputWrapper}>
                          <Briefcase size={18} className={styles.inputIcon} />
                          <input type="text" id="jobTitle" name="jobTitle" className={styles.input} placeholder="e.g. Director of Operations" required />
                        </div>
                      </div>
                      
                      <div className={styles.formRow}>
                        <div className={styles.fieldGroup}>
                          <label htmlFor="workEmail" className={styles.label}>Work Email</label>
                          <div className={styles.inputWrapper}>
                            <Mail size={18} className={styles.inputIcon} />
                            <input type="email" id="workEmail" name="workEmail" className={styles.input} placeholder="name@company.com" required />
                          </div>
                        </div>
                        <div className={styles.fieldGroup}>
                          <label htmlFor="phoneNumber" className={styles.label}>Phone Number</label>
                          <div className={styles.inputWrapper}>
                            <Phone size={18} className={styles.inputIcon} />
                            <input type="tel" id="phoneNumber" name="phoneNumber" className={styles.input} placeholder="+234..." required />
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.fieldGroup}>
                        <label htmlFor="country" className={styles.label}>Country</label>
                        <CountrySelect id="country" name="country" required />
                      </div>
                      
                      <div className={styles.checkboxGroup}>
                        <input type="checkbox" id="consent" name="consent" className={styles.checkbox} required />
                        <label htmlFor="consent" className={styles.checkboxLabel}>
                          I consent to receiving communication from PharmaLink regarding partnership opportunities.
                        </label>
                      </div>
                      
                      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className={styles.loader}>Sending...</span>
                        ) : (
                          "Submit Partnership Inquiry"
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success"
                    className={styles.successMessage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  >
                    <div className={styles.successIconWrapper}>
                      <CheckCircle2 size={64} className={styles.successIcon} />
                    </div>
                    <h2 className={styles.successHeading}>Inquiry Sent!</h2>
                    <p className={styles.successText}>
                      Thank you for your interest in partnering with PharmaLink. Our team will review your inquiry and get back to you within 2-3 business days.
                    </p>
                    <button onClick={onClose} className={styles.secondaryBtn}>
                      Close Dialog
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
