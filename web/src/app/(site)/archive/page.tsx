import type { Metadata } from 'next'
import { sanityFetch, getSiteConfig } from '@/lib/sanity'
import { ARCHIVE_CONTENT_QUERY } from '@/lib/queries'
import { ArchiveInfo } from '@/components/ArchiveInfo'
import { ArchiveCarousel } from '@/components/ArchiveCarousel'
import { siteDisplayClass } from '@/lib/siteSpacing'
import type { Artist, InfoBottom } from '@/lib/types'

export const metadata: Metadata = {
  title: 'LES ONDES — Archive',
}

interface ArchiveContent {
  artists: Artist[]
  infoBottom: InfoBottom | null
  photos: { url: string; width: number; height: number }[] | null
}

export default async function ArchivePage() {
  const [config, content] = await Promise.all([
    getSiteConfig(),
    sanityFetch<ArchiveContent>(ARCHIVE_CONTENT_QUERY, {}, { next: { revalidate: 60 } }),
  ])

  const photos = content?.photos ?? []

  return (
    <div className="flex flex-col">
      <h1 className={`flex flex-wrap justify-center gap-x-[0.55em] gap-y-2 text-center px-8 max-[740px]:px-4 pt-[10vh] pb-[14vh] ${siteDisplayClass}`}>
        <span className="whitespace-nowrap">{config?.title ?? 'LES ONDES'}</span>
        <span className="whitespace-nowrap">{config?.location ?? 'Cerbère'} 2026</span>
      </h1>

      <ArchiveInfo
        artists={content?.artists ?? []}
        infoBottom={content?.infoBottom ?? null}
        datesEn={config?.datesEn ?? 'May 29 30 31'}
        datesFr={config?.datesFr ?? '29 30 31 Mai'}
      />

      {photos.length > 0 && (
        <div className="mt-[10vh]">
          <ArchiveCarousel photos={photos} />
        </div>
      )}
    </div>
  )
}
