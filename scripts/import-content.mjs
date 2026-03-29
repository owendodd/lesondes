import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '0116525h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const docs = [
  // ── Site Config ──────────────────────────────────────────────
  {
    _id: 'siteConfig',
    _type: 'siteConfig',
    title: 'LES ONDES',
    location: 'Cerbère',
    datesEn: 'May 29 30 31',
    datesFr: '29 30 31 Mai',
    contactEmail: 'poste@les-ondes.fr',
    ticketUrl: '#',
    brevoFormAction: 'https://abd5fd25.sibforms.com/serve/MUIFAG8i_gtTVlsPfTO3iFE1Lb00fwt8g9jB8hRS9qx2f9-eH08PvA7aD6JDewUtEGiI0u-ljxed7KLYrRgegt8nb536wy8Cusouw4hEMDcp91HuUtQ4N5l870UhwLJhrp9CzoYoBLgqdL1hhhFBujcqxsVEaamfkd0GMmBtjLeB03GTKTrbErK6p8CHoKUe7PTyj96ex-VftRbYTg==',
  },

  // ── Artists ──────────────────────────────────────────────────
  ...([
    { name: 'Miriam Adefris' },
    { name: 'Pierre Bastien' },
    { name: 'Lukas de Clerck' },
    { name: 'Maya Dhondt' },
    { name: 'Mats Erlandsson' },
    { name: 'Elisabeth Klinck' },
    { name: 'Louis Laurain' },
    { name: 'Lubomyr Melnyk' },
    { name: 'Chantal Michelle' },
    { name: 'Mohammad Reza Mortazavi', lineBreak: true },
    { name: 'Fredrik Rasten' },
    { name: 'Youmna Saba' },
  ].map((a, i) => ({
    _id: `artist-${i + 1}`,
    _type: 'artist',
    name: a.name,
    order: i + 1,
    lineBreak: a.lineBreak ?? false,
  }))),

  // ── Info Links ───────────────────────────────────────────────
  {
    _id: 'infoLink-1',
    _type: 'infoLink',
    labelEn: 'Buy tickets',
    labelFr: 'Acheter des billets',
    url: '#',
    order: 1,
  },
  {
    _id: 'infoLink-2',
    _type: 'infoLink',
    labelEn: 'Accommodation',
    labelFr: 'Hébergement',
    url: '/accommodation',
    order: 2,
  },

  // ── Info Bottom ──────────────────────────────────────────────
  {
    _id: 'infoBottom',
    _type: 'infoBottom',
    hotelName: "L'Hôtel le Belvédère du Rayon Vert",
    foodCreditEn: 'Food from Harry Lester (Comptoir Central des Bazars)',
    foodCreditFr: 'Restauration par Harry Lester (Comptoir Central des Bazars)',
    wineCreditPrefixEn: 'Wine selections by',
    wineCreditPrefixFr: 'Vins sélectionnés par',
    winePerson: 'Clara Blum',
  },

  // ── Credits ──────────────────────────────────────────────────
  ...([
    { roleEn: 'Creative direction by ', roleFr: 'Direction artistique par ', personName: 'Ashley Helvey', url: 'https://www.instagram.com/ashleyhelvey/' },
    { roleEn: 'Video by ',              roleFr: 'Vidéo par ',                personName: 'Sam Youkilis',  url: 'https://www.instagram.com/samyoukilis/' },
    { roleEn: 'Design and dev by ',     roleFr: 'Design et dev par ',        personName: 'Owen Dodd',     url: 'https://www.owendodd.com/' },
    { roleEn: 'Co-produced by ',        roleFr: 'Co-produit par ',           personName: 'La Bleue',      url: 'https://www.la-bleue.fr/' },
  ].map((c, i) => ({
    _id: `credit-${i + 1}`,
    _type: 'credit',
    ...c,
    order: i + 1,
  }))),

  // ── Accommodation ────────────────────────────────────────────
  {
    _id: 'accommodation',
    _type: 'accommodation',
    introEn: "Cerbère and its neighbouring towns, Portbou and Banyuls-sur-mer, offer nearby and affordable accommodation for the duration of Les Ondes. Travel is served by regional TER train or by foot. Taxis services are available for evening return journeys to Banyuls-sur-mer and Portbou.",
    introFr: "Cerbère et ses villes voisines, Portbou et Banyuls-sur-mer, offrent des hébergements proches et abordables pour la durée des Ondes. Les déplacements sont assurés par train TER régional ou à pied. Des services de taxi sont disponibles pour les retours en soirée vers Banyuls-sur-mer et Portbou.",
    locations: [
      {
        _key: 'cerbere',
        name: 'Cerbère',
        hotels: [
          { _key: 'lavigie',   hotelName: 'Hotel La Vigie',    url: '#', description: 'A local coastal lodging 15 minutes from site by foot. Twin, triple and family rooms available with option of balcony/ terrasse.' },
          { _key: 'lecentral', hotelName: 'Le Central Hotel',  url: '#', description: 'Nearby option 8 minutes from site by foot in the village centre with proximity to the train station. Double, twin, triple and apartment room for 4 guests available.' },
        ],
      },
      {
        _key: 'banyuls',
        name: 'Banyuls-sur-mer',
        hotels: [
          { _key: 'lespecheurs', hotelName: 'Hotel Les Pecheurs', url: '#', description: "25 minutes from site by regional train (TER), or 15 minutes by car in Cerbere's neighbouring village." },
        ],
      },
      {
        _key: 'portbou',
        name: 'Portbou',
        hotels: [
          { _key: 'lamasia', hotelName: 'Hotel La Masia', url: '#', description: "25 minutes from site by regional train (TER), or 15 minutes by car in Cerbere's neighbouring village." },
        ],
      },
    ],
  },
]

console.log(`Importing ${docs.length} documents...`)

for (const doc of docs) {
  await client.createOrReplace(doc)
  console.log(`✓ ${doc._type}: ${doc._id}`)
}

console.log('\nDone.')
