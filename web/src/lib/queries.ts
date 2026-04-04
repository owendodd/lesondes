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
    hotelName, hotelNameFr, foodCreditPrefixEn, foodCreditPrefixFr, foodPerson, wineCreditPrefixEn, wineCreditPrefixFr, winePerson
  },
  "credits": *[_type == "credit"] | order(order asc) {
    _id, roleEn, roleFr, personName, url
  }
}`

export const INFO_PAGE_QUERY = `{
  "infoPage": *[_type == "infoPage"][0]{
    overviewEn, overviewFr,
    musicIntroEn, musicIntroFr,
    musicEthosEn, musicEthosFr,
    diningEn, diningFr,
    accommodationNoteEn, accommodationNoteEr
  },
  "accommodation": *[_type == "accommodation"][0]{
    introEn, introFr,
    locations[] {
      name,
      hotels[] { hotelName, url, description, descriptionFr }
    }
  },
  "siteConfig": *[_type == "siteConfig"][0]{
    contactEmail, brevoFormAction
  },
  "credits": *[_type == "credit"] | order(order asc) {
    _id, roleEn, roleFr, personName, url
  }
}`

export const ACCOMMODATION_QUERY = `{
  "siteConfig": *[_type == "siteConfig"][0]{
    contactEmail, brevoFormAction
  },
  "accommodation": *[_type == "accommodation"][0]{
    introEn, introFr,
    locations[] {
      name,
      hotels[] { hotelName, url, description, descriptionFr }
    }
  }
}`
