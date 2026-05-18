'use client'

import React from 'react'
import Link from 'next/link'
import styles from './FooterCompact.module.css'
import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
  XLogo,
} from '@phosphor-icons/react'

const NAV_LINKS = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Community', href: '/community' },
  { label: 'E-learning', href: '/elearning' },
  { label: 'Data Insights', href: '/data-insights' },
  { label: 'Podcast', href: '/podcast' },
  { label: 'Contact Us', href: '/contact-us' },
]

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', Icon: FacebookLogo },
  { label: 'Instagram', href: '#', Icon: InstagramLogo },
  { label: 'X', href: 'https://x.com/PharmaLinkOrg', Icon: XLogo },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pharmalink-health-93092a386/', Icon: LinkedinLogo },
  { label: 'YouTube', href: 'https://www.youtube.com/@PharmaLinkHealth', Icon: YoutubeLogo },
]

interface Props {
  tagline?: string
}

const FooterCompact = ({ tagline = 'Bridging Gaps with\nInnovative Care' }: Props) => {
  const lines = tagline.split('\n')

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <p className={styles.tagline}>
            {lines.map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>

          {/* White-on-dark logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 240.07 170.04"
            className={styles.logoMark}
            aria-label="PharmaLink"
          >
            <style>{`
              .cfw-a{fill:#ffffff}
              .cfw-b{fill:#bbb}
              .cfw-c{fill:#d5d5d5}
              .cfw-d{fill:#ebebeb}
              .cfw-e{fill:#888}
            `}</style>
            <g className="cfw-a">
              <path d="M86.07 128.69V98.68h14.19c5.59 0 9.12 3.91 9.12 9.59s-3.53 9.59-9.12 9.59h-7.65v10.84h-6.54Zm6.54-16.51h6.88c1.94 0 3.14-1.03 3.14-2.97v-1.89c0-1.93-1.2-2.97-3.14-2.97h-6.88v7.83Z" />
              <path d="M113.94 96.87h6.36v13.07h.26c.82-2.36 2.71-4.34 6.28-4.34 4.6 0 7.05 3.27 7.05 8.94v14.15h-6.36v-13.63c0-2.88-.82-4.3-3.14-4.3-2.06 0-4.08 1.08-4.08 3.31v14.62h-6.36V96.87Z" />
              <path d="M156.25 128.69c-2.28 0-3.91-1.55-4.3-3.96h-.26c-.69 2.92-3.18 4.47-6.62 4.47-4.51 0-7.01-2.67-7.01-6.58 0-4.77 3.7-7.05 9.67-7.05h3.57v-1.42c0-2.19-1.08-3.57-3.74-3.57s-3.87 1.29-4.86 2.67l-3.78-3.35c1.81-2.67 4.39-4.3 9.12-4.3 6.36 0 9.63 2.92 9.63 8.26v9.89h2.11v4.95h-3.53Zm-4.94-6.83v-2.67h-3.1c-2.45 0-3.74.9-3.74 2.54v.64c0 1.63 1.08 2.41 2.97 2.41 2.11 0 3.87-.86 3.87-2.92Z" />
              <path d="M164.04 128.69v-22.57h6.36v4.9h.21c.52-2.49 2.24-4.9 5.76-4.9h1.12v5.93h-1.59c-3.7 0-5.5.82-5.5 3.44v13.2h-6.36Z" />
              <path d="M181.41 128.69v-22.57h6.36v3.83h.26c.82-2.41 2.71-4.34 6.06-4.34 3.1 0 5.33 1.59 6.32 4.56h.13c.82-2.54 3.44-4.56 6.88-4.56 4.34 0 6.75 3.27 6.75 8.94v14.15h-6.36v-13.63c0-2.92-.99-4.3-3.1-4.3-1.89 0-3.74 1.08-3.74 3.31v14.62h-6.36v-13.63c0-2.92-1.03-4.3-3.1-4.3-1.85 0-3.74 1.08-3.74 3.31v14.62h-6.36Z" />
              <path d="M236.54 128.69c-2.28 0-3.91-1.55-4.3-3.96h-.26c-.69 2.92-3.18 4.47-6.62 4.47-4.51 0-7.01-2.67-7.01-6.58 0-4.77 3.7-7.05 9.67-7.05h3.57v-1.42c0-2.19-1.08-3.57-3.74-3.57s-3.87 1.29-4.86 2.67l-3.78-3.35c1.81-2.67 4.39-4.3 9.12-4.3 6.36 0 9.63 2.92 9.63 8.26v9.89h2.11v4.95h-3.53Zm-4.95-6.83v-2.67h-3.1c-2.45 0-3.74.9-3.74 2.54v.64c0 1.63 1.08 2.41 2.97 2.41 2.11 0 3.87-.86 3.87-2.92Z" />
              <path d="M86.07 170.03v-30.01h6.54v24.21h11.44v5.8H86.07Z" />
              <path d="M108 141.91v-.95c0-1.81 1.12-3.14 3.7-3.14s3.7 1.33 3.7 3.14v.95c0 1.81-1.12 3.14-3.7 3.14s-3.7-1.33-3.7-3.14Zm.52 5.55h6.36v22.57h-6.36v-22.57Z" />
              <path d="M120.82 170.03v-22.57h6.36v3.83h.26c.82-2.36 2.71-4.34 6.28-4.34 4.6 0 7.05 3.27 7.05 8.94v14.15h-6.36v-13.63c0-2.88-.82-4.3-3.14-4.3-2.06 0-4.08 1.08-4.08 3.31v14.62h-6.37Z" />
              <path d="M146.45 138.21h6.36v18.79h.26l2.79-4.17 4.51-5.38h7.05l-7.52 8.64 8.38 13.93h-7.57l-5.07-9.55-2.84 3.18v6.36h-6.36v-31.82Z" />
            </g>
            <path className="cfw-b" d="M75.79 81.67a4.49 4.49 0 0 1-4.49 4.49H25.64v25.66H71.3c16.62 0 30.14-13.52 30.14-30.14V10.35H75.78v71.32Z" />
            <rect className="cfw-e" x="75.81" width="25.64" height="25.64" />
            <rect className="cfw-d" y="86.17" width="25.64" height="25.64" />
            <path className="cfw-d" d="M111.13 67.23V41.59H65.47c-16.62 0-30.14 13.52-30.14 30.14v71.32h25.66V71.73a4.49 4.49 0 0 1 4.49-4.49h45.65Z" />
            <path className="cfw-e" d="M111.13 41.59h18.8a6.84 6.84 0 0 1 6.84 6.84v11.96a6.84 6.84 0 0 1-6.84 6.84h-18.8V41.59Z" />
            <rect className="cfw-c" x="35.34" y="143.05" width="25.64" height="25.64" />
            <rect className="cfw-b" x="33.31" y="86.5" width="34.81" height="25.25" />
          </svg>
        </div>

        <nav className={styles.navRow}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} className={styles.navLink}>
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} PharmaLink. All Rights Reserved.
          </p>
          <div className={styles.socialLinks}>
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a key={label} href={href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <Icon size={18} weight="bold" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterCompact
