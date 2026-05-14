import { defineField, defineType } from 'sanity'

export const lessonProgress = defineType({
  name: 'lessonProgress',
  title: 'Lesson Progress',
  type: 'document',
  fields: [
    defineField({ name: 'userId', title: 'User ID', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'lessonId', title: 'Lesson ID', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'lessonShortId', title: 'Lesson Short ID', type: 'string' }),
    defineField({ name: 'courseId', title: 'Course ID', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'completed', title: 'Completed', type: 'boolean' }),
    defineField({ name: 'preTestScore', title: 'Pre-test Score', type: 'number' }),
    defineField({ name: 'postTestScore', title: 'Post-test Score', type: 'number' }),
    defineField({ name: 'scormData', title: 'SCORM Data', type: 'text' }),
    defineField({ name: 'timeSpent', title: 'Time Spent (seconds)', type: 'number' }),
    defineField({ name: 'completedAt', title: 'Completed At', type: 'datetime' }),
    defineField({ name: 'gender', title: 'Gender', type: 'string' }),
    defineField({ name: 'ageGroup', title: 'Age Group', type: 'string' }),
    defineField({ name: 'healthWorkerType', title: 'Health Worker Type', type: 'string' }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
  ],
})
