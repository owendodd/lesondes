import { sanityFetch } from '@/lib/sanity'
import { INFO_PAGE_QUERY } from '@/lib/queries'
import { InfoContent } from '@/components/InfoContent'
import type { InfoPage, SiteConfig, Credit } from '@/lib/types'

interface InfoData {
  infoPage: InfoPage
  siteConfig: Pick<SiteConfig, 'contactEmail' | 'brevoFormAction'>
  credits: Credit[]
}

export default async function InfoPage() {
  const data = await sanityFetch<InfoData>(INFO_PAGE_QUERY, {}, { next: { revalidate: 60 } })
  return (
    <InfoContent
      infoPage={data.infoPage}
      siteConfig={data.siteConfig}
      credits={data.credits}
    />
  )
}
