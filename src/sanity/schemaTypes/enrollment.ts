import { defineField, defineType } from 'sanity'

export const enrollment = defineType({
  name: 'enrollment',
  title: 'Enrollment',
  type: 'document',
  fields: [
    defineField({ name: 'userId', title: 'User ID', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'courseId', title: 'Course ID', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'enrolledAt', title: 'Enrolled At', type: 'datetime' }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({
      name: 'source',
      title: 'Enrollment Source',
      type: 'string',
      options: {
        list: [
          { title: 'Auto', value: 'auto' },
          { title: 'Manual', value: 'manual' },
        ],
      },
    }),
  ],
})
