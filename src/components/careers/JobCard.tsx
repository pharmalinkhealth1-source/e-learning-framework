import React from 'react';
import { TactileButton } from '@/components/stripe/TactileButton';
import styles from './JobCard.module.css';

export interface JobOpening {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  company: string;
  location: string;
  type: string;
  excerpt: string;
  publishedAt: string;
}

interface JobCardProps {
  job: JobOpening;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className={styles.card} data-category={job.category}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{job.title}</h3>
        <span className={styles.categoryBadge}>{job.category}</span>
      </div>
      
      <div className={styles.metadata}>
        <div className={styles.metaItem}>
          <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {job.location}
        </div>
        <div className={styles.metaItem}>
          <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          {job.type === 'full-time' ? 'Full-time' : job.type === 'contract' ? 'Contract' : 'Remote'}
        </div>
      </div>

      <p className={styles.excerpt}>{job.excerpt}</p>
      
      <div className={styles.cardActions}>
        <TactileButton 
          href={`/careers/${job.slug.current}`}
          variant="secondary"
          className={styles.applyButton}
        >
          View Position
          <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </TactileButton>
      </div>
    </div>
  );
};
