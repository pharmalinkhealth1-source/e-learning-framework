import { defineField, defineType } from 'sanity'

/**
 * Singleton configuration document for the PBID survey. Controls the title,
 * intro/completion copy, and whether the survey is currently accepting
 * responses. Create exactly one instance of this in Sanity Studio.
 *
 * Studio note: `__experimental_actions` is used to disable creation/deletion
 * so only update/publish actions are available, enforcing the singleton.
 */
export const pbidSurveyConfig = defineType({
  name: 'pbidSurveyConfig',
  title: 'PBID Survey Config',
  type: 'document',
  // @ts-expect-error — __experimental_actions is not in the current TS defs but is honored by Studio.
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'PBID Digital Training Exit Interview',
    }),
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'text',
      description: 'Shown above the form on the survey page.',
    }),
    defineField({
      name: 'completionMessage',
      title: 'Completion Message',
      type: 'text',
      description: 'Shown after a successful submission.',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'When false, the survey page shows a closed message instead of the form.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'PBID Survey Config' }
    },
  },
})

export default pbidSurveyConfig
