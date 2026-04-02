import { defineType, defineField } from 'sanity'

export const infoBottom = defineType({
  name: 'infoBottom',
  title: 'Info Bottom',
  type: 'document',
  fields: [
    defineField({ name: 'hotelName',          title: 'Hotel name (EN)',          type: 'string' }),
    defineField({ name: 'hotelNameFr',        title: 'Hotel name (FR)',          type: 'string' }),
    defineField({ name: 'foodCreditEn',       title: 'Food credit (EN)',        type: 'string' }),
    defineField({ name: 'foodCreditFr',       title: 'Food credit (FR)',        type: 'string' }),
    defineField({ name: 'wineCreditPrefixEn', title: 'Wine credit prefix (EN)', type: 'string' }),
    defineField({ name: 'wineCreditPrefixFr', title: 'Wine credit prefix (FR)', type: 'string' }),
    defineField({ name: 'winePerson',         title: 'Wine person',             type: 'string' }),
  ],
})
