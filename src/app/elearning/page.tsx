"use client";

import React, { useState } from 'react';
import Navbar from "@/components/stripe/Navbar";
import Footer from "@/components/stripe/Footer";
import FooterCTA from "@/components/stripe/FooterCTA";
import MeshGradient from "@/components/stripe/MeshGradient";
import WaitlistDialog from "@/components/stripe/WaitlistDialog";
import styles from './page.module.css';

export default function ELearningPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.gradientBg}>
          <MeshGradient colors={['#e2e8f0', '#b8a9d1', '#f2c2e0', '#cbd5e1']} speed={0.005} />
        </div>
        <div className={styles.gradientOverlay} />
        
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Professional Development</span>
          <h1 className={styles.title}>Advance Your Clinical Excellence.</h1>
          <p className={styles.subtitle}>
            Access world-class curriculum designed specifically for the unique challenges of the African pharmaceutical landscape.
          </p>
          
          <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" placeholder="Search curriculum, topics, or certificates..." className={styles.searchInput} />
              <button className={styles.searchBtn}>Search</button>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.gridLinesContainer}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.line}></div>
        ))}
      </div>

      {/* Featured Course Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.featuredCard}>
            <div className={styles.featuredContent}>
              <div className={styles.badge}>Featured Certificate</div>
              <h2 className={styles.featuredTitle}>Pharmacy-Based Immunization Delivery</h2>
              <p className={styles.featuredDescription}>
                The purpose of this certificate training program is to prepare pharmacists with comprehensive knowledge, skills, and resources necessary to provide immunization services to patients across the life span.
              </p>
              <p className={styles.featuredDetails}>
                APhA's Pharmacy-Based Immunization Delivery certificate training program is based on national educational standards for immunization training from the Centers for Disease Control and Prevention. This practice-based curriculum represents a fusion of science and clinical pharmacy. The program, which emphasizes a health care team approach, seeks to foster the implementation of interventions that will promote disease prevention and public health.
              </p>
              <button className={styles.primaryBtn} onClick={() => setIsWaitlistOpen(true)}>
                Explore Course
                <svg className={styles.arrowIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
            <div className={styles.featuredImage}>
              <div className={styles.imagePlaceholder}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6c30c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Curriculum Pillars */}
          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2v7.31"></path>
                  <path d="M14 9.3V1.99"></path>
                  <path d="M8.5 2h7"></path>
                  <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
                  <path d="M5.52 16h12.96"></path>
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>Science-Based Curriculum</h3>
              <p className={styles.pillarDesc}>
                Rooted in the latest pharmacological science and national educational standards from the Centers for Disease Control and Prevention.
              </p>
            </div>
            
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>Team Healthcare Approach</h3>
              <p className={styles.pillarDesc}>
                Emphasizing interprofessional collaboration to integrate pharmacy practice effectively into the broader healthcare team.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20"></path>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>Public Health Impact</h3>
              <p className={styles.pillarDesc}>
                Fostering the implementation of practical interventions that directly promote disease prevention and community health.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterCTA />
      <Footer />
      
      <WaitlistDialog isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </main>
  );
}
