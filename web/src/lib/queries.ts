export const SITE_CONFIG_QUERY = `*[_type == "siteConfig"][0]{
  title,
  location,
  datesEn,
  datesFr,
  contactEmail,
  ticketUrl,
  brevoFormAction
}`

/** Home page body only — pair with `getSiteConfig()` so layout + page share one cached config fetch */
export const HOME_CONTENT_QUERY = `{
  "artists": *[_type == "artist"] | order(order asc) {
    _id, name, order, lineBreak
  },
  "infoLinks": *[_type == "infoLink"] | order(order asc) {
    _id, labelEn, labelFr, url
  },
  "infoBottom": *[_type == "infoBottom"][0]{
    hotelName, foodCreditEn, foodCreditFr, wineCreditPrefixEn, wineCreditPrefixFr, winePerson
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
      hotels[] { hotelName, url, description }
    }
  }
}`
