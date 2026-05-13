"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './SearchModal.module.css';
import { getGlobalSearchResults } from '@/lib/search';
import { MapPin, MessageCircle, BookOpen } from 'lucide-react';


interface SearchResult {
  id: string;
  type: 'directory' | 'forum' | 'blog';
  title: string;
  subtitle?: string;
  url: string;
}

function highlightMatch(text: string, query: string) {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() ? 
      <mark key={i} className={styles.highlight}>{part}</mark> : 
      part
  );
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Toggle logic should be in parent, but if we're here, we just close if open
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle search logic
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      
      const searchResults = await getGlobalSearchResults(query);
      
      // Map Sanity results to UI format
      const formattedResults: SearchResult[] = searchResults.map(item => ({
        id: item._id,
        type: item._type === 'directoryItem' ? 'directory' : item._type === 'forumPost' ? 'forum' : 'blog',
        title: item.title,
        subtitle: item.subtitle,
        url: item._type === 'directoryItem' ? `/directory?search=${item.title}` :
             item._type === 'forumPost' ? `/forum/${item.slug}` :
             `/blog/${item.slug}`
      }));
      
      setResults(formattedResults);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className={styles.modal}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.searchHeader}>
              <svg className={styles.searchIcon} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input 
                ref={inputRef}
                type="text" 
                className={styles.input} 
                placeholder="Search PharmaLink..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isSearching && (
                <div className={styles.spinner}></div>
              )}
            </div>

            <div className={styles.results}>
              {results.length > 0 ? (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Results</div>
                  {results.map((result) => (
                    <Link 
                      key={result.id} 
                      href={result.url} 
                      className={styles.resultItem}
                      onClick={onClose}
                    >
                      <div className={styles.resultIcon}>
                        {result.type === 'directory' && '📍'}
                        {result.type === 'forum' && '💬'}
                        {result.type === 'blog' && '📰'}
                      </div>
                      <div className={styles.resultInfo}>
                        <h4 className={styles.resultTitle}>{highlightMatch(result.title, query)}</h4>
                        {result.subtitle && <p className={styles.resultSubtitle}>{highlightMatch(result.subtitle, query)}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className={styles.emptyState}>
                  No results found for "{query}"
                </div>
              ) : (
                <div className={styles.suggestionSection}>
                  <div className={styles.sectionTitle}>Suggested Topics</div>
                  <div className={styles.suggestionGrid}>
                    {['Inventory Management', 'Lagos Clinics', 'Medical Research', 'Vaccine Distribution'].map((topic) => (
                      <button 
                        key={topic} 
                        className={styles.suggestionChip}
                        onClick={() => setQuery(topic)}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                  
                  <div className={styles.sectionTitle} style={{ marginTop: '32px' }}>Quick Actions</div>
                  <div className={styles.quickActions}>
                    <Link href="/directory" className={styles.quickAction} onClick={onClose}>
                      <MapPin size={15} /> Browse Directory
                    </Link>
                    <Link href="/forum" className={styles.quickAction} onClick={onClose}>
                      <MessageCircle size={15} /> Visit Community Forum
                    </Link>
                    <Link href="/blog" className={styles.quickAction} onClick={onClose}>
                      <BookOpen size={15} /> Read Latest Insights
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.footer}>
              <div className={styles.shortcuts}>
                <div className={styles.shortcut}>
                  <span className={styles.key}>ESC</span> to close
                </div>
              </div>
              <div>
                Global Search v1.0
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
