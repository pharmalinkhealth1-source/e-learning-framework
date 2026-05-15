import * as React from 'react';
import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import CommentForm from '@/components/forum/CommentForm';
import CommentThread from '@/components/forum/CommentThread';
import PostLikeButton from '@/components/forum/PostLikeButton';
import ForumSync from '@/components/forum/ForumSync';
import styles from './ForumDetail.module.css';
import { PortableText } from '@portabletext/react';

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  clinical: 'Clinical',
  regulatory: 'Regulatory',
  supply_chain: 'Supply Chain',
  technology: 'Technology',
  careers: 'Careers',
}

interface Comment {
  _id: string;
  content: string;
  publishedAt: string;
  authorName: string;
  likedBy?: string[];
  parentId: string | null;
  children?: Comment[];
}

export default async function ForumPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, { userId }] = await Promise.all([params, auth()])

  const post = await client.fetch(`*[_type == "forumPost" && slug.current == $slug][0] {
    _id,
    title,
    content,
    publishedAt,
    category,
    likedBy,
    "authorName": author->name,
    "comments": *[_type == "comment" && parentPost._ref == ^._id] | order(publishedAt asc) {
      _id,
      content,
      publishedAt,
      "authorName": author->name,
      likedBy,
      "parentId": parentComment._ref
    }
  }`, { slug });

  if (!post) {
    notFound();
  }

  // Build comment tree
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  post.comments.forEach((comment: Comment) => {
    commentMap.set(comment._id, { ...comment, children: [] });
  });

  post.comments.forEach((comment: Comment) => {
    const c = commentMap.get(comment._id)!;
    if (comment.parentId && commentMap.has(comment.parentId)) {
      commentMap.get(comment.parentId)!.children!.push(c);
    } else {
      rootComments.push(c);
    }
  });

  const categoryLabel = post.category ? (CATEGORY_LABELS[post.category] ?? post.category) : null

  return (
    <main className={styles.main}>
      <ForumSync postId={post._id} />
      <Navbar />

      <header className={styles.header}>
        <div className={styles.headerBackground}></div>
        <div className={styles.gridLinesContainer}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.line}></div>
          ))}
        </div>

        <div className={styles.container}>
          {categoryLabel && (
            <span style={{
              display: 'inline-block',
              marginBottom: '16px',
              padding: '4px 14px',
              borderRadius: '100px',
              background: 'rgba(108,48,192,0.1)',
              color: '#6c30c0',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {categoryLabel}
            </span>
          )}
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span className={styles.authorBadge}>{post.authorName}</span>
            <span className={styles.date}>{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      <article className={styles.container}>
        <div className={styles.content}>
          <PortableText value={post.content} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '60px' }}>
          <PostLikeButton
            postId={post._id}
            initialLikedBy={post.likedBy ?? []}
            currentUserId={userId ?? undefined}
          />
          <span style={{ color: '#888', fontSize: '0.875rem' }}>
            {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </div>

        <section className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Discussion ({post.comments.length})</h2>

          <CommentThread
            comments={rootComments}
            postId={post._id}
            currentUserId={userId ?? undefined}
          />

          <div style={{ marginTop: '64px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', color: 'var(--hds-color-text-primary)' }}>
              Add to the conversation
            </h3>
            <CommentForm postId={post._id} />
          </div>
        </section>
      </article>

      <Footer />
    </main>
  );
}
