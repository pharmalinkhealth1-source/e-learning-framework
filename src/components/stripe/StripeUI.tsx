import React from 'react';
import styles from './StripeUI.module.css';

interface StripeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const StripeButton: React.FC<StripeButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className={styles.loader} /> : children}
    </button>
  );
};

interface StripeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const StripeInput: React.FC<StripeInputProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input 
        className={`${styles.input} ${error ? styles.inputError : ''} ${className}`} 
        {...props} 
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
