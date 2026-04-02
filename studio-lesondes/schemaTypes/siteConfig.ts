import { defineType, defineField } from 'sanity'

export const siteConfig = defineType({
  name: 'siteConfig',
  title: 'Site Config',
  type: 'document',
  fields: [
    defineField({ name: 'title',           title: 'Title',                type: 'string', initialValue: 'LES ONDES' }),
    defineField({ name: 'location',        title: 'Location',             type: 'string', initialValue: 'Cerbère' }),
    defineField({ name: 'locationUrl',     title: 'Location URL',         type: 'url' }),
    defineField({ name: 'datesEn',         title: 'Dates (EN)',           type: 'string', initialValue: 'May 29 30 31' }),
    defineField({ name: 'datesFr',         title: 'Dates (FR)',           type: 'string', initialValue: '29 30 31 Mai' }),
    defineField({ name: 'contactEmail',    title: 'Contact Email',        type: 'string', initialValue: 'poste@les-ondes.fr' }),
    defineField({ name: 'ticketUrl',       title: 'Ticket URL',           type: 'url' }),
    defineField({ name: 'brevoFormAction', title: 'Brevo Form Action URL', type: 'url' }),
  ],
})
