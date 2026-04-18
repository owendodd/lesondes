import { defineType, defineField } from 'sanity'

export const ticketsPage = defineType({
  name: 'ticketsPage',
  title: 'Tickets',
  type: 'document',
  fields: [
    defineField({ name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true } }),
  ],
})
