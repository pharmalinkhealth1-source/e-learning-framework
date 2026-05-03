import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
        {
          name: 'externalUrl',
          type: 'url',
          title: 'External URL',
        }
      ]
    }),
    defineField({
      name: 'clerkId',
      title: 'Clerk ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
    }),
  ],
})
