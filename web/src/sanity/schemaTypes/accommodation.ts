import { defineType, defineField, defineArrayMember } from 'sanity'

export const accommodation = defineType({
  name: 'accommodation',
  title: 'Accommodation',
  type: 'document',
  fields: [
    defineField({ name: 'introEn', title: 'Intro (EN)', type: 'text' }),
    defineField({ name: 'introFr', title: 'Intro (FR)', type: 'text' }),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Location name', type: 'string' }),
            defineField({
              name: 'hotels',
              title: 'Hotels',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({ name: 'hotelName',      title: 'Hotel name',         type: 'string' }),
                    defineField({ name: 'url',            title: 'URL',               type: 'url' }),
                    defineField({ name: 'description',    title: 'Description (EN)',   type: 'text' }),
                    defineField({ name: 'descriptionFr',  title: 'Description (FR)',   type: 'text' }),
                  ],
                  preview: { select: { title: 'hotelName' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'name' } },
        }),
      ],
    }),
  ],
})
