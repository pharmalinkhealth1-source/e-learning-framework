"use client";

import * as React from 'react';
import { StripeButton } from '@/components/stripe/StripeUI';
import styled from 'styled-components';

const Form = styled.form`
  margin-top: 40px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--hds-shadow-card);
  border: 1px solid #E6EBF1;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #E6EBF1;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  margin-bottom: 20px;
  transition: border-color 0.2s ease;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--hds-color-primary);
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--hds-color-fg);
  margin-bottom: 8px;
`;

export default function CommentForm({ postId }: { postId: string }) {
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
        body: JSON.stringify({ postId, content }),
      });

      if (res.ok) {
        setStatus('success');
        setContent("");
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
      <Label>Add a comment</Label>
      <TextArea
        placeholder="What are your thoughts?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <StripeButton type="submit" isLoading={isLoading}>
          Post comment
        </StripeButton>
        
        {status === 'success' && <span style={{ color: '#00A63E', fontSize: '14px' }}>Comment posted!</span>}
        {status === 'error' && <span style={{ color: '#D92121', fontSize: '14px' }}>Failed to post comment.</span>}
      </div>
    </Form>
  );
}
