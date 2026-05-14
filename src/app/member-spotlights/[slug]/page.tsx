import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SpotlightCard } from '@/components/community/SpotlightCard';
import { TactileButton } from '@/components/stripe/TactileButton';
import styles from './SpotlightDetail.module.css';

export const dynamic = 'force-dynamic';

async function getSpotlight(slug: string) {
  const query = `*[_type == "memberSpotlight" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    jobTitle,
    organization,
    country,
    quote,
    body,
    image {
      alt,
      externalUrl,
      asset->{ url }
    },
    memberOfTheMonth,
    publishedAt
  }`;
  
  return await client.fetch(query, { slug });
}

async function getRelatedSpotlights(slug: string) {
  const query = `*[_type == "memberSpotlight" && slug.current != $slug] | order(publishedAt desc) [0..1] {
    _id,
    name,
    slug,
    jobTitle,
    organization,
    country,
    quote,
    excerpt,
    image {
      alt,
      externalUrl,
      asset->{ url }
    }
  }`;
  
  return await client.fetch(query, { slug });
}

export default async function SpotlightDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const spotlight = await getSpotlight(slug);
  
  if (!spotlight) {
    notFound();
  }

  const related = await getRelatedSpotlights(slug);
  const imageUrl = spotlight.image?.externalUrl || 
                   (spotlight.image?.asset ? urlForImage(spotlight.image).url() : '/dummy-testimonial-image-001.webp');

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.gridLinesContainer}>
          <div className={styles.line} />
          <div className={styles.line} />
          <div className={styles.line} />
          <div className={styles.line} />
        </div>

        <TactileButton href="/member-spotlights" variant="ghost" className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Member Spotlights
        </TactileButton>

        <section className={styles.header}>
          <div className={styles.imageWrapper}>
            <Image 
              src={imageUrl}
              alt={spotlight.image?.alt || spotlight.name}
              fill
              className={styles.image}
              priority
            />
          </div>
          <div className={styles.headerContent}>
            {spotlight.memberOfTheMonth && (
              <span className={styles.badge}>Spotlight Member of the Month</span>
            )}
            <h1 className={styles.title}>{spotlight.name}</h1>
            <p className={styles.meta}>
              {spotlight.jobTitle} at {spotlight.organization}<br />
              {spotlight.country}
            </p>
            <blockquote className={styles.quote}>
              "{spotlight.quote}"
            </blockquote>
          </div>
        </section>

        <div className={styles.contentArea}>
          <article className={styles.richText}>
            <PortableText value={spotlight.body} />
          </article>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarWidget}>
              <h3 className={styles.widgetTitle}>Member Profile</h3>
              <ul className={styles.profileList}>
                <li className={styles.profileItem}>
                  <span className={styles.profileLabel}>Full Name</span>
                  <span className={styles.profileValue}>{spotlight.name}</span>
                </li>
                <li className={styles.profileItem}>
                  <span className={styles.profileLabel}>Role</span>
                  <span className={styles.profileValue}>{spotlight.jobTitle}</span>
                </li>
                <li className={styles.profileItem}>
                  <span className={styles.profileLabel}>Organization</span>
                  <span className={styles.profileValue}>{spotlight.organization}</span>
                </li>
                <li className={styles.profileItem}>
                  <span className={styles.profileLabel}>Location</span>
                  <span className={styles.profileValue}>{spotlight.country}</span>
                </li>
              </ul>
            </div>

            <div className={styles.sidebarWidget}>
              <h3 className={styles.widgetTitle}>Connect</h3>
              <p>PharmaLink members can connect directly with {spotlight.name?.split(' ')[0] || 'this member'} in our forum.</p>
              <TactileButton href="/forum" className={styles.ctaButton} style={{ width: '100%', textAlign: 'center', marginTop: '16px' }}>

                Join Discussion
              </TactileButton>
            </div>
          </aside>
        </div>

        {related && related.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Recently Featured</h2>
            <div className={styles.relatedGrid}>
              {related.map((item: any) => (
                <SpotlightCard key={item._id} spotlight={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
