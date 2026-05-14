"use client";

import React, { useEffect } from 'react';
import styles from './WaitlistDialog.module.css';
import { X } from 'lucide-react';

interface WaitlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistDialog({ isOpen, onClose }: WaitlistDialogProps) {
  // Prevent scrolling on body when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        
        <div className={styles.content}>
          <h3 className={styles.heading}>
            This course is currently available to pilot participants only. More courses will be available to all members soon – watch this space.
          </h3>
          <p className={styles.text}>
            Drop your details below—we'll let you know as soon as new opportunities go live.
          </p>
          
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.fieldGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input type="text" id="name" name="name" className={styles.input} placeholder="Name" required />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input type="email" id="email" name="email" className={styles.input} placeholder="Your best email here" required />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number</label>
                <input type="tel" id="phone" name="phone" className={styles.input} placeholder="Phone Number" />
              </div>
            </div>
            
            <div className={styles.fieldGroup}>
              <label htmlFor="organization" className={styles.label}>Organization / Company (if applicable)</label>
              <input type="text" id="organization" name="organization" className={styles.input} placeholder="e.g., Acme Corp, Gov. Ministry, Freelance, N/A" />
            </div>
            
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="consent" name="consent" className={styles.checkbox} />
              <label htmlFor="consent" className={styles.checkboxLabel}>
                I consent to receiving communication from PharmaLink.
              </label>
            </div>
            
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="terms" name="terms" className={styles.checkbox} required />
              <label htmlFor="terms" className={styles.checkboxLabel}>
                I accept the <a href="#">Terms & Conditions</a>
              </label>
            </div>
            
            <button type="submit" className={styles.submitBtn}>
              Send Message to PharmaLink
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
