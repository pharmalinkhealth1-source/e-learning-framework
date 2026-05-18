import React from 'react';
import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import { PortableText } from '@portabletext/react';
import styles from '../BlogPostDetail.module.css';

function resolveUrl(external?: unknown, sanity?: unknown): string | null {
  const a = typeof external === 'string' ? external.trim() : null;
  const b = typeof sanity === 'string' ? sanity.trim() : null;
  return a || b || null;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const raw = await client.fetch(`*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    tag,
    summary,
    content,
    publishedAt,
    "slug": slug.current,
    "sanityImage": mainImage.asset->url,
    "externalImage": mainImage.externalUrl,
    author->{
      name,
      "sanityImage": image.asset->url,
      "externalImage": image.externalUrl
    }
  }`, { slug });
  const post = raw ? {
    ...raw,
    imageUrl: resolveUrl(raw.externalImage, raw.sanityImage),
    author: raw.author ? {
      name: raw.author.name,
      imageUrl: resolveUrl(raw.author.externalImage, raw.author.sanityImage),
    } : null,
  } : null;

  if (!post) {
    notFound();
  }

  const relatedRaw = await client.fetch(`*[_type == "blogPost" && tag == $tag && slug.current != $slug][0...3] {
    _id,
    title,
    tag,
    "slug": slug.current,
    "sanityImage": mainImage.asset->url,
    "externalImage": mainImage.externalUrl
  }`, { tag: post.tag, slug });
  const relatedPosts = relatedRaw.map((r: any) => ({
    ...r,
    imageUrl: resolveUrl(r.externalImage, r.sanityImage),
  }));

  return (
    <main className={styles.main}>
      <Navbar />
      
      <article className={styles.article}>
        <div className={styles.container}>
          <Link href="/blog" className={styles.backLink}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Insights
          </Link>

          <header className={styles.header}>
            <span className={styles.categoryBadge}>{post.tag}</span>
            <h1 className={styles.title}>{post.title}</h1>
            
            <div className={styles.meta}>
              <div className={styles.authorSection}>
                <div className={styles.authorAvatar}>
                  {post.author?.imageUrl ? (
                    <Image src={post.author.imageUrl} alt={post.author.name ?? ''} fill className={styles.authorImage} />
                  ) : (
                    <div className={styles.avatarPlaceholder} />
                  )}
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{post.author?.name || 'PharmaLink Team'}</span>
                  <span className={styles.authorRole}>Medical Contributor</span>
                </div>
              </div>
              <div className={styles.publishInfo}>
                <span className={styles.publishLabel}>Published</span>
                <span className={styles.publishDate}>
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Recently'}
                </span>
              </div>
            </div>
          </header>

          {post.imageUrl && (
            <div className={styles.heroImageContainer}>
              <Image src={post.imageUrl} alt={post.title} fill className={styles.heroImage} priority />
              <div className={styles.imageOverlay} />
            </div>
          )}

          <div className={styles.contentWrapper}>
            <div className={styles.sidebar}>
              <div className={styles.shareTitle}>Share</div>
              <div className={styles.shareButtons}>
                <button className={styles.shareButton}>𝕏</button>
                <button className={styles.shareButton}>in</button>
                <button className={styles.shareButton}>🔗</button>
              </div>
            </div>
            
            <div className={styles.content}>
              {post.content ? (
                <PortableText value={post.content} />
              ) : (
                <>
                  <p className={styles.lead}>{post.summary}</p>
                  <p>This article explores the critical intersections of pharmaceutical distribution and digital health infrastructure across the African continent. As we continue to expand our verified directory, the need for real-time inventory visibility becomes increasingly paramount.</p>
                  <p>The challenges of last-mile delivery in complex terrains require not just logistical expertise, but a robust data-driven approach that PharmaLink is uniquely positioned to provide.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.container}>
            <h2 className={styles.relatedTitle}>Related Insights</h2>
            <div className={styles.relatedGrid}>
              {relatedPosts.map((related: any) => (
                <Link key={related._id} href={`/blog/${related.slug}`} className={styles.relatedCard}>
                  <div className={styles.relatedImageContainer}>
                    {related.imageUrl && (
                      <Image src={related.imageUrl} alt={related.title} fill className={styles.relatedImage} />
                    )}
                  </div>
                  <div className={styles.relatedContent}>
                    <span className={styles.relatedTag}>{related.tag}</span>
                    <h3 className={styles.relatedPostTitle}>{related.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
