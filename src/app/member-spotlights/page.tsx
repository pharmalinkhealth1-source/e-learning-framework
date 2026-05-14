import { client } from '@/sanity/lib/client';
import MemberSpotlightsClient from './MemberSpotlightsClient';
import { TactileButton } from '@/components/stripe/TactileButton';
import styles from './MemberSpotlights.module.css';

export const dynamic = 'force-dynamic';

async function getSpotlights() {
  const query = `*[_type == "memberSpotlight"] | order(publishedAt desc) {
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
    },
    publishedAt
  }`;
  
  return await client.fetch(query);
}

export default async function MemberSpotlightsPage() {
  const spotlights = await getSpotlights();

  return (
    <main className={styles.main}>
      <div className={styles.heroBackground} />
      
      <div className={styles.container}>
        <div className={styles.gridLinesContainer}>
          <div className={styles.line} />
          <div className={styles.line} />
          <div className={styles.line} />
          <div className={styles.line} />
        </div>

        <section className={styles.hero}>
          <span className={styles.heroTag}>Community Stories</span>
          <h1 className={styles.title}>Member Spotlights &<br />Success Stories</h1>
          <p className={styles.subtitle}>
            Discover how healthcare professionals across Africa are leveraging PharmaLink 
            to transform their practice and improve patient outcomes.
          </p>
          <div className={styles.heroActions}>
            <TactileButton variant="primary" href="/community">
              Join the Community
            </TactileButton>
          </div>
        </section>

        <MemberSpotlightsClient initialSpotlights={spotlights} />

        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Have a story to share?</h2>
          <p className={styles.ctaText}>
            We're always looking to feature members who are making a difference. 
            Tell us about your journey with PharmaLink.
          </p>
          <TactileButton variant="primary" href="/community/share">
            Submit Your Story
          </TactileButton>
        </section>
      </div>
    </main>
  );
}
