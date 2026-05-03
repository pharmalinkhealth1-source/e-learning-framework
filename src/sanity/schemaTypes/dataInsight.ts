import { defineField, defineType } from 'sanity'

export const dataInsight = defineType({
  name: 'dataInsight',
  title: 'Data Insight',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'metric',
      title: 'Primary Metric',
      type: 'string',
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'number',
    }),
    defineField({
      name: 'change',
      title: 'Percentage Change',
      type: 'number',
    }),
    defineField({
      name: 'rawData',
      title: 'Raw Data (JSON)',
      type: 'text',
      description: 'Used for complex D3.js visualizations',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
  ],
})
