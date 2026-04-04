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
    defineField({ name: 'musicIntroEn', title: 'Music intro (EN)', type: 'text' }),
    defineField({ name: 'musicIntroFr', title: 'Music intro (FR)', type: 'text' }),
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'dayEn',    title: 'Day (EN)',    type: 'string' }),
            defineField({ name: 'dayFr',    title: 'Day (FR)',    type: 'string' }),
            defineField({ name: 'detailEn', title: 'Detail (EN)', type: 'string' }),
            defineField({ name: 'detailFr', title: 'Detail (FR)', type: 'string' }),
          ],
          preview: { select: { title: 'dayEn' } },
        }),
      ],
    }),

    // Dining & Bar
    defineField({ name: 'diningEn', title: 'Dining & Bar (EN)', type: 'text' }),
    defineField({ name: 'diningFr', title: 'Dining & Bar (FR)', type: 'text' }),

    // Accommodation note
    defineField({ name: 'accommodationNoteEn', title: 'Accommodation note (EN)', type: 'text' }),
    defineField({ name: 'accommodationNoteEr', title: 'Accommodation note (FR)', type: 'text' }),
  ],
})
