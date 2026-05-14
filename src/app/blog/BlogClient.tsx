'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Blog.module.css';

const CATEGORIES = [
  "All Posts",
  "Product Updates",
  "Clinical Research",
  "Policy & Advocacy",
  "Engineering",
  "Global Health",
  "Company News"
];

const HoverArrow = () => (
  <svg className={styles.HoverArrow} viewBox="0 0 10 10" aria-hidden="true">
    <g fillRule="evenodd">
      <path className={styles.HoverArrow__linePath} d="M0 5h7" />
      <path className={styles.HoverArrow__tipPath} d="M1 1l4 4-4 4" />
    </g>
  </svg>
);

export default function BlogClient({ initialArticles }: { initialArticles: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All Posts");
  
  const featuredPost = initialArticles[0];
  const feedPosts = initialArticles.slice(1);

  return (
    <div className={styles.container}>
      {/* Segmented Control */}
      <div className={styles.SegmentedControl}>
        <div className={styles.SegmentedControl__buttons}>
          {CATEGORIES.map((cat, i) => (
            <button 
              key={i} 
              className={`${styles.SegmentedControlButton} ${activeCategory === cat ? styles['SegmentedControlButton--active'] : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Row Layout for Posts */}
      <div className={styles.RowLayout}>
        
        {/* Featured Post */}
        {featuredPost && (
          <motion.div 
            className={`${styles.BlogIndexPost} ${styles['BlogIndexPost--variantFeatured']} ${styles['BlogIndexPost--hasFigure']}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.BlogIndexPost__category}>
              <span className={styles['CopyTitle--variantDetail']}>{featuredPost.tag}</span>
            </div>
            <h2 className={styles.BlogIndexPost__title}>{featuredPost.title}</h2>
            
            <div className={styles.BlogIndexPost__authorList}>
              <div className={styles.BlogAuthor}>
                <div className={styles.BlogAuthor__avatar}>
                  {featuredPost.author?.externalImage || featuredPost.author?.image ? (
                    <Image 
                      src={featuredPost.author.externalImage || featuredPost.author.image} 
                      alt={featuredPost.author.name} 
                      fill 
                      className={styles.BlogAuthor__avatarImage}
                    />
                  ) : (
                    <div className={styles.BlogAuthor__avatarPlaceholder}></div>
                  )}
                </div>
                <div className={styles.BlogAuthor__caption}>
                  <div className={styles.BlogAuthor__link}>{featuredPost.author?.name || 'Anonymous'}</div>
                  <div className={styles.BlogAuthor__role}>Contributor</div>
                </div>
              </div>
            </div>
            
            <p className={styles.BlogIndexPost__body}>{featuredPost.summary}</p>
            
            <Link href={`/blog/${featuredPost.slug}`} className={styles.BlogIndexPost__readMoreLink}>
              Read more <HoverArrow />
            </Link>
            
            <div className={styles.BlogIndexPost__figure}>
              {(featuredPost.externalImage || featuredPost.image) && (
                <Image 
                  src={featuredPost.externalImage || featuredPost.image} 
                  alt={featuredPost.title}
                  fill
                  className={styles.BlogImageCard__image}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Normal Posts */}
        {feedPosts.map((post, i) => (
          <motion.div 
            key={post._id || i} 
            className={`${styles.BlogIndexPost} ${styles['BlogIndexPost--variantNormal']} ${styles['BlogIndexPost--hasFigure']}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className={styles.BlogIndexPost__category}>
              <span className={styles['CopyTitle--variantDetail']}>{post.tag}</span>
            </div>
            
            <div className={styles.BlogIndexPost__date}>
              <span className={styles.BlogPostDate}>{post.date ? new Date(post.date).toLocaleDateString() : ''}</span>
            </div>

            <h2 className={styles.BlogIndexPost__title}>{post.title}</h2>
            
            <div className={styles.BlogIndexPost__authorList}>
              <div className={styles.BlogAuthor}>
                <div className={styles.BlogAuthor__avatar}>
                  {post.author?.externalImage || post.author?.image ? (
                    <Image 
                      src={post.author.externalImage || post.author.image} 
                      alt={post.author.name} 
                      fill 
                      className={styles.BlogAuthor__avatarImage}
                    />
                  ) : (
                    <div className={styles.BlogAuthor__avatarPlaceholder}></div>
                  )}
                </div>
                <div className={styles.BlogAuthor__caption}>
                  <div className={styles.BlogAuthor__link}>{post.author?.name || 'Anonymous'}</div>
                  <div className={styles.BlogAuthor__role}>Contributor</div>
                </div>
              </div>
            </div>
            
            <p className={styles.BlogIndexPost__body}>{post.summary}</p>
            
            <Link href={`/blog/${post.slug}`} className={styles.BlogIndexPost__readMoreLink}>
              Read more <HoverArrow />
            </Link>
            
            <div className={styles.BlogIndexPost__figure}>
              {(post.externalImage || post.image) && (
                <Image 
                  src={post.externalImage || post.image}
                  alt={post.title}
                  fill
                  className={styles.BlogImageCard__image}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
