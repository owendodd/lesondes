export interface SiteConfig {
  title: string
  location: string
  datesEn: string
  datesFr: string
  contactEmail: string
  brevoFormAction: string
}

export interface Artist {
  _id: string
  firstName?: string
  lastName: string
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
  hotelNameFr?: string
  foodCreditPrefixEn: string
  foodCreditPrefixFr: string
  foodPerson: string
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
  descriptionFr: string
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
