import * as React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import PostCard from '@/components/forum/PostCard';

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
    <div style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--hds-color-fg)', marginBottom: '12px' }}>
          Community Forum
        </h1>
        <p style={{ color: '#425466', fontSize: '18px' }}>
          Technical discussions, ecosystem updates, and developer insights.
        </p>
      </header>

      <div style={{ display: 'grid', gap: '16px' }}>
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <PostCard
              key={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              author={post.authorName || 'System'}
              date={new Date(post.publishedAt).toLocaleDateString()}
              slug={post.slug}
            />
          ))
        ) : (
          <div style={{ 
            padding: '48px', 
            textAlign: 'center', 
            background: '#F6F9FC', 
            borderRadius: '12px',
            border: '1px dashed #E6EBF1'
          }}>
            <p style={{ color: '#425466' }}>No posts found. Be the first to start a conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}
