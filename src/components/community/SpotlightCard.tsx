import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { TactileButton } from '@/components/stripe/TactileButton';
import styles from './SpotlightCard.module.css';

export interface SpotlightCardProps {
  spotlight: {
    name: string;
    slug: { current: string };
    jobTitle: string;
    organization?: string;
    country: string;
    quote: string;
    excerpt: string;
    image?: {
      asset?: any;
      externalUrl?: string;
      alt?: string;
    };
  };
}

export function SpotlightCard({ spotlight }: SpotlightCardProps) {
  // Resolve image URL from externalUrl or Sanity asset
  const imageUrl = spotlight.image?.externalUrl || 
                   (spotlight.image?.asset ? urlForImage(spotlight.image).url() : '/dummy-testimonial-image-001.webp');

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatarWrapper}>
          <Image
            src={imageUrl}
            alt={spotlight.image?.alt || spotlight.name}
            fill
            className={styles.avatar}
          />
        </div>
        <div>
          <h3 className={styles.memberName}>{spotlight.name}</h3>
          <p className={styles.memberRole}>
            {spotlight.jobTitle}{spotlight.organization ? `, ${spotlight.organization}` : ''} • {spotlight.country}
          </p>
        </div>
      </div>
      <blockquote className={styles.quote}>
        {spotlight.quote}
      </blockquote>
      <p className={styles.excerpt}>{spotlight.excerpt}</p>
      
      <div className={styles.cardActions}>
        <TactileButton 
          href={`/member-spotlights/${spotlight.slug.current}`}
          variant="secondary"
          className={styles.readMoreButton}
        >
          Read Success Story
          <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </TactileButton>
      </div>
    </div>
  );
}
