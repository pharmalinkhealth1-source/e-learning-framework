'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobCard, JobOpening } from '@/components/careers/JobCard';
import styles from './Careers.module.css';

interface CareersClientProps {
  initialJobs: JobOpening[];
}

const CATEGORIES = ['All', 'Clinical', 'Technical', 'Operations', 'Research'];

const CareersClient: React.FC<CareersClientProps> = ({ initialJobs }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredJobs = useMemo(() => {
    if (activeCategory === 'All') return initialJobs;
    return initialJobs.filter((job) => job.category === activeCategory);
  }, [activeCategory, initialJobs]);

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <div className={styles.segmentedControl}>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`${styles.filterButton} ${
                activeCategory === category ? styles.filterButtonActive : ''
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        className={styles.jobGrid}
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div
                key={job._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              key="empty"
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3>No positions found</h3>
              <p>Try selecting a different category or check back later.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CareersClient;
