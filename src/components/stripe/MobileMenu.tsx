"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_DATA } from '@/lib/nav-data';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, triggerRef }) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
    setOpenItem(null);
  };

  const toggleItem = (id: string) => {
    setOpenItem(prev => prev === id ? null : id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className={styles.overlayHeader}>
              <span className={styles.overlayTitle}>Menu</span>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close navigation menu"
              >
                ×
              </button>
            </div>

            <nav className={styles.accordionNav}>
              {NAV_DATA.map(item => (
                <div key={item.id} className={styles.accordionItem}>
                  {item.columns.length > 0 ? (
                    <>
                      <button
                        className={styles.accordionTrigger}
                        onClick={() => toggleItem(item.id)}
                        aria-expanded={openItem === item.id}
                      >
                        <span>{item.label}</span>
                        <span className={`${styles.chevron} ${openItem === item.id ? styles.chevronOpen : ''}`}>
                          ›
                        </span>
                      </button>
                      <AnimatePresence>
                        {openItem === item.id && (
                          <motion.div
                            className={styles.accordionContent}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.columns.flatMap(col => col.links).map(link => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={styles.accordionLink}
                                onClick={handleLinkClick}
                              >
                                <span className={styles.accordionLinkTitle}>{link.label}</span>
                                <span className={styles.accordionLinkDescriptor}>{link.descriptor}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.featuredCard.ctaHref}
                      className={styles.accordionDirectLink}
                      onClick={handleLinkClick}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
