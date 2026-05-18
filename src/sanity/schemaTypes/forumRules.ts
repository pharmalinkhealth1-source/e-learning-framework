import { defineField, defineType } from 'sanity'

/**
 * Singleton document — _id must be 'forumRules'.
 * Admin: create this document once in Sanity Studio with the following 11 rules:
 *
 *  1. Welcome to PharmaLink
 *  2. The Non-Negotiable Rule
 *  3. Rule #1: Protect Patient Confidentiality
 *  4. Rule #2: Protect Facility & Organizational Information
 *  5. Rule #3: Be Accurate and Evidence-Based
 *  6. Rule #4: Respect Every Member
 *  7. Rule #5: Only Share Appropriate Images and Files
 *  8. Rule #6: Keep Content Professional and On-Topic
 *  9. Rule #7: Report Violations Promptly
 * 10. Rule #8: Understand the Consequences
 * 11. Your Legal Obligations & Moderation
 *
 * Set version to 'v1.0'. Bump version string to re-prompt all users.
 */
export const forumRules = defineType({
  name: 'forumRules',
  title: 'Forum Rules',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      description: 'Bump this string (e.g. v1.1) to re-prompt all users to accept rules.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    }),
    defineField({
      name: 'rules',
      title: 'Rules',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
          ],
        },
      ],
    }),
  ],
})
