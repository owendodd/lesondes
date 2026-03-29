import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { siteConfig } from '../studio-lesondes/schemaTypes/siteConfig'
import { artist } from '../studio-lesondes/schemaTypes/artist'
import { infoLink } from '../studio-lesondes/schemaTypes/infoLink'
import { infoBottom } from '../studio-lesondes/schemaTypes/infoBottom'
import { credit } from '../studio-lesondes/schemaTypes/credit'
import { accommodation } from '../studio-lesondes/schemaTypes/accommodation'

export default defineConfig({
  name: 'default',
  title: 'lesondes',
  projectId: '0116525h',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [siteConfig, artist, infoLink, infoBottom, credit, accommodation],
  },
})
