"use client";

import * as React from 'react';
import styled from 'styled-components';
import CommentForm from './CommentForm';

const ThreadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CommentCard = styled.div<{ $isChild?: boolean }>`
  padding-left: ${props => props.$isChild ? '32px' : '0'};
  border-left: ${props => props.$isChild ? '2px solid #e5edf5' : 'none'};
  margin-left: ${props => props.$isChild ? '12px' : '0'};
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6c30c0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: #0a2540;
  font-size: 0.875rem;
`;

const Time = styled.span`
  color: #425466;
  font-size: 0.75rem;
`;

const CommentBody = styled.div`
  color: #425466;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  color: #6c30c0;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    color: #4f2683;
    text-decoration: underline;
  }
`;

const LikeBtn = styled.button<{ $liked?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$liked ? '#6c30c0' : '#888'};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;

  &:hover {
    color: #6c30c0;
    background: rgba(108, 48, 192, 0.06);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return (parts[0][0] ?? '?').toUpperCase()
  return ((parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')).toUpperCase()
}

interface CommentType {
  _id: string;
  content: string;
  authorName: string;
  publishedAt: string;
  likedBy?: string[];
  children?: CommentType[];
}

function CommentLike({ commentId, initialLikedBy, currentUserId }: {
  commentId: string
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
      await fetch(`/api/forum/comment/${commentId}/like`, { method: 'POST' })
      setLikedBy(liked
        ? likedBy.filter(u => u !== currentUserId)
        : [...likedBy, currentUserId]
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <LikeBtn $liked={liked} onClick={toggle} disabled={loading || !currentUserId} title={liked ? 'Unlike' : 'Like'}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {likedBy.length > 0 && likedBy.length}
    </LikeBtn>
  )
}

export default function CommentThread({
  comments,
  postId,
  currentUserId,
  isChild = false,
}: {
  comments: CommentType[]
  postId: string
  currentUserId?: string
  isChild?: boolean
}) {
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);

  return (
    <ThreadContainer>
      {comments.map((comment) => (
        <CommentCard key={comment._id} $isChild={isChild}>
          <CommentHeader>
            <Avatar>{getInitials(comment.authorName || '?')}</Avatar>
            <AuthorName>{comment.authorName}</AuthorName>
            <Time>{new Date(comment.publishedAt).toLocaleDateString()}</Time>
          </CommentHeader>
          <CommentBody>{comment.content}</CommentBody>

          <ActionRow>
            <CommentLike
              commentId={comment._id}
              initialLikedBy={comment.likedBy ?? []}
              currentUserId={currentUserId}
            />
            <ActionBtn onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}>
              {replyingTo === comment._id ? 'Cancel' : 'Reply'}
            </ActionBtn>
          </ActionRow>

          {replyingTo === comment._id && (
            <div style={{ marginTop: '16px', marginBottom: '24px' }}>
              <CommentForm
                postId={postId}
                parentCommentId={comment._id}
                onSuccess={() => setReplyingTo(null)}
              />
            </div>
          )}

          {comment.children && comment.children.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <CommentThread
                comments={comment.children}
                postId={postId}
                currentUserId={currentUserId}
                isChild={true}
              />
            </div>
          )}
        </CommentCard>
      ))}
    </ThreadContainer>
  );
}
