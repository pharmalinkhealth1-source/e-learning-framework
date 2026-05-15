"use client";

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import styles from './Directory.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const LocationMap = dynamic(() => import('@/components/map/LocationMap'), {
  ssr: false,
  loading: () => <div style={{ height: '600px', background: '#f6f9fc', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--hds-color-text-secondary)' }}>Loading Map...</div>
});

const CATEGORIES = [
  { title: 'All', value: 'all' },
  { title: 'Pharmacy', value: 'pharmacy' },
  { title: 'Clinic', value: 'clinic' },
  { title: 'Distribution Hub', value: 'distribution-hub' },
  { title: 'Training Centre', value: 'training-centre' },
  { title: 'Laboratory', value: 'laboratory' },
];

interface Location {
  _id: string;
  name: string;
  category: string;
  address?: string;
  city?: string;
  country?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export default function DirectoryClient({ 
  initialLocations, 
  initialSearch = "" 
}: { 
  initialLocations: Location[], 
  initialSearch?: string 
}) {
  const [search, setSearch] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredLocations = useMemo(() => {
    return initialLocations.filter(loc => {
      const matchesSearch = loc.name.toLowerCase().includes(search.toLowerCase()) || 
                            (loc.city?.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = activeCategory === "all" || loc.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialLocations, search, activeCategory]);

  return (
    <section className={styles.directoryLayout}>
      <div className={styles.sidebar}>
        <div className={styles.searchWrapper}>
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Search by name or city..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterPills}>
          {CATEGORIES.map((cat) => (
            <button 
              key={cat.value} 
              className={`${styles.filterPill} ${cat.value === activeCategory ? styles.filterPillActive : ''}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.title}
            </button>
          ))}
        </div>

        <div className={styles.locationList}>
          <AnimatePresence mode="popLayout">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <motion.div 
                  key={loc._id} 
                  className={styles.locationCard}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <span className={styles.cardCategory}>{loc.category.replace('-', ' ')}</span>
                  <h3 className={styles.cardTitle}>{loc.name}</h3>
                  <p className={styles.cardAddress}>
                    {loc.address}{loc.city ? `, ${loc.city}` : ''}{loc.country ? `, ${loc.country}` : ''}
                  </p>
                </motion.div>
              ))
            ) : (
              <motion.div 
                style={{ padding: '40px', textAlign: 'center', background: '#f6f9fc', borderRadius: '16px', color: 'var(--hds-color-text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No locations match your criteria.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className={styles.mapSection}>
        <LocationMap locations={filteredLocations} />
      </div>
    </section>
  );
}
