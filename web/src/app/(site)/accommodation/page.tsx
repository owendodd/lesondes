import { sanityFetch } from '@/lib/sanity'
import { ACCOMMODATION_QUERY } from '@/lib/queries'
import { AccommodationContent } from '@/components/AccommodationContent'
import { NewsletterContact } from '@/components/NewsletterContact'
import { LangSwitcher } from '@/components/LangSwitcher'
import { siteBodyTextClass, siteBottomFullWidthStackClass } from '@/lib/siteSpacing'
import type { SiteConfig, Accommodation } from '@/lib/types'

interface AccomData {
  siteConfig: Pick<SiteConfig, 'contactEmail' | 'brevoFormAction'>
  accommodation: Accommodation
}

export default async function AccommodationPage() {
  const data = await sanityFetch<AccomData>(ACCOMMODATION_QUERY, {}, { next: { revalidate: 60 } })

  return (
    <AccommodationContent data={data.accommodation}>
      <div className={siteBottomFullWidthStackClass}>
        <NewsletterContact
          brevoFormAction={data.siteConfig.brevoFormAction}
          email={data.siteConfig.contactEmail}
          variant="accommodation"
        />
        <div className={siteBodyTextClass}>
          <LangSwitcher />
        </div>
      </div>
    </AccommodationContent>
  )
}
