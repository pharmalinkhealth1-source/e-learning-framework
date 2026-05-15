import { defineField, defineType } from 'sanity'

export const directMessage = defineType({
  name: 'directMessage',
  title: 'Direct Message',
  type: 'document',
  fields: [
    defineField({
      name: 'conversationId',
      title: 'Conversation ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'senderId',
      title: 'Sender ID (Clerk userId)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'senderName',
      title: 'Sender Name',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
    defineField({
      name: 'readBy',
      title: 'Read By',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})
