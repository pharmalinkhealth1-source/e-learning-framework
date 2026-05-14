"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';

export function useForumSync(postId?: string) {
  const router = useRouter();

  useEffect(() => {
    // Listen for any changes to forumPost or comment documents
    const query = postId 
      ? `*[_type == "comment" && parentPost._ref == "${postId}"]`
      : `*[_type == "forumPost"]`;

    const subscription = client.listen(query).subscribe((update) => {
      console.log('Sanity update received:', update);
      // Revalidate the data for the current route
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [postId, router]);
}
