import type { ReactNode } from 'react'
import Link from 'next/link'
import Navbar from '@/components/stripe/Navbar'
import Footer from '@/components/stripe/Footer'
import { client } from '@/sanity/lib/client'
import styles from './LegalHub.module.css'
import {
  Cookie,
  Eye,
  Scales,
  Person,
  Warning,
  Users,
  Copyright,
  CurrencyDollar,
  ArrowRight,
} from '@phosphor-icons/react/dist/ssr'

const ICON_MAP: Record<string, ReactNode> = {
  cookie: <Cookie size={24} weight="fill" />,
  eye: <Eye size={24} weight="fill" />,
  scales: <Scales size={24} weight="fill" />,
  person: <Person size={24} weight="fill" />,
  warning: <Warning size={24} weight="fill" />,
  users: <Users size={24} weight="fill" />,
  copyright: <Copyright size={24} weight="fill" />,
  currency: <CurrencyDollar size={24} weight="fill" />,
}

interface LegalPageDoc {
  _id: string
  title: string
  slug: { current: string }
  category?: string
  icon?: string
  summary?: string
}

export const metadata = {
  title: 'Legal & Support — PharmaLink',
  description:
    'Privacy policy, terms of service, cookie policy, accessibility statement, and other legal information for PharmaLink.',
}

export default async function LegalSupportHubPage() {
  const pages: LegalPageDoc[] = await client.fetch(
    `*[_type == "legalPage" && showOnHub == true] | order(order asc) { _id, title, slug, category, icon, summary }`,
    {},
    { next: { revalidate: 300 } },
  )

  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Legal &amp; Support</p>
          <h1 className={styles.title}>Policies &amp; Legal Information</h1>
          <p className={styles.description}>
            Everything you need to understand how PharmaLink handles your data,
            your rights, and the terms that govern our platform.
          </p>
        </div>

        <div className={styles.grid}>
          {pages.map((page) => {
            const icon = page.icon ? ICON_MAP[page.icon] : null
            return (
              <Link
                key={page._id}
                href={`/legal-support/${page.slug.current}`}
                className={styles.card}
              >
                {icon && <div className={styles.iconWrap}>{icon}</div>}
                <h2 className={styles.cardTitle}>{page.title}</h2>
                {page.summary && <p className={styles.cardSummary}>{page.summary}</p>}
                <span className={styles.cardCta}>
                  Read more <ArrowRight size={14} weight="bold" />
                </span>
              </Link>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}
