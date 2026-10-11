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
    defineField({ name: 'headerImage',     title: 'Header banner image (2027 site nav)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'navImage2027',    title: 'Nav photo — 2027 tab',    type: 'image', options: { hotspot: true } }),
    defineField({ name: 'navImage2026',    title: 'Nav photo — 2026 tab',    type: 'image', options: { hotspot: true } }),
    defineField({ name: 'navImageAbout',   title: 'Nav photo — About tab',   type: 'image', options: { hotspot: true } }),
    defineField({ name: 'navImageLang',    title: 'Nav photo — FR/EN tab',   type: 'image', options: { hotspot: true } }),
    defineField({ name: 'comingSoonImageBrand',   title: 'Home page photo — brand cell (top left)',    type: 'image', options: { hotspot: true } }),
    defineField({ name: 'comingSoonImageMessage', title: 'Home page photo — message cell (top right)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'comingSoonImageContact', title: 'Home page photo — contact cell (bottom left)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'comingSoonImageSignup',  title: 'Home page photo — signup cell (bottom right)', type: 'image', options: { hotspot: true } }),
  ],
})
