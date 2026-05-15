import { defineField, defineType } from 'sanity'

export const notification = defineType({
  name: 'notification',
  title: 'Notification',
  type: 'document',
  fields: [
    defineField({ name: 'userId', title: 'User ID', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'type',
      title: 'Notification Type',
      type: 'string',
      options: {
        list: [
          { title: 'Enrollment', value: 'enrollment' },
          { title: 'Completion', value: 'completion' },
          { title: 'Certificate Ready', value: 'certificate_ready' },
          { title: 'Certificate Expiring', value: 'certificate_expiring' },
          { title: 'Inactivity', value: 'inactivity' },
          { title: 'Assignment Submitted', value: 'assignment_submitted' },
          { title: 'New Message', value: 'new_message' },
        ],
      },
    }),
    defineField({ name: 'read', title: 'Read', type: 'boolean', initialValue: false }),
    defineField({ name: 'message', title: 'Message', type: 'string' }),
    defineField({ name: 'courseId', title: 'Course ID', type: 'string' }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime' }),
  ],
})
