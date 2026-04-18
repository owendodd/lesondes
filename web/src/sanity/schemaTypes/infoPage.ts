import { defineType, defineField, defineArrayMember } from 'sanity'

const richText = [
  defineArrayMember({
    type: 'block',
    marks: {
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [defineField({ name: 'href', type: 'url', title: 'URL' })],
        },
      ],
    },
  }),
]

export const infoPage = defineType({
  name: 'infoPage',
  title: 'Info Page',
  type: 'document',
  fields: [
    defineField({ name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true } }),

    defineField({ name: 'overviewEn', title: 'Overview (EN)', type: 'array', of: richText }),
    defineField({ name: 'overviewFr', title: 'Overview (FR)', type: 'array', of: richText }),

    defineField({ name: 'musicIntroEn',  title: 'Music (EN)',        type: 'text' }),
    defineField({ name: 'musicIntroFr',  title: 'Music (FR)',        type: 'text' }),
    defineField({ name: 'spotifyUrl',    title: 'Spotify URL',       type: 'url'  }),
    defineField({ name: 'appleMusicUrl', title: 'Apple Music URL',   type: 'url'  }),

    defineField({ name: 'diningEn', title: 'Dining & Bar (EN)', type: 'text' }),
    defineField({ name: 'diningFr', title: 'Dining & Bar (FR)', type: 'text' }),
  ],
})
