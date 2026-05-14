"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react';
import styles from './SuccessStories.module.css';

const STORIES = [
  {
    id: 1,
    name: "Dr. Amina Yusuf",
    role: "Community Pharmacist, Nigeria",
    quote: "“Launching telepharmacy during the pandemic meant rural patients didn’t miss a single dose.”",
    description: "After witnessing the struggles of remote communities, Dr. Yusuf led her team to launch a telepharmacy service that bridge the gap for thousands.",
    image: "https://pharmalinkhealth.com/wp-content/uploads/2025/12/dummy-testimonial-image-001.webp"
  },
  {
    id: 2,
    name: "Dr. Tesfaye Mekonnen",
    role: "Community Pharmacist, Ethiopia",
    quote: "“During the pandemic, telepharmacy helped us reach patients in rural kebeles and ensure they never missed essential medicines.”",
    description: "After seeing how distance and limited transport affected patients in remote woredas, Dr. Mekonnen led his team to launch a telepharmacy service.",
    image: "https://pharmalinkhealth.com/wp-content/uploads/2025/12/dummy-testimonial-image-002.webp"
  },
  {
    id: 3,
    name: "Dr. Wanjiku Njeri",
    role: "Community Pharmacist, Kenya",
    quote: "“Telepharmacy allowed us to reach patients in counties like Turkana and Kilifi, ensuring continuity of care.”",
    description: "Dr. Njeri saw how long distances and stock-outs pushed rural patients out of care. She led a telepharmacy rollout across multiple counties.",
    image: "https://pharmalinkhealth.com/wp-content/uploads/2025/12/dummy-testimonial-image-003.webp"
  }
];

export default function SuccessStories() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % STORIES.length);
  const prev = () => setIndex((prev) => (prev - 1 + STORIES.length) % STORIES.length);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <motion.span 
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Member Spotlights & Success Stories
          </motion.span>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Discover Real Journeys and Achievements from Pharmacists Across Africa
          </motion.h2>
          <motion.p 
            className={styles.description}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Celebrate the journeys, achievements, and lasting impact of pharmacists throughout our community. We shine a spotlight on inspiring member stories and showcase real-world successes.
          </motion.p>
          
          <motion.div 
            className={styles.buttonGroup}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/member-spotlights" className={styles.primaryBtn}>
              View All Stories
            </Link>
          </motion.div>
        </div>

        <div className={styles.carouselWrapper}>
          <div className={styles.cardStack}>
            <AnimatePresence mode="popLayout">
              {[0, 1, 2].map((offset) => {
                const storyIndex = (index + offset) % STORIES.length;
                const story = STORIES[storyIndex];
                const isTop = offset === 0;

                return (
                  <motion.div 
                    key={story.id}
                    className={styles.card}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1 - offset * 0.02, 
                      y: offset * 12,
                      x: offset * 4,
                      rotate: offset * 1.5,
                      zIndex: STORIES.length - offset,
                    }}
                    exit={{ opacity: 0, x: -200, rotate: -15, transition: { duration: 0.3 } }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    style={{ pointerEvents: isTop ? 'auto' : 'none' }}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.imageWrapper}>
                        <Image 
                          src={story.image} 
                          alt={story.name} 
                          fill 
                          style={{ objectFit: 'cover' }}
                          sizes="80px"
                        />
                      </div>
                      <div className={styles.meta}>
                        <h3 className={styles.cardName}>{story.name},</h3>
                        <h4 className={styles.cardJob}>{story.role}</h4>
                      </div>
                    </div>
                    
                    <div className={styles.cardBody}>
                      <p className={styles.quote}>{story.quote}</p>
                      <p className={styles.cardDesc}>{story.description}</p>
                    </div>

                    <div className={styles.cardFooter}>
                      <Link href={`/member-spotlights`} className={styles.cardLink}>
                        <TrendingUp size={18} />
                        Read Success Story
                      </Link>

                      {isTop && (
                        <div className={styles.navButtons}>
                          <button className={styles.navBtn} onClick={(e) => { e.preventDefault(); prev(); }} aria-label="Previous">
                            <ArrowLeft size={18} />
                          </button>
                          <button className={styles.navBtn} onClick={(e) => { e.preventDefault(); next(); }} aria-label="Next">
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              }).reverse()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
