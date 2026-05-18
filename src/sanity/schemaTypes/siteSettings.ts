import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // @ts-expect-error — experimental singleton action list
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'footerVariant',
      title: 'Footer Style',
      type: 'string',
      options: {
        list: [
          { title: 'Compact (recommended)', value: 'compact' },
          { title: 'Full (multi-column)', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'compact',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
      description: 'Shown in the compact footer. Use \\n for a line break.',
      initialValue: 'Bridging Gaps with\\nInnovative Care',
      hidden: ({ document }) => document?.footerVariant !== 'compact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      description: 'Toggle each platform on/off. URL is preserved when disabled so it can be re-enabled later.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'X (Twitter)', value: 'x' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'YouTube', value: 'youtube' },
                ],
              },
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'enabled',
              title: 'Published',
              type: 'boolean',
              initialValue: true,
              description: 'Uncheck to hide from footer without losing the URL.',
            }),
          ],
          preview: {
            select: { platform: 'platform', url: 'url', enabled: 'enabled' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare(value: Record<string, any>) {
              const labels: Record<string, string> = {
                facebook: 'Facebook',
                instagram: 'Instagram',
                x: 'X (Twitter)',
                linkedin: 'LinkedIn',
                youtube: 'YouTube',
              }
              const p = String(value.platform ?? '')
              return {
                title: `${labels[p] ?? p} ${value.enabled ? '✓' : '(hidden)'}`,
                subtitle: String(value.url ?? ''),
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
