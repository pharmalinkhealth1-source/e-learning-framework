import { defineField, defineType } from 'sanity'

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
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
      name: 'type',
      title: 'Lesson Type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'SCORM', value: 'scorm' },
          { title: 'Quiz', value: 'quiz' },
        ],
      },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: ({ document }) => document?.type !== 'text',
    }),
    defineField({
      name: 'scormPackage',
      title: 'SCORM Package',
      type: 'file',
      hidden: ({ document }) => document?.type !== 'scorm',
    }),
    defineField({
      name: 'scormEntryUrl',
      title: 'SCORM Entry URL',
      type: 'string',
      hidden: ({ document }) => document?.type !== 'scorm',
    }),
    defineField({
      name: 'scormVersion',
      title: 'SCORM Version',
      type: 'string',
      options: {
        list: [
          { title: 'SCORM 1.2', value: '1.2' },
          { title: 'SCORM 2004', value: '2004' },
        ],
      },
      hidden: ({ document }) => document?.type !== 'scorm',
    }),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [{ type: 'quiz' }],
      hidden: ({ document }) => document?.type !== 'quiz',
    }),
    defineField({
      name: 'quizRole',
      title: 'Quiz Role',
      type: 'string',
      options: {
        list: [
          { title: 'Pre-test', value: 'pre-test' },
          { title: 'Post-test', value: 'post-test' },
          { title: 'Self-assessment', value: 'self-assessment' },
        ],
      },
      hidden: ({ document }) => document?.type !== 'quiz',
    }),
  ],
})
