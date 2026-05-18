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
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
