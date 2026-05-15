import { defineField, defineType } from 'sanity'

export const conversation = defineType({
  name: 'conversation',
  title: 'Conversation',
  type: 'document',
  fields: [
    defineField({
      name: 'participantIds',
      title: 'Participant IDs',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
    defineField({
      name: 'lastMessageAt',
      title: 'Last Message At',
      type: 'datetime',
    }),
    defineField({
      name: 'lastMessagePreview',
      title: 'Last Message Preview',
      type: 'string',
    }),
    defineField({
      name: 'participantUnread',
      title: 'Participant Unread Counts',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'userId', type: 'string', title: 'User ID' }),
          defineField({ name: 'count', type: 'number', title: 'Unread Count', initialValue: 0 }),
        ],
      }],
    }),
  ],
})
