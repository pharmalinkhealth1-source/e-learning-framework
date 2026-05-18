'use client'

import { useEffect, useState } from 'react'
import styles from './LegalPage.module.css'

interface Heading {
  id: string
  text: string
  level: 'h2' | 'h3'
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <p className={styles.tocTitle}>Table of Contents</p>
      <ol className={styles.tocList}>
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            className={`${styles.tocItem} ${level === 'h3' ? styles['tocItem--h3'] : ''}`}
          >
            <a
              href={`#${id}`}
              className={`${styles.tocLink} ${activeId === id ? styles['tocLink--active'] : ''}`}
              onClick={(e) => {
                e.preventDefault()
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setActiveId(id)
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
