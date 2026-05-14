"use client";

import { useForumSync } from '@/hooks/useForumSync';

export default function ForumSync({ postId }: { postId?: string }) {
  useForumSync(postId);
  return null;
}
