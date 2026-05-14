import { Metadata } from 'next';
import React from 'react';
import Navbar from "@/components/stripe/Navbar";
import Footer from "@/components/stripe/Footer";
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './JobDetail.module.css';
import { TactileButton } from '@/components/stripe/TactileButton';
import JobDetailClient from './JobDetailClient';
import PageTransition from '@/components/animations/PageTransition';

interface JobDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JobDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: 'Job Not Found | PharmaLink',
    };
  }

  return {
    title: `${job.title} | Careers at PharmaLink`,
    description: job.excerpt || `Join our team as a ${job.title}. Apply now for this ${job.category} position in ${job.location}.`,
  };
}

async function getJobBySlug(slug: string) {
  return await client.fetch(`
    *[_type == "jobOpening" && slug.current == $slug][0] {
      title,
      category,
      company,
      location,
      type,
      description,
      responsibilities,
      requirements,
      publishedAt,
      applyUrl
    }
  `, { slug });
}

export default async function JobPage({ params }: JobDetailProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <Navbar />

      <div className={styles.navSection}>
        <div className={styles.container}>
          <Link href="/careers" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to all positions
          </Link>
        </div>
      </div>

      <PageTransition>
        <article className={styles.container}>
          <header className={styles.header}>
            <span className={styles.categoryBadge}>{job.category}</span>
            <h1 className={styles.title}>{job.title}</h1>
            
            <div className={styles.metaGrid}>
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
              <div className={styles.metaItem}>
                <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Posted {new Date(job.publishedAt).toLocaleDateString()}
              </div>
            </div>
          </header>

          <div className={styles.contentSection}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About the Role</h2>
              <div className={styles.description}>{job.description}</div>
            </section>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Responsibilities</h2>
                <ul className={styles.list}>
                  {job.responsibilities.map((item: string, i: number) => (
                    <li key={i} className={styles.listItem}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Requirements</h2>
                <ul className={styles.list}>
                  {job.requirements.map((item: string, i: number) => (
                    <li key={i} className={styles.listItem}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </article>

        <JobDetailClient job={job} />
      </PageTransition>

      <Footer />
    </main>
  );
}
