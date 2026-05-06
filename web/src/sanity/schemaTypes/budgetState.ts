import { defineType, defineField } from 'sanity'

export const budgetState = defineType({
  name: 'budgetState',
  title: 'Budget',
  type: 'document',
  fields: [
    defineField({ name: 'stateJson', title: 'State', type: 'text' }),
  ],
})
