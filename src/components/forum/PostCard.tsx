import * as React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

interface PostCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  slug: string;
}

const Card = styled(Link)`
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

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--hds-color-fg);
  margin-bottom: 8px;
`;

const Excerpt = styled.p`
  font-size: 14px;
  color: #425466;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #707070;
`;

const AuthorBadge = styled.span`
  background: #F6F9FC;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  color: var(--hds-color-primary);
`;

export default function PostCard({ title, excerpt, author, date, slug }: PostCardProps) {
  return (
    <Card href={`/forum/${slug}`}>
      <Title>{title}</Title>
      <Excerpt>{excerpt}</Excerpt>
      <Meta>
        <AuthorBadge>{author}</AuthorBadge>
        <span>•</span>
        <span>{date}</span>
      </Meta>
    </Card>
  );
}
