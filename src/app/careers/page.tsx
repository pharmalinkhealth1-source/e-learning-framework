import { Metadata } from 'next';
import React from 'react';
import Navbar from "@/components/stripe/Navbar";
import Footer from "@/components/stripe/Footer";
import FooterCTA from "@/components/stripe/FooterCTA";
import MeshGradient from "@/components/stripe/MeshGradient";
import { client } from '@/sanity/lib/client';
import CareersClient from './CareersClient';
import styles from './Careers.module.css';
import { JobOpening } from '@/components/careers/JobCard';
import PageTransition from '@/components/animations/PageTransition';

export const metadata: Metadata = {
  title: 'Careers | PharmaLink',
  description: 'Join PharmaLink and help us build the future of African healthcare. Explore clinical, technical, and operational roles.',
};

async function getJobOpenings() {
  return await client.fetch<JobOpening[]>(`
    *[_type == "jobOpening"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      category,
      company,
      location,
      type,
      excerpt,
      publishedAt
    }
  `, {}, { next: { revalidate: 60 } });
}

export default async function CareersPage() {
  const jobOpenings = await getJobOpenings();

  return (
    <main className={styles.main}>
      <Navbar />

      <PageTransition>
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.gradientOverlay} />
            <MeshGradient 
              colors={['#f6f9fc', '#eef2f7', '#e5edf5', '#f0f4f8']} 
              speed={0.002} 
            />
          </div>
          
          <div className={styles.gridLinesContainer}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.line}></div>
            ))}
          </div>

          <div className={styles.container}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Build the future of <br />
                <span style={{ color: '#635bff' }}>African Healthcare</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Join a world-class team of pharmacists, engineers, and researchers dedicated to making life-saving medications accessible across the continent.
              </p>
            </div>
          </div>
        </section>

        <CareersClient initialJobs={jobOpenings} />
      </PageTransition>

      <FooterCTA 
        title="Don't see a perfect fit?"
        subtitle="We're always looking for talented individuals who share our mission. Send us an open application."
        buttonText="Get in Touch"
        buttonHref="/contact"
      />
      <Footer />
    </main>
  );
}
