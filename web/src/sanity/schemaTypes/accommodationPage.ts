import { defineType, defineField, defineArrayMember } from 'sanity'

export const accommodationPage = defineType({
  name: 'accommodationPage',
  title: 'Accommodation',
  type: 'document',
  fields: [
    defineField({ name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true } }),
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
                    defineField({ name: 'hotelName',     title: 'Hotel name',       type: 'string' }),
                    defineField({ name: 'url',           title: 'URL',              type: 'url' }),
                    defineField({ name: 'description',   title: 'Description (EN)', type: 'text' }),
                    defineField({ name: 'descriptionFr', title: 'Description (FR)', type: 'text' }),
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
