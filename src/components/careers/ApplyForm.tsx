'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import styles from './ApplyModal.module.css';

interface ApplyFormProps {
  jobTitle: string;
  onSuccess: () => void;
}

export const ApplyForm: React.FC<ApplyFormProps> = ({ jobTitle, onSuccess }) => {
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: isLoaded && user ? `${user.firstName} ${user.lastName}` : '',
    email: isLoaded && user ? user.primaryEmailAddress?.emailAddress || '' : '',
    phone: '',
    links: '',
    note: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, ...formData }),
      });

      if (!res.ok) throw new Error('Submission failed');
      onSuccess();
    } catch {
      alert('Failed to submit application. Please try again or email info@pharmalinkhealth.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="fullName">Full Name</label>
        <input 
          id="fullName"
          name="fullName"
          type="text" 
          className={styles.input} 
          value={formData.fullName}
          onChange={handleChange}
          required 
          placeholder="Jane Doe"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="email">Email Address</label>
        <input 
          id="email"
          name="email"
          type="email" 
          className={styles.input} 
          value={formData.email}
          onChange={handleChange}
          required 
          placeholder="jane@example.com"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="phone">Phone Number</label>
        <input 
          id="phone"
          name="phone"
          type="tel" 
          className={styles.input} 
          value={formData.phone}
          onChange={handleChange}
          required 
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="links">LinkedIn / Portfolio</label>
        <input 
          id="links"
          name="links"
          type="url" 
          className={styles.input} 
          value={formData.links}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/..." 
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="note">Why PharmaLink?</label>
        <textarea 
          id="note"
          name="note"
          className={styles.textarea} 
          value={formData.note}
          onChange={handleChange}
          rows={3}
          placeholder="Tell us about your interest in this role..."
        ></textarea>
      </div>

      <div className={styles.footer}>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};
