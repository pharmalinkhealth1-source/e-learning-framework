import React from 'react';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import { client } from '@/sanity/lib/client';
import styles from './Blog.module.css';
import BlogClient from './BlogClient';

export const revalidate = 60; // Revalidate every minute

export default async function BlogPage() {
  let articles = [];
  try {
    articles = await client.fetch(`*[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      tag,
      title,
      summary,
      "slug": slug.current,
      "date": publishedAt,
      "image": mainImage.asset->url,
      "externalImage": mainImage.externalUrl,
      author->{
        name,
        "image": image.asset->url,
        "externalImage": image.externalUrl
      }
    }`);
  } catch (error) {
    console.error("Error fetching blog articles:", error);
  }

  return (
    <main className={styles.main}>
      <Navbar />

      <div className={styles.heroBackground}></div>
      <div className={styles.gridLinesContainer}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.line}></div>
        ))}
      </div>
      
      <BlogClient initialArticles={articles} />

      {/* Subscribe Footer */}
      <section className={styles.BlogFooterCta}>
        <div className={styles.container}>
          <div className={styles.BlogFooterCta__layout}>
            <div>
              <h3 className={styles.BlogFooterCta__title}>Subscribe to News</h3>
              <p className={styles.BlogFooterCta__summary}>Get the latest updates on healthcare innovation in Africa.</p>
              
              <div className={styles['Form--inlineForm']}>
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className={styles.TextInput__input} 
                />
                <button className={styles.FormSubmitButton}>
                  Subscribe
                </button>
              </div>
              <p className={styles.PrivacyNotice}>
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
