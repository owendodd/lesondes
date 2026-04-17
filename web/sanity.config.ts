import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { siteConfig }       from './src/sanity/schemaTypes/siteConfig'
import { artist }           from './src/sanity/schemaTypes/artist'
import { infoLink }         from './src/sanity/schemaTypes/infoLink'
import { infoBottom }       from './src/sanity/schemaTypes/infoBottom'
import { credit }           from './src/sanity/schemaTypes/credit'
import { infoPage }         from './src/sanity/schemaTypes/infoPage'
import { accommodationPage } from './src/sanity/schemaTypes/accommodationPage'
import { ticketsPage }      from './src/sanity/schemaTypes/ticketsPage'
import { accessPage }       from './src/sanity/schemaTypes/accessPage'

export default defineConfig({
  name: 'default',
  title: 'lesondes',
  projectId: '0116525h',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Pages')
          .items([

            // ── HOME ──────────────────────────────────────────────
            S.listItem()
              .title('Home')
              .id('home-group')
              .child(
                S.list()
                  .title('Home')
                  .items([
                    S.listItem()
                      .title('Artists')
                      .id('artists')
                      .child(S.documentTypeList('artist').title('Artists')),
                    S.listItem()
                      .title('Home Settings')
                      .id('home-settings')
                      .child(
                        S.document()
                          .schemaType('infoBottom')
                          .documentId('infoBottom')
                      ),
                  ])
              ),

            // ── INFORMATION ───────────────────────────────────────
            S.listItem()
              .title('Information')
              .id('info-group')
              .child(
                S.document()
                  .schemaType('infoPage')
                  .documentId('b0e897fb-a27d-4a0d-ba12-5d3f9876026c')
              ),

            // ── ACCOMMODATION ─────────────────────────────────────
            S.listItem()
              .title('Accommodation')
              .id('accommodation-group')
              .child(
                S.document()
                  .schemaType('accommodationPage')
                  .documentId('accommodationPage')
              ),

            // ── TICKETS ───────────────────────────────────────────
            S.listItem()
              .title('Tickets')
              .id('tickets-group')
              .child(
                S.document()
                  .schemaType('ticketsPage')
                  .documentId('ticketsPage')
              ),

            // ── ACCESS ────────────────────────────────────────────
            S.listItem()
              .title('Access')
              .id('access-group')
              .child(
                S.document()
                  .schemaType('accessPage')
                  .documentId('accessPage')
              ),

            S.divider(),

            // ── SETTINGS ──────────────────────────────────────────
            S.listItem()
              .title('Settings')
              .id('settings-group')
              .child(
                S.document()
                  .schemaType('siteConfig')
                  .documentId('siteConfig')
              ),

          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: [
      siteConfig,
      artist,
      infoLink,
      infoBottom,
      credit,
      infoPage,
      accommodationPage,
      ticketsPage,
      accessPage,
    ],
  },
})
