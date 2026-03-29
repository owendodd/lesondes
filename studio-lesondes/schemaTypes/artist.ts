import { defineType, defineField } from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({ name: 'name',      title: 'Name',       type: 'string' }),
    defineField({ name: 'order',     title: 'Order',      type: 'number' }),
    defineField({ name: 'lineBreak', title: 'Line break in name (e.g. Mohammad Reza / Mortazavi)', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'name', subtitle: 'order' } },
})
