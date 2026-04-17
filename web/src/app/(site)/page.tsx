import { sanityFetch } from '@/lib/sanity'
import { HOME_CONTENT_QUERY } from '@/lib/queries'
import { ArtistList } from '@/components/ArtistList'
import { InfoBottom } from '@/components/InfoBottom'
import type { Artist, InfoBottom as InfoBottomType } from '@/lib/types'

interface HomeContent {
  artists: Artist[]
  infoBottom: InfoBottomType
}

export default async function Home() {
  const raw = await sanityFetch<HomeContent>(HOME_CONTENT_QUERY, {}, { next: { revalidate: 60 } })

  const artists = raw?.artists ?? []
  const infoBottom = raw?.infoBottom ?? {
    hotelName: '',
    foodCreditPrefixEn: '',
    foodCreditPrefixFr: '',
    foodPerson: '',
    wineCreditPrefixEn: '',
    wineCreditPrefixFr: '',
    winePerson: '',
  }

  return (
    <div className="px-10 max-[740px]:px-4 pb-8 flex flex-col gap-16">
      <ArtistList artists={artists} />
      <InfoBottom data={infoBottom} />
    </div>
  )
}
