import { defineField, defineType } from 'sanity'

export const assignment = defineType({
  name: 'assignment',
  title: 'Assignment',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'courseId',
      title: 'Course ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dueDate',
      title: 'Due Date',
      type: 'datetime',
    }),
    defineField({
      name: 'submissionType',
      title: 'Submission Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'File', value: 'file' },
          { title: 'Text', value: 'text' },
          { title: 'URL', value: 'url' },
        ],
      },
    }),
    defineField({
      name: 'maxScore',
      title: 'Max Score',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'createdBy',
      title: 'Created By (User ID)',
      type: 'string',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
  ],
})
