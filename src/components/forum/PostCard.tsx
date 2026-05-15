'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  clinical: 'Clinical',
  regulatory: 'Regulatory',
  supply_chain: 'Supply Chain',
  technology: 'Technology',
  careers: 'Careers',
}

interface PostCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  slug: string;
  index: number;
  category?: string;
  commentCount?: number;
  likeCount?: number;
}

const Card = styled(motion(Link))`
  display: block;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--hds-shadow-card);
  border: 1px solid #E6EBF1;
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--hds-color-primary);
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CategoryBadge = styled.span`
  background: rgba(108, 48, 192, 0.08);
  color: #6c30c0;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--hds-color-fg);
  margin-bottom: 8px;
`;

const Excerpt = styled.p`
  font-size: 14px;
  color: var(--hds-color-text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--hds-color-text-subdued);
`;

const AuthorBadge = styled.span`
  background: #F6F9FC;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  color: var(--hds-color-primary);
`;

const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #888;
`;

export default function PostCard({ title, excerpt, author, date, slug, index, category, commentCount, likeCount }: PostCardProps) {
  return (
    <Card
      href={`/forum/${slug}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
    >
      <TopRow>
        {category && <CategoryBadge>{CATEGORY_LABELS[category] ?? category}</CategoryBadge>}
      </TopRow>
      <Title>{title}</Title>
      <Excerpt>{excerpt}</Excerpt>
      <Meta>
        <AuthorBadge>{author}</AuthorBadge>
        <span>•</span>
        <span>{date}</span>
        {typeof commentCount === 'number' && (
          <>
            <span>•</span>
            <Stat>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {commentCount}
            </Stat>
          </>
        )}
        {typeof likeCount === 'number' && likeCount > 0 && (
          <>
            <span>•</span>
            <Stat>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likeCount}
            </Stat>
          </>
        )}
      </Meta>
    </Card>
  );
}
