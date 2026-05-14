import { client } from '@/sanity/lib/client';

export interface SearchResult {
  _id: string;
  _type: 'directoryItem' | 'forumPost' | 'blogPost';
  title: string;
  subtitle?: string;
  slug?: string;
  publishedAt?: string;
}

export async function getGlobalSearchResults(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const groqQuery = `
    *[( _type == "directoryItem" && (name match $searchQuery || city match $searchQuery || country match $searchQuery) ) ||
      ( _type == "forumPost" && (title match $searchQuery || content[].children[].text match $searchQuery) ) ||
      ( _type == "blogPost" && (title match $searchQuery || summary match $searchQuery || tag match $searchQuery) )
    ] {
      _id,
      _type,
      "title": coalesce(name, title),
      "subtitle": coalesce(category, tag, "Discussion"),
      "slug": slug.current,
      publishedAt
    }[0...10]
  `;

  try {
    const results = await client.fetch(groqQuery, { searchQuery: `*${query}*` });
    return results;
  } catch (error) {
    console.error("Global search error:", error);
    return [];
  }
}
