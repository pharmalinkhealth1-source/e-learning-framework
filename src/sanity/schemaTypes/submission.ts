import { defineField, defineType } from 'sanity'

export const submission = defineType({
  name: 'submission',
  title: 'Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'assignmentId',
      title: 'Assignment ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'studentId',
      title: 'Student ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'studentName',
      title: 'Student Name',
      type: 'string',
    }),
    defineField({
      name: 'courseId',
      title: 'Course ID',
      type: 'string',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
    }),
    defineField({
      name: 'textContent',
      title: 'Text Content',
      type: 'text',
    }),
    defineField({
      name: 'fileUrl',
      title: 'File URL',
      type: 'string',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Graded', value: 'graded' },
          { title: 'Returned', value: 'returned' },
        ],
      },
    }),
    defineField({
      name: 'grade',
      title: 'Grade',
      type: 'number',
    }),
    defineField({
      name: 'feedback',
      title: 'Feedback',
      type: 'text',
    }),
    defineField({
      name: 'gradedBy',
      title: 'Graded By (User ID)',
      type: 'string',
    }),
    defineField({
      name: 'gradedAt',
      title: 'Graded At',
      type: 'datetime',
    }),
  ],
})
