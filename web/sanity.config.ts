import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { siteConfig } from './src/sanity/schemaTypes/siteConfig'
import { artist } from './src/sanity/schemaTypes/artist'
import { infoLink } from './src/sanity/schemaTypes/infoLink'
import { infoBottom } from './src/sanity/schemaTypes/infoBottom'
import { credit } from './src/sanity/schemaTypes/credit'
import { accommodation } from './src/sanity/schemaTypes/accommodation'
import { infoPage } from './src/sanity/schemaTypes/infoPage'

export default defineConfig({
  name: 'default',
  title: 'lesondes',
  projectId: '0116525h',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [siteConfig, artist, infoLink, infoBottom, credit, accommodation, infoPage],
  },
})
