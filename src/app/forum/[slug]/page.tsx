import * as React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import styled from 'styled-components';
import CommentForm from '@/components/forum/CommentForm';

export default async function ForumPostDetailPage({ params }: { params: { slug: string } }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const post = await client.fetch(`*[_type == "forumPost" && slug.current == $slug][0] {
    _id,
    title,
    content,
    "authorName": author->name,
    publishedAt,
    "comments": *[_type == "comment" && parentPost._ref == ^._id] | order(publishedAt asc) {
      content,
      "authorName": author->name,
      publishedAt,
      _id
    }
  }`, { slug: params.slug });

  if (!post) {
    notFound();
  }

  return (
    <div style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: 'var(--hds-color-fg)', marginBottom: '12px' }}>
          {post.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#707070', fontSize: '14px' }}>
          <span style={{ fontWeight: 600, color: 'var(--hds-color-primary)' }}>{post.authorName}</span>
          <span>•</span>
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        </div>
      </header>

      <article style={{ 
        fontSize: '18px', 
        lineHeight: '1.8', 
        color: 'var(--hds-color-fg)',
        marginBottom: '80px',
        borderBottom: '1px solid #E6EBF1',
        paddingBottom: '40px'
      }}>
        <PortableText value={post.content} />
      </article>

      <section>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
          Comments ({post.comments?.length || 0})
        </h2>

        <div style={{ display: 'grid', gap: '24px' }}>
          {post.comments?.map((comment: any) => (
            <div key={comment._id} style={{ 
              padding: '20px', 
              background: '#F6F9FC', 
              borderRadius: '8px',
              borderLeft: '4px solid var(--hds-color-primary)'
            }}>
              <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
                {comment.authorName} <span style={{ fontWeight: 400, color: '#707070', marginLeft: '8px' }}>
                  {new Date(comment.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ fontSize: '15px', color: '#425466', lineHeight: '1.5' }}>{comment.content}</p>
            </div>
          ))}

          {post.comments?.length === 0 && (
            <p style={{ color: '#707070', textAlign: 'center', padding: '40px' }}>
              No comments yet. Start the discussion!
            </p>
          )}
        </div>

        <CommentForm postId={post._id} />
      </section>
    </div>
  );
}
