import { defineField, defineType } from 'sanity'

export const forumPost = defineType({
  name: 'forumPost',
  title: 'Forum Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      initialValue: 'general',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Clinical', value: 'clinical' },
          { title: 'Regulatory', value: 'regulatory' },
          { title: 'Supply Chain', value: 'supply_chain' },
          { title: 'Technology', value: 'technology' },
          { title: 'Careers', value: 'careers' },
        ],
      },
    }),
    defineField({
      name: 'likedBy',
      title: 'Liked By',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})
