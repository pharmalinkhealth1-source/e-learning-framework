import { defineField, defineType } from 'sanity'

export const directoryItem = defineType({
  name: 'directoryItem',
  title: 'Directory Item',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Fintech', value: 'fintech' },
          { title: 'E-commerce', value: 'ecommerce' },
          { title: 'SaaS', value: 'saas' },
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'geopoint',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})
