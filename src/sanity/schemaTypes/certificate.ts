import { defineField, defineType } from 'sanity'

export const certificate = defineType({
  name: 'certificate',
  title: 'Certificate',
  type: 'document',
  fields: [
    defineField({ name: 'userId', title: 'User ID', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'courseId', title: 'Course ID', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'tier',
      title: 'Certificate Tier',
      type: 'string',
      options: {
        list: [
          { title: 'Participation', value: 'participation' },
          { title: 'Accomplishment', value: 'accomplishment' },
        ],
      },
    }),
    defineField({ name: 'score', title: 'Score', type: 'number' }),
    defineField({ name: 'issuedAt', title: 'Issued At', type: 'datetime' }),
    defineField({ name: 'expiresAt', title: 'Expires At', type: 'datetime' }),
    defineField({ name: 'blobUrl', title: 'Blob URL', type: 'string' }),
  ],
})
