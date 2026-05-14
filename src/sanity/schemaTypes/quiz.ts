import { defineField, defineType } from 'sanity'

export const quiz = defineType({
  name: 'quiz',
  type: 'object',
  title: 'Quiz Question',
  fields: [
    defineField({
      name: 'questionText',
      type: 'string',
      title: 'Question',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'options',
      type: 'array',
      title: 'Options',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'correctIndex',
      type: 'number',
      title: 'Correct Answer Index',
    }),
  ],
})
