import { client } from '@/sanity/lib/client'
import FooterFull from './FooterFull'
import FooterCompact from './FooterCompact'

interface SiteSettings {
  footerVariant?: 'compact' | 'full'
  footerTagline?: string
}

export default async function Footer() {
  const settings: SiteSettings = await client.fetch(
    `*[_type == "siteSettings"][0]{ footerVariant, footerTagline }`,
    {},
    { next: { revalidate: 300 } }
  ) ?? {}

  if (settings.footerVariant === 'full') {
    return <FooterFull />
  }

  return (
    <FooterCompact
      tagline={settings.footerTagline?.replace(/\\n/g, '\n') ?? 'Bridging Gaps with\nInnovative Care'}
    />
  )
}
