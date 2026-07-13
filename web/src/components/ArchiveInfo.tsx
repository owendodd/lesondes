'use client'

import { useLang } from '@/hooks/useLang'
import { siteMinimalNavClass } from '@/lib/siteSpacing'
import type { Artist, InfoBottom } from '@/lib/types'

interface ArchiveInfoProps {
  artists: Artist[]
  infoBottom: InfoBottom | null
  datesEn: string
  datesFr: string
}

export function ArchiveInfo({ artists, infoBottom, datesEn, datesFr }: ArchiveInfoProps) {
  const { lang } = useLang()
  const isFr = lang === 'fr'

  const artistProse = artists
    .map(a => (a.firstName ? `${a.firstName} ${a.lastName}` : a.lastName))
    .join(', ')

  const hotelName = (isFr ? infoBottom?.hotelNameFr : infoBottom?.hotelName) || infoBottom?.hotelName

  return (
    <div className={`flex flex-col gap-8 max-w-[900px] px-8 max-[740px]:px-4 ${siteMinimalNavClass} tracking-[-0.02em] leading-none`}>
      <div className="flex flex-col gap-1">
        {hotelName && <p>{hotelName}</p>}
        <p>{isFr ? datesFr : datesEn}</p>
      </div>

      {artistProse && <p className="leading-[1.1]">{artistProse}</p>}

      {infoBottom && (
        <div className="flex flex-col gap-1">
          <p>{`${isFr ? infoBottom.foodCreditPrefixFr : infoBottom.foodCreditPrefixEn} ${infoBottom.foodPerson}`}</p>
          <p>{`${isFr ? infoBottom.wineCreditPrefixFr : infoBottom.wineCreditPrefixEn} ${infoBottom.winePerson}`}</p>
        </div>
      )}
    </div>
  )
}
