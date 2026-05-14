"use client";

import * as React from 'react';
import styled from 'styled-components';

const Form = styled.form`
  margin-top: 20px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E6EBF1;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #E6EBF1;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #6c30c0;
    box-shadow: 0 0 0 4px rgba(108, 48, 192, 0.1);
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0a2540;
  margin-bottom: 8px;
`;

const SubmitBtn = styled.button`
  background-color: #6c30c0;
  color: white;
  padding: 10px 20px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4f2683;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default function CommentForm({ 
  postId, 
  parentCommentId, 
  onSuccess 
}: { 
  postId: string, 
  parentCommentId?: string,
  onSuccess?: () => void
}) {
  const [content, setContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    setStatus('idle');

    try {
      const res = await fetch("/api/forum/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content, parentCommentId }),
      });

      if (res.ok) {
        setStatus('success');
        setContent("");
        if (onSuccess) onSuccess();
        // In a real app, we might trigger a revalidation or update local state
        window.location.reload(); 
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>{parentCommentId ? "Reply to comment" : "Add a comment"}</Label>
      <TextArea
        placeholder={parentCommentId ? "Type your reply..." : "What are your thoughts?"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        disabled={isLoading}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <SubmitBtn type="submit" disabled={isLoading}>
          {isLoading ? "Posting..." : parentCommentId ? "Post reply" : "Post comment"}
        </SubmitBtn>
        
        {status === 'success' && <span style={{ color: '#00A63E', fontSize: '14px' }}>Posted!</span>}
        {status === 'error' && <span style={{ color: '#D92121', fontSize: '14px' }}>Failed to post.</span>}
      </div>
    </Form>
  );
}
