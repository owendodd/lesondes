import { defineType, defineField } from 'sanity'

export const runsheetState = defineType({
  name: 'runsheetState',
  title: 'Run Sheet State',
  type: 'document',
  fields: [
    defineField({ name: 'stateJson', title: 'State', type: 'text' }),
  ],
})
