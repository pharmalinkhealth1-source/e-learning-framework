import { defineField, defineType } from 'sanity'

export const surveyResponse = defineType({
  name: 'surveyResponse',
  title: 'Survey Response',
  type: 'document',
  fields: [
    defineField({ name: 'userId', title: 'User ID', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'courseId', title: 'Course ID', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'csatScore',
      title: 'CSAT Score',
      type: 'number',
      validation: Rule => Rule.min(1).max(5),
    }),
    defineField({
      name: 'npsScore',
      title: 'NPS Score',
      type: 'number',
      validation: Rule => Rule.min(0).max(10),
    }),
    defineField({ name: 'completedAt', title: 'Completed At', type: 'datetime' }),
    defineField({ name: 'gender', title: 'Gender', type: 'string' }),
    defineField({ name: 'ageGroup', title: 'Age Group', type: 'string' }),
    defineField({ name: 'healthWorkerType', title: 'Health Worker Type', type: 'string' }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
  ],
})
