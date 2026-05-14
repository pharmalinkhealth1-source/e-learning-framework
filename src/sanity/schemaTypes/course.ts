import { defineField, defineType } from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'courseModule' }] }],
    }),
    defineField({
      name: 'passingScore',
      title: 'Passing Score (%)',
      type: 'number',
      validation: Rule => Rule.min(0).max(100),
    }),
    defineField({
      name: 'country',
      title: 'Available Countries',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'ISO country codes. Use "global" to make available everywhere.',
    }),
  ],
})
