import * as React from 'react';
import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import CommentForm from '@/components/forum/CommentForm';
import CommentThread from '@/components/forum/CommentThread';
import ForumSync from '@/components/forum/ForumSync';
import styles from './ForumDetail.module.css';
import { PortableText } from '@portabletext/react';

interface Comment {
  _id: string;
  content: string;
  publishedAt: string;
  authorName: string;
  authorInitials: string;
  parentId: string | null;
  children?: Comment[];
}

export default async function ForumPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(`*[_type == "forumPost" && slug.current == $slug][0] {
    _id,
    title,
    content,
    publishedAt,
    "authorName": author->name,
    "comments": *[_type == "comment" && parentPost._ref == ^._id] | order(publishedAt asc) {
      _id,
      content,
      publishedAt,
      "authorName": author->name,
      "authorInitials": author->initials,
      "parentId": parentComment._ref
    }
  }`, { slug });

  if (!post) {
    notFound();
  }

  // Organize comments into a tree
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  post.comments.forEach((comment: any) => {
    const c = { ...comment, children: [] };
    commentMap.set(c._id, c);
  });

  post.comments.forEach((comment: any) => {
    const c = commentMap.get(comment._id)!;
    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId)!;
      parent.children = parent.children || [];
      parent.children.push(c);
    } else {
      rootComments.push(c);
    }
  });

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

        <section className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Discussion ({post.comments.length})</h2>
          
          <CommentThread comments={rootComments} postId={post._id} />
          
          <div style={{ marginTop: '64px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', color: '#0a2540' }}>
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
