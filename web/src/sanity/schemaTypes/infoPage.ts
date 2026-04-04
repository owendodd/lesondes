import { defineType, defineField, defineArrayMember } from 'sanity'

export const infoPage = defineType({
  name: 'infoPage',
  title: 'Info Page',
  type: 'document',
  fields: [
    // Overview
    defineField({ name: 'overviewEn', title: 'Overview (EN)', type: 'text' }),
    defineField({ name: 'overviewFr', title: 'Overview (FR)', type: 'text' }),

    // Music
    defineField({ name: 'musicIntroEn', title: 'Music (EN)', type: 'text' }),
    defineField({ name: 'musicIntroFr', title: 'Music (FR)', type: 'text' }),

    // Dining & Bar
    defineField({ name: 'diningEn', title: 'Dining & Bar (EN)', type: 'text' }),
    defineField({ name: 'diningFr', title: 'Dining & Bar (FR)', type: 'text' }),

    // Accommodation intro
    defineField({ name: 'accommodationIntroEn', title: 'Accommodation intro (EN)', type: 'text' }),
    defineField({ name: 'accommodationIntroFr', title: 'Accommodation intro (FR)', type: 'text' }),

    // Locations
    defineField({
      name: 'locations',
      title: 'Accommodation locations',
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
