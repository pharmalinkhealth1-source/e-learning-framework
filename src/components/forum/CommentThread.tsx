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

interface CommentType {
  _id: string;
  content: string;
  authorName: string;
  authorInitials: string;
  publishedAt: string;
  children?: CommentType[];
}

export default function CommentThread({ 
  comments, 
  postId, 
  isChild = false 
}: { 
  comments: CommentType[], 
  postId: string,
  isChild?: boolean
}) {
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);

  return (
    <ThreadContainer>
      {comments.map((comment) => (
        <CommentCard key={comment._id} $isChild={isChild}>
          <CommentHeader>
            <Avatar>{comment.authorInitials}</Avatar>
            <AuthorName>{comment.authorName}</AuthorName>
            <Time>{new Date(comment.publishedAt).toLocaleDateString()}</Time>
          </CommentHeader>
          <CommentBody>{comment.content}</CommentBody>
          
          <ActionRow>
            <ActionBtn onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}>
              {replyingTo === comment._id ? "Cancel" : "Reply"}
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
                isChild={true} 
              />
            </div>
          )}
        </CommentCard>
      ))}
    </ThreadContainer>
  );
}
