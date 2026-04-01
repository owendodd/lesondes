import { defineType, defineField } from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({ name: 'firstName', title: 'First Name', type: 'string' }),
    defineField({ name: 'lastName',  title: 'Last Name',  type: 'string' }),
    defineField({ name: 'lineBreak', title: 'Line break between first and last name', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'lastName', subtitle: 'firstName' } },
})
