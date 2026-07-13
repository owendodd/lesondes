import { sanityFetch } from '@/lib/sanity'
import { ACCOMMODATION_PAGE_QUERY } from '@/lib/queries'
import { AccommodationContent } from '@/components/AccommodationContent'
import type { Location } from '@/lib/types'

interface AccommodationData {
  introEn: string
  introFr: string
  locations: Location[]
}

export default async function AccommodationPage() {
  const data = await sanityFetch<AccommodationData>(
    ACCOMMODATION_PAGE_QUERY,
    {},
    { next: { revalidate: 60 } },
  )
  return (
    <AccommodationContent
      introEn={data?.introEn ?? ''}
      introFr={data?.introFr ?? ''}
      locations={data?.locations ?? []}
    />
  )
}
