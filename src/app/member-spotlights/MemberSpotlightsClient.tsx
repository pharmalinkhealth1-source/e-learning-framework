'use client';

import React, { useState, useMemo } from 'react';
import { SpotlightCard } from '@/components/community/SpotlightCard';
import { StripeInput, StripeSelect } from '@/components/stripe/StripeUI';
import styles from './MemberSpotlights.module.css';

interface MemberSpotlightsClientProps {
  initialSpotlights: any[];
}

export default function MemberSpotlightsClient({ initialSpotlights }: MemberSpotlightsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('All Countries');
  const [sortBy, setSortBy] = useState('Recently Added');

  // Extract unique countries for the filter dropdown
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(new Set(initialSpotlights.map(s => s.country))).filter(Boolean);
    return ['All Countries', ...uniqueCountries.sort()];
  }, [initialSpotlights]);

  const filteredSpotlights = useMemo(() => {
    let result = [...initialSpotlights];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.jobTitle.toLowerCase().includes(query) || 
        (s.organization && s.organization.toLowerCase().includes(query)) ||
        s.excerpt.toLowerCase().includes(query)
      );
    }

    // Country filter
    if (countryFilter !== 'All Countries') {
      result = result.filter(s => s.country === countryFilter);
    }

    // Sorting
    if (sortBy === 'Recently Added') {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'Oldest First') {
      result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    } else if (sortBy === 'Alphabetical') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [initialSpotlights, searchQuery, countryFilter, sortBy]);

  return (
    <>
      <div className={styles.filterBar}>
        <div className={styles.searchInputWrapper}>
          <StripeInput 
            type="text" 
            placeholder="Search spotlights..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={styles.selectWrapper}>
          <StripeSelect 
            className={styles.filterSelect}
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </StripeSelect>
        </div>

        <div className={styles.selectWrapper}>
          <StripeSelect 
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option>Recently Added</option>
            <option>Oldest First</option>
            <option>Alphabetical</option>
          </StripeSelect>
        </div>
      </div>

      <section className={styles.grid}>
        {filteredSpotlights.length > 0 ? (
          filteredSpotlights.map((spotlight) => (
            <SpotlightCard key={spotlight._id} spotlight={spotlight} />
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No spotlights found matching your criteria. Try adjusting your filters.</p>
          </div>
        )}
      </section>
    </>
  );
}
