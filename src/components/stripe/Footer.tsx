import { client } from '@/sanity/lib/client'
import FooterFull from './FooterFull'
import FooterCompact, { type SocialLink } from './FooterCompact'

interface SiteSettings {
  footerVariant?: 'compact' | 'full'
  footerTagline?: string
  socialLinks?: Array<{
    platform: string
    url: string
    enabled: boolean
  }>
}

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { platform: 'x',        url: 'https://x.com/PharmaLinkOrg',                                    enabled: true  },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/pharmalink-health-93092a386/',        enabled: true  },
  { platform: 'youtube',  url: 'https://www.youtube.com/@PharmaLinkHealth',                       enabled: true  },
  { platform: 'facebook', url: '',                                                                  enabled: false },
  { platform: 'instagram',url: '',                                                                  enabled: false },
]

export default async function Footer() {
  const settings: SiteSettings = await client.fetch(
    `*[_type == "siteSettings"][0]{ footerVariant, footerTagline, socialLinks }`,
    {},
    { next: { revalidate: 300 } }
  ) ?? {}

  if (settings.footerVariant === 'full') {
    return <FooterFull />
  }

  const socialLinks: SocialLink[] = settings.socialLinks
    ? settings.socialLinks.map(s => ({
        platform: s.platform,
        url: s.url,
        enabled: s.enabled,
      }))
    : DEFAULT_SOCIAL_LINKS

  return (
    <FooterCompact
      tagline={settings.footerTagline?.replace(/\\n/g, '\n') ?? 'Bridging Gaps with\nInnovative Care'}
      socialLinks={socialLinks}
    />
  )
}
