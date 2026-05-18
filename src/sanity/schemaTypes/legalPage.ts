import { defineField, defineType } from 'sanity'

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Policy', value: 'policy' },
          { title: 'Terms', value: 'terms' },
          { title: 'Guidelines', value: 'guidelines' },
          { title: 'Accessibility', value: 'accessibility' },
          { title: 'Disclaimer', value: 'disclaimer' },
        ],
      },
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Phosphor icon component name e.g. CookieFill',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'Short description for hub page cards (1-2 sentences)',
    }),
    defineField({ name: 'effectiveDate', title: 'Effective Date', type: 'date' }),
    defineField({ name: 'lastUpdated', title: 'Last Updated', type: 'date' }),
    defineField({
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower = appears first on hub',
    }),
    defineField({
      name: 'showOnHub',
      title: 'Show on Hub Page',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug' },
    prepare(selection: Record<string, unknown>) {
      const title = (selection.title as string) ?? ''
      const slug = selection.slug as { current?: string } | undefined
      return { title, subtitle: `/legal-support/${slug?.current ?? ''}` }
    },
  },
})
