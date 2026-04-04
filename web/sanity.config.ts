import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { siteConfig } from './src/sanity/schemaTypes/siteConfig'
import { artist } from './src/sanity/schemaTypes/artist'
import { infoLink } from './src/sanity/schemaTypes/infoLink'
import { infoBottom } from './src/sanity/schemaTypes/infoBottom'
import { credit } from './src/sanity/schemaTypes/credit'
import { infoPage } from './src/sanity/schemaTypes/infoPage'

const singletons = new Set(['siteConfig', 'infoBottom', 'infoPage'])

// Maps type names to their actual document IDs (some were auto-generated rather than using the type name)
const singletonDocIds: Record<string, string> = {
  infoPage: 'b0e897fb-a27d-4a0d-ba12-5d3f9876026c',
}

export default defineConfig({
  name: 'default',
  title: 'lesondes',
  projectId: '0116525h',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            ...S.documentTypeListItems().filter(
              (item) => !singletons.has(item.getId() ?? '')
            ),
            S.divider(),
            ...Array.from(singletons).map((typeName) =>
              S.listItem()
                .title(S.documentTypeList(typeName).getTitle() ?? typeName)
                .id(typeName)
                .child(
                  S.document()
                    .schemaType(typeName)
                    .documentId(singletonDocIds[typeName] ?? typeName)
                )
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: [siteConfig, artist, infoLink, infoBottom, credit, infoPage],
  },
})
