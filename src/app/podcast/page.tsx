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

const PLATFORMS = [
  {
    name: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/new",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M267.429 488.563C262.286 507.573 242.858 512 224 512c-18.857 0-38.286-4.427-43.428-23.437C172.927 460.134 160 388.898 160 355.75c0-35.156 31.142-43.75 64-43.75s64 8.594 64 43.75c0 32.949-12.871 104.179-20.571 132.813zM156.867 288.554c-18.693-18.308-29.958-44.173-28.784-72.599 2.054-49.724 42.395-89.956 92.124-91.881C274.862 121.958 320 165.807 320 220c0 26.827-11.064 51.116-28.866 68.552-2.675 2.62-2.401 6.986.628 9.187 9.312 6.765 16.46 15.343 21.234 25.363 1.741 3.654 6.497 4.66 9.449 1.891 28.826-27.043 46.553-65.783 45.511-108.565-1.855-76.206-63.595-138.208-139.793-140.369C146.869 73.753 80 139.215 80 220c0 41.361 17.532 78.7 45.55 104.989 2.953 2.771 7.711 1.77 9.453-1.887 4.774-10.021 11.923-18.598 21.235-25.363 3.029-2.2 3.304-6.566.629-9.185zM224 0C100.204 0 0 100.185 0 224c0 89.992 52.602 165.647 125.739 201.408 4.333 2.118 9.267-1.544 8.535-6.31-2.382-15.512-4.342-30.946-5.406-44.339-.146-1.836-1.149-3.486-2.678-4.512-47.4-31.806-78.564-86.016-78.187-147.347.592-96.237 79.29-174.648 175.529-174.899C320.793 47.747 400 126.797 400 224c0 61.932-32.158 116.49-80.65 147.867-.999 14.037-3.069 30.588-5.624 47.23-.732 4.767 4.203 8.429 8.535 6.31C395.227 389.727 448 314.187 448 224 448 100.205 347.815 0 224 0zm0 160c-35.346 0-64 28.654-64 64s28.654 64 64 64 64-28.654 64-64-28.654-64-64-64z" />
      </svg>
    ),
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z" />
      </svg>
    ),
  },
  {
    name: "Amazon Music",
    href: "https://music.amazon.com/podcasts/",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" />
      </svg>
    ),
  },
  {
    name: "iHeart Radio",
    href: "https://www.iheart.com/podcast/",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
      </svg>
    ),
  },
];

