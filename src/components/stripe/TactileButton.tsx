'use client';

import React from 'react';
import styles from './TactileButton.module.css';

type Variant = 'primary' | 'secondary' | 'outline' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

export function TactileButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: TactileButtonProps) {
  return (
    <button
      className={[
        styles.tactileButton,
        styles[variant],
        styles[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
