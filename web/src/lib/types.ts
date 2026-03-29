export interface SiteConfig {
  title: string
  location: string
  datesEn: string
  datesFr: string
  contactEmail: string
  ticketUrl: string
  brevoFormAction: string
}

export interface Artist {
  _id: string
  name: string
  order: number
  lineBreak: boolean
}

export interface InfoLink {
  _id: string
  labelEn: string
  labelFr: string
  url: string
  order: number
}

export interface InfoBottom {
  hotelName: string
  foodCreditEn: string
  foodCreditFr: string
  wineCreditPrefixEn: string
  wineCreditPrefixFr: string
  winePerson: string
}

export interface Credit {
  _id: string
  roleEn: string
  roleFr: string
  personName: string
  url: string
  order: number
}

export interface Hotel {
  hotelName: string
  url: string
  description: string
}

export interface Location {
  name: string
  hotels: Hotel[]
}

export interface Accommodation {
  introEn: string
  introFr: string
  locations: Location[]
}
