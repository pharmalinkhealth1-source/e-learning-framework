import React from 'react';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import { getGlobalSearchResults } from '@/lib/search';
import Link from 'next/link';
import styles from './SearchPage.module.css';


function highlightMatch(text: string, query: string) {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() ? 
      <mark key={i} className={styles.highlight}>{part}</mark> : 
      part
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string, type?: string }>;
}) {
  const { q: query = '', type: activeType = 'all' } = await searchParams;
  let allResults = await getGlobalSearchResults(query);
  
  // Filter by type if not 'all'
  const filteredResults = activeType === 'all' 
    ? allResults 
    : allResults.filter(r => {
        if (activeType === 'directory') return r._type === 'directoryItem';
        if (activeType === 'forum') return r._type === 'forumPost';
        if (activeType === 'blog') return r._type === 'blogPost';
        return true;
      });

  const types = [
    { id: 'all', label: 'All Results', count: allResults.length },
    { id: 'directory', label: 'Locations', count: allResults.filter(r => r._type === 'directoryItem').length },
    { id: 'forum', label: 'Discussions', count: allResults.filter(r => r._type === 'forumPost').length },
    { id: 'blog', label: 'Insights', count: allResults.filter(r => r._type === 'blogPost').length },
  ];

  return (
    <main className={styles.main}>
      <Navbar />
      
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              {query ? `Search results for "${query}"` : 'Search the Ecosystem'}
            </h1>
            <p className={styles.subtitle}>
              Find pharmacies, clinics, medical discussions, and clinical research in one place.
            </p>
          </div>

          <form action="/search" className={styles.searchForm}>
            <div className={styles.inputWrapper}>
              <svg className={styles.searchIcon} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input 
                type="text" 
                name="q" 
                defaultValue={query}
                placeholder="What are you looking for?" 
                className={styles.searchInput}
                autoFocus
              />
              {activeType !== 'all' && <input type="hidden" name="type" value={activeType} />}
              <button type="submit" className={styles.searchButton}>
                Find
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className={styles.resultsSection}>
        <div className={styles.container}>
          <div className={styles.layout}>
            {/* Sidebar Filters */}
            <aside className={styles.sidebar}>
              <div className={styles.filterTitle}>Filter by Category</div>
              <div className={styles.filterList}>
                {types.map(type => (
                  <Link 
                    key={type.id}
                    href={`/search?q=${encodeURIComponent(query)}${type.id !== 'all' ? `&type=${type.id}` : ''}`}
                    className={`${styles.filterItem} ${activeType === type.id ? styles.filterItemActive : ''}`}
                  >
                    <span>{type.label}</span>
                    <span className={styles.filterCount}>{type.count}</span>
                  </Link>
                ))}
              </div>
            </aside>

            {/* Results List */}
            <div className={styles.resultsContent}>
              {filteredResults.length > 0 ? (
                <div className={styles.resultsList}>
                  {filteredResults.map((result) => (
                    <Link 
                      key={result._id} 
                      href={result._type === 'directoryItem' ? `/directory?search=${result.title}` :
                            result._type === 'forumPost' ? `/forum/${result.slug}` :
                            `/blog/${result.slug}`}
                      className={styles.resultItem}
                    >
                      <div className={styles.resultHeader}>
                        <div className={styles.badge}>
                          {result._type === 'directoryItem' && '📍 Location'}
                          {result._type === 'forumPost' && '💬 Discussion'}
                          {result._type === 'blogPost' && '📰 Insight'}
                        </div>
                      </div>
                      <h3 className={styles.resultItemTitle}>{highlightMatch(result.title, query)}</h3>
                      <p className={styles.resultItemSubtitle}>{highlightMatch(result.subtitle || '', query)}</p>
                      
                      <div className={styles.resultFooter}>
                        <span className={styles.viewLink}>
                          View details
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🔍</div>
                  <h3 className={styles.emptyTitle}>No matches found</h3>
                  <p className={styles.emptyText}>
                    We couldn't find anything matching "{query}" in this category. 
                    Try adjusting your search or switching categories.
                  </p>
                  <Link href="/search?q=" className={styles.clearLink}>Clear all filters</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
