import * as React from 'react';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import PostCard from '@/components/forum/PostCard';
import ForumSync from '@/components/forum/ForumSync';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import FooterCTA from '@/components/stripe/FooterCTA';
import styles from './ForumListing.module.css';
import ForumRulesModal from '@/components/forum/ForumRulesModal';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'general', label: 'General' },
  { value: 'clinical', label: 'Clinical' },
  { value: 'regulatory', label: 'Regulatory' },
  { value: 'supply_chain', label: 'Supply Chain' },
  { value: 'technology', label: 'Technology' },
  { value: 'careers', label: 'Careers' },
]

export default async function ForumListingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // --- Forum Rules Gate ---
  const rulesDoc = await client.fetch<{
    version: string;
    rules: { title: string; body: string }[];
  } | null>(
    `*[_id == "forumRules"][0]{ version, rules[]{ title, body } }`
  );

  if (rulesDoc) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const meta = user.publicMetadata as {
      forumRulesAcceptedAt?: string;
      forumRulesAcceptedVersion?: string;
    };

    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const needsRules =
      !meta.forumRulesAcceptedAt ||
      new Date(meta.forumRulesAcceptedAt).getTime() < Date.now() - THIRTY_DAYS ||
      meta.forumRulesAcceptedVersion !== rulesDoc.version;

    if (needsRules) {
      return (
        <main>
          {/* ForumSync intentionally omitted — real-time listener irrelevant before rules acceptance */}
          <ForumRulesModal rulesDoc={rulesDoc} />
        </main>
      );
    }
  } else {
    console.warn('[ForumGate] forumRules Sanity document not found — allowing access');
  }
  // --- End Forum Rules Gate ---

  const { category, page } = await searchParams
  const offset = Math.max(0, (parseInt(page ?? '1', 10) - 1)) * 20

  const posts = category
    ? await client.fetch(
        `*[_type == "forumPost" && category == $category] | order(publishedAt desc) [${offset}...${offset + 20}] {
          _id, title, "slug": slug.current, category, publishedAt,
          "excerpt": coalesce(
            array::join(string::split(coalesce(content[0].children[0].text, ""), "")[0..150], ""),
            ""
          ),
          "authorName": author->name,
          "likeCount": count(likedBy),
          "commentCount": count(*[_type == "comment" && parentPost._ref == ^._id])
        }`,
        { category }
      )
    : await client.fetch(
        `*[_type == "forumPost"] | order(publishedAt desc) [${offset}...${offset + 20}] {
          _id, title, "slug": slug.current, category, publishedAt,
          "excerpt": coalesce(
            array::join(string::split(coalesce(content[0].children[0].text, ""), "")[0..150], ""),
            ""
          ),
          "authorName": author->name,
          "likeCount": count(likedBy),
          "commentCount": count(*[_type == "comment" && parentPost._ref == ^._id])
        }`
      )

  const currentPage = parseInt(page ?? '1', 10)
  const hasMore = posts.length === 20

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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {CATEGORIES.map((cat) => {
              const isActive = (category ?? '') === cat.value
              const href = cat.value ? `/forum?category=${cat.value}` : '/forum'
              return (
                <Link
                  key={cat.value}
                  href={href}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '100px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid',
                    borderColor: isActive ? '#6c30c0' : '#e5edf5',
                    background: isActive ? '#6c30c0' : 'white',
                    color: isActive ? 'white' : '#425466',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat.label}
                </Link>
              )
            })}
          </div>

          <div className={styles.postGrid}>
            {posts.length > 0 ? (
              posts.map((post: any, index: number) => (
                <PostCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt ? post.excerpt + '…' : ''}
                  author={post.authorName || 'System'}
                  date={new Date(post.publishedAt).toLocaleDateString()}
                  slug={post.slug}
                  index={index}
                  category={post.category}
                  commentCount={post.commentCount}
                  likeCount={post.likeCount}
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
                <p style={{ color: 'var(--hds-color-text-secondary)', fontSize: '1.125rem' }}>
                  No discussions yet. Be the first to start a conversation!
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {(currentPage > 1 || hasMore) && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '48px' }}>
              {currentPage > 1 && (
                <Link
                  href={`/forum?${category ? `category=${category}&` : ''}page=${currentPage - 1}`}
                  style={{
                    padding: '10px 24px', borderRadius: '100px', border: '1px solid #e5edf5',
                    color: '#425466', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
                  }}
                >
                  ← Previous
                </Link>
              )}
              {hasMore && (
                <Link
                  href={`/forum?${category ? `category=${category}&` : ''}page=${currentPage + 1}`}
                  style={{
                    padding: '10px 24px', borderRadius: '100px', background: '#6c30c0',
                    color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
                  }}
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <FooterCTA />
      <Footer />
    </main>
  );
}
