import { defineType, defineField } from 'sanity'

export const schedulePage = defineType({
  name: 'schedulePage',
  title: 'Schedule',
  type: 'document',
  fields: [
    defineField({ name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true } }),
  ],
})
