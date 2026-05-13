import React from 'react';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import FooterCTA from '@/components/stripe/FooterCTA';
import styles from './page.module.css';

const EPISODES = [
  {
    number: 1,
    title: "The Future of Pharmaceutical Supply Chains in Africa",
    guest: "Dr. Amara Okafor",
    duration: "52 min",
    href: "/podcast",
  },
  {
    number: 2,
    title: "Cold Chain Innovations: Keeping Medicines Safe",
    guest: "Sarah Chen, PhD",
    duration: "41 min",
    href: "/podcast",
  },
  {
    number: 3,
    title: "Regulatory Pathways: Navigating West African Markets",
    guest: "Kofi Mensah",
    duration: "38 min",
    href: "/podcast",
  },
  {
    number: 4,
    title: "Digital Health Records and Pharmacy Modernisation",
    guest: "Dr. Zainab Yusuf",
    duration: "45 min",
    href: "/podcast",
  },
];

export default function PodcastPage() {
  return (
    <main className={styles.main}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Podcast</span>
          <h1 className={styles.title}>PharmaLink Podcast</h1>
          <p className={styles.subtitle}>
            Industry conversations with the leading voices shaping pharmaceutical
            practice across Africa and beyond.
          </p>
        </div>
      </section>

      <section className={styles.playerSection}>
        <div className={styles.container}>
          <iframe
            src="https://open.spotify.com/embed/show/2MAi0BvDc6GTFvKFPXnkCL?utm_source=generator"
            width="100%"
            height="352"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: '12px', border: 'none' }}
            title="PharmaLink Podcast on Spotify"
          />
        </div>
      </section>

      <section className={styles.episodesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Latest Episodes</h2>
          <ul className={styles.episodeList}>
            {EPISODES.map((ep) => (
              <li key={ep.number} className={styles.episodeCard}>
                <span className={styles.episodeNumber}>Ep. {ep.number}</span>
                <div className={styles.episodeBody}>
                  <p className={styles.episodeTitle}>{ep.title}</p>
                  <p className={styles.episodeGuest}>{ep.guest}</p>
                </div>
                <div className={styles.episodeMeta}>
                  <span className={styles.episodeDuration}>{ep.duration}</span>
                  <a href={ep.href} className={styles.episodeListen}>Listen →</a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FooterCTA />
      <Footer />
    </main>
  );
}
