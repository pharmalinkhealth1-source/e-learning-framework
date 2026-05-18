import { defineField, defineType } from 'sanity'

/**
 * Stores a single submission of the Takeda PBID Digital Training Exit Interview.
 * The full set of answers is serialized to JSON in the `responses` field so the
 * schema can evolve without breaking historical records. Use the CSV export
 * route (`/api/surveys/pbid/export`) to flatten responses for analysis.
 */
export const pbidSurveyResponse = defineType({
  name: 'pbidSurveyResponse',
  title: 'PBID Survey Response',
  type: 'document',
  fields: [
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      description: 'Random ID generated server-side for deduplication.',
    }),
    defineField({
      name: 'responses',
      title: 'Responses (JSON)',
      type: 'text',
      description: 'Full JSON string of every answer keyed by question id.',
    }),
    defineField({
      name: 'surveyVersion',
      title: 'Survey Version',
      type: 'string',
      initialValue: '1.0',
    }),
  ],
  preview: {
    select: { submittedAt: 'submittedAt', sessionId: 'sessionId' },
    prepare({ submittedAt, sessionId }) {
      const formatted = submittedAt
        ? new Date(submittedAt as string).toLocaleString()
        : 'Unsubmitted'
      return {
        title: `Response – ${formatted}`,
        subtitle: (sessionId as string) || '',
      }
    },
  },
})

export default pbidSurveyResponse
