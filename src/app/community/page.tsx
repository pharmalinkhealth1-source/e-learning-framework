import React from 'react';
import Navbar from "@/components/stripe/Navbar";
import Footer from "@/components/stripe/Footer";
import FooterCTA from "@/components/stripe/FooterCTA";
import MeshGradient from "@/components/stripe/MeshGradient";
import { TactileButton } from "@/components/stripe/TactileButton";
import styles from './page.module.css';
import { client } from '@/sanity/lib/client';
import CommunityClient from './CommunityClient';
import { TrendingUp, MessageSquare } from 'lucide-react';


const CATEGORIES = [
  "All Discussions", 
  "Clinical Practice", 
  "Regulatory Updates", 
  "Supply Chain", 
  "Professional Development", 
  "Technology"
];

const DISCUSSIONS = [
  {
    id: 1,
    category: "Clinical Practice",
    title: "Best practices for cold chain management in rural clinics",
    excerpt: "Maintaining temperature integrity during the last mile is our biggest challenge. What solutions have you found effective for off-grid refrigeration?",
    author: "Dr. Amara Okoro",
    initials: "AO",
    date: "2 days ago",
    replies: 18
  },
  {
    id: 2,
    category: "Regulatory Updates",
    title: "New WHO guidelines on essential medicines list 2024",
    excerpt: "The latest update includes several new cardiovascular treatments. How will this impact local procurement strategies in West Africa?",
    author: "Kofi Mensah",
    initials: "KM",
    date: "4 days ago",
    replies: 12
  },
  {
    id: 3,
    category: "Supply Chain",
    title: "Addressing stockouts of pediatric antimalarials",
    excerpt: "We're seeing increased demand this season. Has anyone else experienced delays in the central distribution hub this month?",
    author: "Sarah Jappah",
    initials: "SJ",
    date: "1 week ago",
    replies: 24
  },
  {
    id: 4,
    category: "Professional Development",
    title: "Continuing education credits for community pharmacists",
    excerpt: "Does anyone know if the new PharmaLink clinical training modules are accredited for CPD points by the national board?",
    author: "Chidi Eze",
    initials: "CE",
    date: "1 week ago",
    replies: 9
  },
  {
    id: 5,
    category: "Technology",
    title: "Implementing digital inventory in small independent pharmacies",
    excerpt: "Transitioning from paper to digital has been transformative for our stock accuracy. Happy to share my transition roadmap with anyone interested.",
    author: "Abebe Bikila",
    initials: "AB",
    date: "2 weeks ago",
    replies: 31
  },
  {
    id: 6,
    category: "Clinical Practice",
    title: "Interpreting new pediatric dosing for artemisinin-based therapies",
    excerpt: "I've noticed some discrepancies in the latest regional guidelines. Let's discuss the clinical implications for patient safety.",
    author: "Dr. Zainab Yusuf",
    initials: "ZY",
    date: "2 weeks ago",
    replies: 15
  }
];

const STATS = [
  { number: "2,400+", label: "Professional Members" },
  { number: "580+", label: "Active Discussions" },
  { number: "12", label: "Countries Represented" }
];

const MEMBERS = [
  { name: "Dr. Elena Mensah", role: "Clinical Pharmacist", location: "Accra, Ghana", initials: "EM" },
  { name: "Samuel Okonjo", role: "Supply Chain Manager", location: "Lagos, Nigeria", initials: "SO" },
  { name: "Zewdie Haile", role: "Regulatory Consultant", location: "Addis Ababa, Ethiopia", initials: "ZH" },
  { name: "Fatoumata Diop", role: "Public Health Officer", location: "Dakar, Senegal", initials: "FD" }
];

interface Spotlight {
  _id: string;
  name: string;
  slug: { current: string };
  jobTitle: string;
  organization: string;
  country: string;
  quote: string;
  excerpt: string;
  image: {
    externalUrl?: string;
    url?: string;
  }
}

async function getFeaturedSpotlights() {
  return await client.fetch<Spotlight[]>(`
    *[_type == "memberSpotlight" && featured == true] | order(publishedAt desc)[0...10] {
      _id,
      name,
      slug,
      jobTitle,
      organization,
      country,
      quote,
      excerpt,
      image {
        externalUrl,
        "url": asset->url
      }
    }
  `);
}

export default async function CommunityPage() {
  const featuredSpotlights = await getFeaturedSpotlights();

  return (
    <main className={styles.main}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.gradientBg}>
          <MeshGradient 
            colors={['#f6f1ff', '#e9d5ff', '#d8b4fe', '#f3e8ff']} 
            speed={0.005} 
          />
        </div>
        <div className={styles.gradientOverlay} />

        <div className={styles.gridLinesContainer}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.line}></div>
          ))}
        </div>

        <div className={styles.heroContent}>
          <div>
            <span className={styles.eyebrow}>Community</span>
            <h1 className={styles.title}>
              Connect. Collaborate. Advance.
            </h1>
            <p className={styles.subtitle}>
              Join a growing network of pharmaceutical professionals sharing insights, solving challenges, and advancing healthcare across Africa.
            </p>
          </div>
        </div>
      </section>

      <CommunityClient 
        categories={CATEGORIES}
        discussions={DISCUSSIONS}
        stats={STATS}
        members={MEMBERS}
        spotlights={featuredSpotlights}
      />

      <FooterCTA />
      <Footer />
    </main>
  );
}
