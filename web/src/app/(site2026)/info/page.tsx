import { sanityFetch } from '@/lib/sanity'
import { INFO_PAGE_QUERY } from '@/lib/queries'
import { InfoContent } from '@/components/InfoContent'
import type { InfoPage } from '@/lib/types'

export default async function InfoPage() {
  const data = await sanityFetch<{ infoPage: InfoPage }>(
    INFO_PAGE_QUERY,
    {},
    { next: { revalidate: 60 } },
  )
  return <InfoContent infoPage={data?.infoPage ?? ({} as InfoPage)} />
}
