import React from 'react';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import { client } from '@/sanity/lib/client';
import styles from './Directory.module.css';
import DirectoryClient from './DirectoryClient';

const SEED_LOCATIONS = [
  {
    _id: 'seed-1',
    name: 'PharmaLink Lagos Hub',
    category: 'distribution-hub',
    address: '15 Ikeja Way',
    city: 'Lagos',
    country: 'Nigeria',
    location: { lat: 6.5244, lng: 3.3792 }
  },
  {
    _id: 'seed-2',
    name: 'Nairobi Clinical Center',
    category: 'clinic',
    address: 'Ngong Road',
    city: 'Nairobi',
    country: 'Kenya',
    location: { lat: -1.2921, lng: 36.8219 }
  },
  {
    _id: 'seed-3',
    name: 'Addis Pharmacy Central',
    category: 'pharmacy',
    address: 'Bole Road',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    location: { lat: 9.0300, lng: 38.7400 }
  },
  {
    _id: 'seed-4',
    name: 'Accra Training Institute',
    category: 'training-centre',
    address: 'Cantonments',
    city: 'Accra',
    country: 'Ghana',
    location: { lat: 5.6037, lng: -0.1870 }
  },
  {
    _id: 'seed-5',
    name: 'Ibadan Biotech Lab',
    category: 'laboratory',
    address: 'University Road',
    city: 'Ibadan',
    country: 'Nigeria',
    location: { lat: 7.3775, lng: 3.9470 }
  },
  {
    _id: 'seed-6',
    name: 'Mombasa Coastal Clinic',
    category: 'clinic',
    address: 'Nyali Bridge',
    city: 'Mombasa',
    country: 'Kenya',
    location: { lat: -4.0435, lng: 39.6682 }
  }
];

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search: initialSearch = '' } = await searchParams;
  let locations = [];
  try {
    locations = await client.fetch(`*[_type == "directoryItem"] {
      _id,
      name,
      category,
      address,
      city,
      country,
      location {
        lat,
        lng
      }
    }`);
  } catch (error) {
    console.error("Sanity fetch error:", error);
  }

  // Use seed data if no results from Sanity
  const finalLocations = locations.length > 0 ? locations : SEED_LOCATIONS;

  return (
    <main className={styles.main}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.gridLinesContainer}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.line}></div>
          ))}
        </div>
        
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Directory</span>
          <h1 className={styles.title}>Pharmaceutical Network</h1>
          <p className={styles.subtitle}>
            Explore our ecosystem of verified pharmacies, clinics, and distribution hubs across the continent.
          </p>
        </div>
      </section>

      <DirectoryClient initialLocations={finalLocations} initialSearch={initialSearch} />

      <Footer />
    </main>
  );
}
