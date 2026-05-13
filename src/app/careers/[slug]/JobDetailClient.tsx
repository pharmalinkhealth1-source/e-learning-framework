'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { TactileButton } from '@/components/stripe/TactileButton';
import { ApplyModal } from '@/components/careers/ApplyModal';
import styles from './JobDetail.module.css';

interface JobDetailClientProps {
  job: {
    title: string;
    location: string;
    type: string;
    applyUrl?: string;
  };
}

const JobDetailClient: React.FC<JobDetailClientProps> = ({ job }) => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = () => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank');
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className={styles.stickyCta}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaInfo}>
            <h4>{job.title}</h4>
            <p>{job.location} &bull; {job.type}</p>
          </div>
          <TactileButton 
            onClick={handleApply}
            variant="primary"
            style={{ width: '180px' }}
          >
            Apply for this role
          </TactileButton>
        </div>
      </div>

      <ApplyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        jobTitle={job.title} 
      />
    </>
  );
};

export default JobDetailClient;
