import { defineType, defineField } from 'sanity'

export const credit = defineType({
  name: 'credit',
  title: 'Credit',
  type: 'document',
  fields: [
    defineField({ name: 'roleEn',     title: 'Role (EN)',    type: 'string' }),
    defineField({ name: 'roleFr',     title: 'Role (FR)',    type: 'string' }),
    defineField({ name: 'personName', title: 'Person name', type: 'string' }),
    defineField({ name: 'url',        title: 'URL',          type: 'url' }),
    defineField({ name: 'order',      title: 'Order',        type: 'number' }),
    defineField({ name: 'videoCredit', title: 'Show on home page (video credit)', type: 'boolean' }),
  ],
  preview: { select: { title: 'personName', subtitle: 'roleEn' } },
})
