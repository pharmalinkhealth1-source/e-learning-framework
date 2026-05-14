"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react';
import { urlForImage } from '@/sanity/lib/image';
import styles from './SpotlightCarousel.module.css';

export interface Spotlight {
  _id: string;
  name: string;
  slug: { current: string };
  jobTitle: string;
  country: string;
  quote: string;
  excerpt: string;
  image?: {
    asset?: any;
    url?: string;
    externalUrl?: string;
    alt?: string;
  };
}

interface SpotlightCarouselProps {
  spotlights: Spotlight[];
}

/**
 * CardContent handles the rendering of the spotlight card data.
 * Includes both Front and Back faces for the 'flip card' structure.
 */
function CardContent({ spotlight, isTop, index }: { spotlight: Spotlight; isTop: boolean; index: number }) {
  const imageUrl = spotlight.image?.asset 
    ? urlForImage(spotlight.image).url() 
    : spotlight.image?.url || spotlight.image?.externalUrl || '/images/placeholder-avatar.png';

  // Match original border colors: Card 1 is solid pink, 2 is 85%, 3 is 70%
  let borderColor = 'var(--pinkAccent)';
  if (index === 1) borderColor = 'rgba(255, 102, 196, 0.85)';
  if (index === 2) borderColor = 'rgba(255, 102, 196, 0.7)';

  return (
    <div className={styles.cardInner} style={{ borderColor }}>
      {/* Front Face */}
      <div className={styles.cardFront}>
        <div className={styles.cardHeader}>
          <div className={styles.imageWrapper}>
            <Image 
              src={imageUrl} 
              alt={spotlight.image?.alt || spotlight.name} 
              fill 
              style={{ objectFit: 'cover' }}
              sizes="80px"
              priority={isTop}
            />
          </div>
          <div className={styles.meta}>
            <h3 className={styles.cardName}>{spotlight.name},</h3>
            <h4 className={styles.cardJob}>{spotlight.jobTitle}, {spotlight.country}</h4>
          </div>
        </div>
        
        <div className={styles.cardBody}>
          <blockquote className={styles.quote}>“{spotlight.quote}”</blockquote>
          <p className={styles.cardDesc}>{spotlight.excerpt}</p>
        </div>

        <div className={styles.cardFooter}>
          <Link 
            href={`/member-spotlights/${spotlight.slug.current}`} 
            className={styles.cardLink}
            onClick={(e) => e.stopPropagation()}
          >
            <TrendingUp size={18} />
            Read Success Story
          </Link>
        </div>
      </div>

      {/* Back Face (Generic design for the flip effect) */}
      <div className={styles.cardBack}>
        <div className={styles.backContent}>
          <TrendingUp size={48} className={styles.backIcon} />
          <p>Member Success Story</p>
        </div>
      </div>
    </div>
  );
}

export function SpotlightCarousel({ spotlights: initialSpotlights }: SpotlightCarouselProps) {
  const [items, setItems] = useState<Spotlight[]>(initialSpotlights || []);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  // Synchronize items if the initial props change
  useEffect(() => {
    if (initialSpotlights && initialSpotlights.length > 0) {
      setItems(initialSpotlights);
    }
  }, [initialSpotlights]);

  const next = useCallback(() => {
    setDirection(1);
    setItems((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setItems((prev) => {
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, -1);
      return [last, ...rest];
    });
  }, []);

  if (!items || items.length === 0) return null;

  // Always show 3 cards in the fanned stack
  const visibleItems = items.slice(0, 3);

  // Animation Variants
  const cardVariants = {
    initial: (index: number) => ({
      opacity: index === 0 ? 0 : 1,
      scale: 0.9,
      x: -20,
      y: -10,
      rotate: -10,
    }),
    animate: (index: number) => {
      // Rotation and translation values from the original Elementor CSS
      const rotation = index === 0 ? 0 : (index === 1 ? -3 : -6);
      const x = index === 0 ? 0 : (index === 1 ? -4 : -8);
      const y = index === 0 ? 0 : (index === 1 ? -2 : -4);
      
      return {
        opacity: 1,
        scale: 1,
        rotate: rotation,
        x: x,
        y: y,
        zIndex: 10 - index,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }
      };
    },
    exit: {
      y: -800, // Move further up
      rotate: 20,
      rotateY: 180, // Full 180 flip to show the back face
      opacity: 0,
      scale: 0.8, // Scale down as it flies away
      zIndex: 50,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.cardStack}>
        <AnimatePresence mode="popLayout">
          {visibleItems.map((spotlight, index) => (
            <motion.div 
              key={spotlight._id}
              layout
              custom={index}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.card}
              onClick={(e) => {
                if (index === 0) {
                  // Prevent navigation if clicking the link
                  if ((e.target as HTMLElement).closest('a')) return;
                  next();
                }
              }}
              style={{ 
                pointerEvents: index === 0 ? 'auto' : 'none',
                cursor: index === 0 ? 'pointer' : 'default',
              }}
            >
              <CardContent 
                spotlight={spotlight} 
                isTop={index === 0} 
                index={index}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.navButtons}>
        <button 
          className={styles.navBtn} 
          onClick={(e) => { e.preventDefault(); prev(); }} 
          aria-label="Previous Spotlight"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          className={styles.navBtn} 
          onClick={(e) => { e.preventDefault(); next(); }} 
          aria-label="Next Spotlight"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}