export default function PodcastPage() {
  return (
    <main className={styles.main}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          {/* Left column */}
          <div className={styles.heroLeft}>
            <span className={styles.eyebrow}>
              <svg aria-hidden="true" className={styles.eyebrowIcon} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm80 248c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80z" />
              </svg>
              Podcast Episodes Monthly
            </span>

            <h1 className={styles.title}>
              PharmaLink<br />Exchange
            </h1>

            <p className={styles.subtitle}>
              Hosted by Project Director <strong>Betty Abera</strong>, and co-hosted by Program Manager <strong>Alexandra Miller</strong>, the PharmaLink Exchange podcast dives into stories of innovation, digital integration, and the evolving role of pharmacists and other private-sector healthcare providers in delivering community-centered care, with perspectives from Country Program Managers <strong>Adebayo Adebisi</strong>, <strong>Belete Ayalneh</strong>, and <strong>Florence Wachera</strong>.
            </p>

            <div className={styles.heroActions}>
              <a href="#" className={styles.btnPrimary}>
                <svg aria-hidden="true" className={styles.btnIcon} viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M128.081 415.959c0 35.369-28.672 64.041-64.041 64.041S0 451.328 0 415.959s28.672-64.041 64.041-64.041 64.04 28.673 64.04 64.041zm175.66 47.25c-8.354-154.6-132.185-278.587-286.95-286.95C7.656 175.765 0 183.105 0 192.253v48.069c0 8.415 6.49 15.472 14.887 16.018 111.832 7.284 201.473 96.702 208.772 208.772.547 8.397 7.604 14.887 16.018 14.887h48.069c9.149.001 16.489-7.655 15.995-16.79zm144.249.288C439.596 229.677 251.465 40.445 16.503 32.01 7.473 31.686 0 38.981 0 48.016v48.068c0 8.625 6.835 15.645 15.453 15.999 191.179 7.839 344.627 161.316 352.465 352.465.353 8.618 7.373 15.453 15.999 15.453h48.068c9.034-.001 16.329-7.474 16.005-16.504z" />
                </svg>
                Subscribe
              </a>
              <a href="#player" className={styles.btnSecondary}>
                <svg aria-hidden="true" className={styles.btnIcon} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M160 288h-16c-35.35 0-64 28.7-64 64.12v63.76c0 35.41 28.65 64.12 64 64.12h16c17.67 0 32-14.36 32-32.06V320.06c0-17.71-14.33-32.06-32-32.06zm208 0h-16c-17.67 0-32 14.35-32 32.06v127.88c0 17.7 14.33 32.06 32 32.06h16c35.35 0 64-28.71 64-64.12v-63.76c0-35.41-28.65-64.12-64-64.12zM256 32C112.91 32 4.57 151.13 0 288v112c0 8.84 7.16 16 16 16h16c8.84 0 16-7.16 16-16V288c0-114.67 93.33-207.8 208-207.82 114.67.02 208 93.15 208 207.82v112c0 8.84 7.16 16 16 16h16c8.84 0 16-7.16 16-16V288C507.43 151.13 399.09 32 256 32z" />
                </svg>
                Listen Now
              </a>
            </div>

            <p className={styles.platformsLabel}>Or wherever you get your podcasts:</p>
            <div className={styles.platforms}>
              {PLATFORMS.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={styles.platformBtn}
                  aria-label={p.name}
                >
                  {p.icon}
                  {p.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className={styles.heroRight}>
            <div className={styles.launchingSoon}>
              <span className={styles.launchingLabel}>Launching Soon</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.playerSection} id="player">
        <div className={styles.container}>
          <iframe
            src="https://open.spotify.com/embed/show/2MAi0BvDc6GTFvKFPXnkCL?utm_source=generator"
            width="100%"
            height="352"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: '12px', border: 'none' }}
            title="PharmaLink Exchange on Spotify"
          />
        </div>
      </section>

      <section className={styles.episodesSection}>
        <div className={styles.container}>
          <div className={styles.episodesHeader}>
            <h2 className={styles.sectionHeading}>Latest Episodes</h2>
            <div className={styles.episodesHeaderActions}>
              <a href="#" className={styles.viewAllLink}>
                View All
                <svg aria-hidden="true" className={styles.arrowIcon} viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                </svg>
              </a>
            </div>
          </div>

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

          <div className={styles.browseAllWrapper}>
            <a href="#" className={styles.btnPrimary}>
              <svg aria-hidden="true" className={styles.btnIcon} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.68423 19.9182V12.4344C9.29756 12.2726 8.98064 12.015 8.73348 11.6617C8.48614 11.3084 8.36248 10.9096 8.36248 10.4654C8.36248 9.87628 8.57156 9.37261 8.98973 8.95444C9.40789 8.53644 9.91164 8.32744 10.501 8.32744C11.0901 8.32744 11.5936 8.53644 12.0112 8.95444C12.4287 9.37261 12.6375 9.87628 12.6375 10.4654C12.6375 10.9096 12.5138 11.3084 12.2665 11.6617C12.0193 12.015 11.7024 12.2726 11.3157 12.4344V19.9182C11.3157 20.1564 11.2383 20.3529 11.0835 20.5077C10.9286 20.6625 10.7341 20.7399 10.5 20.7399C10.2658 20.7399 10.0713 20.6625 9.91648 20.5077C9.76164 20.3529 9.68423 20.1564 9.68423 19.9182ZM4.00048 17.3144C3.83848 17.4764 3.63506 17.5554 3.39023 17.5514C3.14523 17.5474 2.95014 17.4541 2.80498 17.2714C1.99298 16.3554 1.35998 15.3234 0.905976 14.1752C0.451976 13.0269 0.224976 11.7901 0.224976 10.4649C0.224976 9.04694 0.494476 7.71236 1.03348 6.46119C1.57231 5.21002 2.30473 4.12152 3.23073 3.19569C4.15656 2.26969 5.24523 1.53728 6.49673 0.998442C7.74823 0.459442 9.08314 0.189941 10.5015 0.189941C11.9196 0.189941 13.254 0.459442 14.5045 0.998442C15.7551 1.53728 16.8434 2.26969 17.7692 3.19569C18.6952 4.12152 19.4276 5.21002 19.9665 6.46119C20.5055 7.71236 20.775 9.04694 20.775 10.4649C20.775 11.7901 20.548 13.0269 20.094 14.1752C19.64 15.3234 19.007 16.3554 18.195 17.2714C18.0498 17.4541 17.8537 17.5506 17.6067 17.5609C17.3599 17.5713 17.1551 17.495 16.9922 17.3322C16.8311 17.171 16.7578 16.9732 16.7725 16.7387C16.7871 16.504 16.8755 16.2934 17.0375 16.1067C17.7001 15.3489 18.2158 14.4919 18.5845 13.5359C18.9531 12.5799 19.1375 11.5563 19.1375 10.4649C19.1375 8.06244 18.2986 6.02219 16.6207 4.34419C14.9427 2.66636 12.9025 1.82744 10.5 1.82744C8.09748 1.82744 6.05723 2.66636 4.37923 4.34419C2.70139 6.02219 1.86248 8.06244 1.86248 10.4649C1.86248 11.5563 2.04581 12.5809 2.41248 13.5389C2.77914 14.4968 3.29581 15.3547 3.96248 16.1127C4.12448 16.2994 4.21181 16.5058 4.22448 16.7319C4.23714 16.9583 4.16248 17.1524 4.00048 17.3144ZM6.88073 14.4342C6.71389 14.601 6.51414 14.6834 6.28148 14.6814C6.04881 14.6794 5.85989 14.5892 5.71473 14.4107C5.27339 13.8654 4.92673 13.263 4.67473 12.6037C4.42273 11.9444 4.29673 11.2314 4.29673 10.4649C4.29673 8.73777 4.89873 7.27111 6.10273 6.06494C7.30689 4.85878 8.77239 4.25569 10.4992 4.25569C12.2262 4.25569 13.693 4.85878 14.8995 6.06494C16.106 7.27111 16.7092 8.73777 16.7092 10.4649C16.7092 11.2299 16.5822 11.9414 16.3282 12.5994C16.0742 13.2576 15.7266 13.8614 15.2852 14.4107C15.1401 14.5932 14.9553 14.6876 14.731 14.6939C14.5066 14.7003 14.3131 14.622 14.1502 14.4592C13.9852 14.2942 13.9027 14.0954 13.9027 13.8627C13.9027 13.6302 13.9714 13.4226 14.1087 13.2399C14.4052 12.8566 14.6389 12.4316 14.8097 11.9649C14.9804 11.4983 15.0657 10.9983 15.0657 10.4649C15.0657 9.19427 14.6225 8.11561 13.736 7.22894C12.8496 6.34244 11.7712 5.89919 10.5007 5.89919C9.23023 5.89919 8.15156 6.34244 7.26473 7.22894C6.37773 8.11561 5.93423 9.19427 5.93423 10.4649C5.93423 10.9983 6.01956 11.4979 6.19023 11.9639C6.36106 12.4301 6.59473 12.8554 6.89123 13.2399C7.02856 13.4226 7.10139 13.627 7.10973 13.8532C7.11806 14.0795 7.04173 14.2732 6.88073 14.4342Z" fill="currentColor" />
              </svg>
              Browse All Episodes
            </a>
          </div>
        </div>
      </section>

      <FooterCTA />
      <Footer />
    </main>
  );
}
