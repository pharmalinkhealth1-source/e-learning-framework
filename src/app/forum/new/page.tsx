import * as React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import styles from '../ForumListing.module.css';
import CreatePostForm from '@/components/forum/CreatePostForm';

export default async function NewPostPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <main className={styles.main}>
      <Navbar />

      <section className={styles.hero} style={{ minHeight: '30vh' }}>
        <div className={styles.heroBackground}></div>
        <div className={styles.gridLinesContainer}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.line}></div>
          ))}
        </div>
        
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Forum</span>
          <h1 className={styles.title}>Start a Conversation</h1>
          <p className={styles.subtitle}>
            Share your expertise or ask a question to the community.
          </p>
        </div>
      </section>

      <section className={styles.section} style={{ background: '#fcfaff' }}>
        <div className={styles.container} style={{ display: 'flex', justifyContent: 'center' }}>
          <CreatePostForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
