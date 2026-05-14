import * as React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import PostCard from '@/components/forum/PostCard';
import ForumSync from '@/components/forum/ForumSync';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import FooterCTA from '@/components/stripe/FooterCTA';
import styles from './ForumListing.module.css';

export default async function ForumListingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const posts = await client.fetch(`*[_type == "forumPost"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    "excerpt": array::join(string::split(content[0].children[0].text, "")[0..150], "") + "...",
    "authorName": author->name,
    publishedAt
  }`);

  return (
    <main className={styles.main}>
      <ForumSync />
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.gridLinesContainer}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.line}></div>
          ))}
        </div>
        
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Forum</span>
          <h1 className={styles.title}>Community Discussions</h1>
          <p className={styles.subtitle}>
            Technical discussions, ecosystem updates, and developer insights from pharmaceutical professionals.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.listingHeader}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>All Conversations</h2>
            <Link href="/forum/new" className={styles.primaryBtn}>
              Create a Post
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className={styles.postGrid}>
            {posts.length > 0 ? (
              posts.map((post: any, index: number) => (
                <PostCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  author={post.authorName || 'System'}
                  date={new Date(post.publishedAt).toLocaleDateString()}
                  slug={post.slug}
                  index={index}
                />
              ))
            ) : (
              <div style={{ 
                padding: '80px', 
                textAlign: 'center', 
                background: '#F6F9FC', 
                borderRadius: '24px',
                border: '1px dashed #E6EBF1'
              }}>
                <p style={{ color: 'var(--hds-color-text-secondary)', fontSize: '1.125rem' }}>No discussions found. Be the first to start a conversation!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <FooterCTA />
      <Footer />
    </main>
  );
}
