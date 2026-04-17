import { defineType, defineField, defineArrayMember } from 'sanity'

export const accessPage = defineType({
  name: 'accessPage',
  title: 'Access',
  type: 'document',
  fields: [
    defineField({ name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'titleEn', title: 'Title (EN)', type: 'string' }),
            defineField({ name: 'titleFr', title: 'Title (FR)', type: 'string' }),
            defineField({ name: 'bodyEn',  title: 'Body (EN)',  type: 'text' }),
            defineField({ name: 'bodyFr',  title: 'Body (FR)',  type: 'text' }),
          ],
          preview: { select: { title: 'titleEn' } },
        }),
      ],
    }),
  ],
})
