"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const FormContainer = styled.div`
  background: white;
  padding: 40px;
  border-radius: 24px;
  max-width: 700px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--hds-color-text-primary);
  margin-bottom: 32px;
  letter-spacing: -0.02em;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--hds-color-text-secondary);
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 20px;
  border: 1px solid #e5edf5;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #6c30c0;
    box-shadow: 0 0 0 4px rgba(108, 48, 192, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 14px 20px;
  border: 1px solid #e5edf5;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
  resize: vertical;
  
  &:focus {
    border-color: #6c30c0;
    box-shadow: 0 0 0 4px rgba(108, 48, 192, 0.1);
  }
`;

const SubmitBtn = styled.button`
  background-color: #6c30c0;
  color: white;
  padding: 16px 32px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 12px;

  &:hover {
    background-color: #4f2683;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(108, 48, 192, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMsg = styled.p`
  color: #df1b41;
  font-size: 0.875rem;
  margin-top: 12px;
  text-align: center;
`;

export default function CreatePostForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/forum/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (res.ok) {
        if (onSuccess) onSuccess();
        router.push(`/forum/${data.slug}`);
      } else {
        setError(data.error || "Failed to create post");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>Start a Conversation</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Post Title</Label>
          <Input 
            id="title"
            type="text" 
            placeholder="e.g., Best practices for cold chain management" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">Post Content</Label>
          <TextArea 
            id="content"
            placeholder="Share your thoughts, questions, or updates with the community..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={isLoading}
          />
        </FormGroup>

        <SubmitBtn type="submit" disabled={isLoading}>
          {isLoading ? "Publishing..." : "Publish Post"}
        </SubmitBtn>

        {error && <ErrorMsg>{error}</ErrorMsg>}
      </form>
    </FormContainer>
  );
}
