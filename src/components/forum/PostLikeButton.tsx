'use client';

import * as React from 'react';
import styled from 'styled-components';

const Btn = styled.button<{ $liked?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 100px;
  border: 2px solid ${props => props.$liked ? '#6c30c0' : '#e5edf5'};
  background: ${props => props.$liked ? 'rgba(108,48,192,0.08)' : 'transparent'};
  color: ${props => props.$liked ? '#6c30c0' : '#425466'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #6c30c0;
    color: #6c30c0;
    background: rgba(108,48,192,0.06);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function PostLikeButton({
  postId,
  initialLikedBy,
  currentUserId,
}: {
  postId: string
  initialLikedBy: string[]
  currentUserId?: string
}) {
  const [likedBy, setLikedBy] = React.useState(initialLikedBy)
  const [loading, setLoading] = React.useState(false)
  const liked = currentUserId ? likedBy.includes(currentUserId) : false

  const toggle = async () => {
    if (!currentUserId || loading) return
    setLoading(true)
    try {
      await fetch(`/api/forum/post/${postId}/like`, { method: 'POST' })
      setLikedBy(liked
        ? likedBy.filter(u => u !== currentUserId)
        : [...likedBy, currentUserId]
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Btn $liked={liked} onClick={toggle} disabled={loading || !currentUserId}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {liked ? 'Liked' : 'Like'} {likedBy.length > 0 && `· ${likedBy.length}`}
    </Btn>
  )
}
