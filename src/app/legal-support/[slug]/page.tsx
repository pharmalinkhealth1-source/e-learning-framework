import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import slugify from 'slugify'
import Navbar from '@/components/stripe/Navbar'
import Footer from '@/components/stripe/Footer'
import TableOfContents from './TableOfContents'
import styles from './LegalPage.module.css'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

interface LegalPageDoc {
  title: string
  slug: { current: string }
  category?: string
  summary?: string
  effectiveDate?: string
  lastUpdated?: string
  body?: PortableTextBlock[]
}

interface BlockChild {
  text?: string
}

function getBlockText(block: PortableTextBlock): string {
  const children = (block as PortableTextBlock & { children?: BlockChild[] }).children
  return children?.map((c) => c.text ?? '').join('') ?? ''
}

function toHeadingId(block: PortableTextBlock): string {
  return slugify(getBlockText(block), { lower: true, strict: true })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  policy: 'Policy',
  terms: 'Terms',
  guidelines: 'Guidelines',
  accessibility: 'Accessibility',
  disclaimer: 'Disclaimer',
}

export async function generateStaticParams() {
  const pages = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "legalPage"]{ slug }`,
  )
  return pages.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await client.fetch<Pick<LegalPageDoc, 'title' | 'summary'> | null>(
    `*[_type == "legalPage" && slug.current == $slug][0]{ title, summary }`,
    { slug },
  )
  if (!page) return {}
  return { title: `${page.title} — PharmaLink`, description: page.summary }
}

export default async function LegalPageDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await client.fetch<LegalPageDoc | null>(
    `*[_type == "legalPage" && slug.current == $slug][0]`,
    { slug },
    { next: { revalidate: 300 } },
  )

  if (!page) notFound()

  const headings = (page.body ?? [])
    .filter((b) => {
      if (b._type !== 'block') return false
      const style = (b as PortableTextBlock & { style?: string }).style
      return style === 'h2' || style === 'h3'
    })
    .map((b) => {
      const style = (b as PortableTextBlock & { style: string }).style
      return {
        id: toHeadingId(b),
        text: getBlockText(b),
        level: style as 'h2' | 'h3',
      }
    })

  const components: PortableTextComponents = {
    block: {
      h2: ({ children, value }: { children?: ReactNode; value: PortableTextBlock }) => (
        <h2 id={toHeadingId(value)}>{children}</h2>
      ),
      h3: ({ children, value }: { children?: ReactNode; value: PortableTextBlock }) => (
        <h3 id={toHeadingId(value)}>{children}</h3>
      ),
    },
  }

  const category = page.category
    ? CATEGORY_LABELS[page.category] ?? page.category
    : null

  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <Link href="/legal-support" className={styles.backLink}>
              <ArrowLeft size={14} weight="bold" /> Legal &amp; Support
            </Link>
            {category && <p className={styles.eyebrow}>{category}</p>}
            <h1 className={styles.title}>{page.title}</h1>
            <div className={styles.meta}>
              {page.effectiveDate && (
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>Effective: </span>
                  {formatDate(page.effectiveDate)}
                </span>
              )}
              {page.lastUpdated && (
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>Last updated: </span>
                  {formatDate(page.lastUpdated)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <TableOfContents headings={headings} />
          <div className={styles.prose}>
            {page.body && <PortableText value={page.body} components={components} />}
            <p className={styles.footerNote}>
              Questions? Contact us at{' '}
              <a href="mailto:info@pharmalinkhealth.com">info@pharmalinkhealth.com</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
