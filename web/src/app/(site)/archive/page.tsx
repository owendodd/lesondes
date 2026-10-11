import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { ARCHIVE_CONTENT_QUERY } from '@/lib/queries'
import { ArchiveText } from '@/components/ArchiveText'
import { ArchiveGallery } from '@/components/ArchiveGallery'
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
  const content = await sanityFetch<ArchiveContent>(ARCHIVE_CONTENT_QUERY, {}, { next: { revalidate: 60 } })

  const photos = content?.photos ?? []

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-4 pb-20">
        <ArchiveText artists={content?.artists ?? []} infoBottom={content?.infoBottom ?? null} />
      </div>

      <ArchiveGallery photos={photos} />
    </div>
  )
}
