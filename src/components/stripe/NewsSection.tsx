"use client";

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './NewsSection.module.css'
import { TactileButton } from './TactileButton'

interface NewsItem {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  cta: string
  link: string
}

const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'pandemic-preparedness',
    title: "Strengthening Africa's Pandemic Preparedness",
    subtitle: 'Strategic Priority',
    description: "Betty Abera explains why pharmacy-based immunization is a strategic priority for resilient health systems across the continent.",
    image: '/images/marketing/pandemic-preparedness.webp',
    cta: 'Read Article',
    link: 'https://www.psi.org/2025/06/strengthening-africas-pandemic-preparedness-why-pharmacy-based-immunization-must-be-a-strategic-priority/'
  },
  {
    id: 'community-pharmacies',
    title: 'Community Pharmacies Powering Vaccine Access',
    subtitle: 'Network Expansion',
    description: 'Scaling the network to 5,000+ pharmacies to bridge the immunization gap and save lives at the community level.',
    image: '/images/marketing/vaccine_access_carousel.png',
    cta: 'View Impact',
    link: 'https://www.psi.org/2024/09/community-pharmacies-to-power-vaccine-access-in-africa/'
  },
  {
    id: 'digital-health',
    title: 'Reimagining Digital Health Delivery',
    subtitle: 'Consumer-Centered Care',
    description: 'PSI aims to place the consumer at the center, bringing quality care closer through mobile technology and increased connectivity.',
    image: '/images/marketing/digital-health.webp',
    cta: 'Explore Roadmap',
    link: 'http://psi-fi.net/index-15.html'
  },
  {
    id: 'leadership',
    title: 'Ethiopia Activates Pharmacy-Based Immunization',
    subtitle: 'Expanding Access in Oromia & Amhara',
    description: 'In a historic first, PSI/Ethiopia and the Ministry of Health launched PBID services, allowing community pharmacists to administer life-saving vaccines to underserved populations.',
    image: '/images/marketing/pharmalink-ethiopia-activates-pharmacy-based-immunization-delivery.webp',
    cta: 'Read the story',
    link: 'https://www.linkedin.com/posts/betty-abera-0b7b4b59_takedaglobalcsr-vaccines-pharmacy-ugcPost-7452112693395664896-fKnn/'
  }
]

export const NewsSection: React.FC = () => {
  const [items, setItems] = useState<NewsItem[]>(INITIAL_NEWS)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetId, setTargetId] = useState<string | null>(null)
  
  const handleCardClick = (clickedItem: NewsItem) => {
    const clickedIndex = items.findIndex(item => item.id === clickedItem.id)
    
    // If clicking the featured card, open its link
    if (clickedIndex === 0) {
      if (clickedItem.link && clickedItem.link !== '#') {
        window.open(clickedItem.link, '_blank', 'noopener,noreferrer');
      }
      return
    }

    if (isTransitioning) return
    setIsTransitioning(true)
    setTargetId(clickedItem.id)

    // PHASE 2: After animation, reorder the array
    setTimeout(() => {
      setItems(prev => {
        const idx = prev.findIndex(item => item.id === clickedItem.id)
        if (idx === -1) return prev
        const before = prev.slice(0, idx)
        const after = prev.slice(idx)
        return [...after, ...before]
      })
      setIsTransitioning(false)
      setTargetId(null)
    }, 600) 
  }

  const nextSlide = () => {
    if (isTransitioning) return
    const nextItem = items[1]
    if (nextItem) handleCardClick(nextItem)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    const lastItem = items[items.length - 1]
    setTargetId(lastItem.id)

    setTimeout(() => {
      setItems(prev => {
        const last = prev[prev.length - 1]
        const rest = prev.slice(0, prev.length - 1)
        return [last, ...rest]
      })
      setIsTransitioning(false)
      setTargetId(null)
    }, 600)
  }

  return (
    <section className={styles.newsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>Network Insights</h2>
            <p className={styles.subtitle}>See the latest from PharmaLink.</p>
          </div>
          <div className={styles.controls}>
            <button 
              className={styles.controlBtn} 
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
                <path d="M9.613 2.62 5.107 7.124h9.137v1.75H5.107l4.506 4.506-1.238 1.238-6-6L1.756 8l.619-.62 6-6 1.238 1.24Z"></path>
              </svg>
            </button>
            <button 
              className={styles.controlBtn} 
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
                <path d="m6.387 2.62 4.506 4.505H1.756v1.75h9.137l-4.506 4.506 1.238 1.238 6-6L14.245 8l-.618-.62-6-6-1.239 1.24Z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.carouselWrapper}>
          <div className={styles.cardsContainer}>
            {items.map((item, index) => {
              const isFeatured = index === 0
              
              const baseWeights = [10, 2, 1.2, 0.6]
              let flexWeight = baseWeights[index] || 0.6

              if (isTransitioning && targetId) {
                const targetIndex = items.findIndex(i => i.id === targetId)
                
                if (index < targetIndex) {
                  flexWeight = 0 // Diminish cards to the left
                } else if (index === targetIndex) {
                  flexWeight = 10 // Selected card grows to featured size
                } else {
                  // Other cards adjust their position
                  flexWeight = baseWeights[index - targetIndex] || 0.6
                }
              } else if (hoveredId) {
                // Normal hover logic
                if (isFeatured && hoveredId === items[0].id) {
                  flexWeight *= 1.1
                } else if (!isFeatured && hoveredId === item.id) {
                  flexWeight *= 1.2
                } else {
                  const shrinkFactor = isFeatured ? 0.95 : 0.98
                  flexWeight *= shrinkFactor
                }
              }

              return (
                <motion.div
                  key={item.id}
                  layout
                  className={`${styles.card} ${isFeatured ? styles.featuredCard : styles.sliverCard}`}
                  style={{ 
                    flex: flexWeight,
                    opacity: isTransitioning && flexWeight === 0 ? 0 : 1,
                    pointerEvents: isTransitioning ? 'none' : 'auto',
                    zIndex: isTransitioning && item.id === targetId ? 50 : (isFeatured ? 40 : 10 - index)
                  }}
                  onMouseEnter={() => !isTransitioning && setHoveredId(item.id)}
                  onMouseLeave={() => !isTransitioning && setHoveredId(null)}
                  onClick={() => handleCardClick(item)}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 30,
                    mass: 0.8
                  }}
                >
                  <motion.div className={styles.imageWrapper}>
                    <img src={item.image} alt={item.title} className={styles.image} />
                    <div className={styles.overlay} />
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {(isFeatured || (isTransitioning && flexWeight === 10)) && (
                      <motion.div 
                        key="content"
                        className={styles.cardContent}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                      >
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <p className={styles.cardSubtitle}>{item.subtitle}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className={styles.footer}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={items[0].id}
              className={styles.infoArea}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            >
              <p className={styles.description}>
                {items[0].description}
              </p>
              <TactileButton 
                href={items[0].link} 
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {items[0].cta}
              </TactileButton>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
