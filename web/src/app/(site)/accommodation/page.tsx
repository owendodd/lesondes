import { sanityFetch } from '@/lib/sanity'
import { ACCOMMODATION_QUERY } from '@/lib/queries'
import { AccommodationContent } from '@/components/AccommodationContent'
import { NewsletterContact } from '@/components/NewsletterContact'
import type { SiteConfig, Accommodation } from '@/lib/types'

interface AccomData {
  siteConfig: Pick<SiteConfig, 'contactEmail' | 'brevoFormAction'>
  accommodation: Accommodation
}

export default async function AccommodationPage() {
  const data = await sanityFetch<AccomData>(ACCOMMODATION_QUERY, {}, { next: { revalidate: 60 } })

  return (
    <AccommodationContent data={data.accommodation}>
      <NewsletterContact
        brevoFormAction={data.siteConfig.brevoFormAction}
        email={data.siteConfig.contactEmail}
        variant="accommodation"
      />
    </AccommodationContent>
  )
}
