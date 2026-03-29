import { defineType, defineField } from 'sanity'

export const infoLink = defineType({
  name: 'infoLink',
  title: 'Info Link',
  type: 'document',
  fields: [
    defineField({ name: 'labelEn', title: 'Label (EN)', type: 'string' }),
    defineField({ name: 'labelFr', title: 'Label (FR)', type: 'string' }),
    defineField({ name: 'url',     title: 'URL',        type: 'url' }),
    defineField({ name: 'order',   title: 'Order',      type: 'number' }),
  ],
  preview: { select: { title: 'labelEn' } },
})
