export const SITE_CONFIG_QUERY = `*[_type == "siteConfig"][0]{
  title,
  location,
  locationUrl,
  datesEn,
  datesFr,
  contactEmail,
  ticketUrl,
  brevoFormAction
}`

/** Home page body only — pair with `getSiteConfig()` so layout + page share one cached config fetch */
export const HOME_CONTENT_QUERY = `{
  "artists": *[_type == "artist"] | order(lower(lastName) asc) {
    _id, firstName, lastName, lineBreak
  },
  "infoLinks": *[_type == "infoLink"] | order(order asc) {
    _id, labelEn, labelFr, url
  },
  "infoBottom": *[_type == "infoBottom"][0]{
    hotelName, hotelNameFr, hotelUrl, foodCreditPrefixEn, foodCreditPrefixFr, foodPerson, wineCreditPrefixEn, wineCreditPrefixFr, winePerson
  },
  "credits": *[_type == "credit" && videoCredit == true] | order(order asc) {
    _id, roleEn, roleFr, personName, url
  }
}`

export const INFO_PAGE_QUERY = `{
  "infoPage": *[_id == "b0e897fb-a27d-4a0d-ba12-5d3f9876026c"][0]{
    heroImage,
    overviewEn[] { ..., markDefs[]{ ..., _type == "link" => { href } } },
    overviewFr[] { ..., markDefs[]{ ..., _type == "link" => { href } } },
    musicIntroEn, musicIntroFr,
    spotifyUrl, appleMusicUrl,
    diningEn, diningFr
  },
  "siteConfig": *[_type == "siteConfig"][0]{
    contactEmail, brevoFormAction
  },
  "credits": *[_type == "credit"] | order(order asc) {
    _id, roleEn, roleFr, personName, url
  }
}`

/** One round-trip for all page hero images — keyed by page slug */
export const ALL_HERO_IMAGES_QUERY = `{
  "home":          *[_type == "infoBottom"][0].heroImage,
  "homeCarousel":  *[_type == "infoBottom"][0].heroImages,
  "info":          *[_id   == "b0e897fb-a27d-4a0d-ba12-5d3f9876026c"][0].heroImage,
  "accommodation": *[_type == "accommodationPage"][0].heroImage,
  "tickets":       *[_type == "ticketsPage"][0].heroImage,
  "access":        *[_type == "accessPage"][0].heroImage
}`

export const ACCESS_PAGE_QUERY = `*[_type == "accessPage"][0]{
  sections[] { titleEn, titleFr, bodyEn, bodyFr }
}`

export const ACCOMMODATION_PAGE_QUERY = `*[_type == "accommodationPage"][0]{
  introEn, introFr,
  locations[] {
    name,
    hotels[] { hotelName, url, description, descriptionFr }
  }
}`
