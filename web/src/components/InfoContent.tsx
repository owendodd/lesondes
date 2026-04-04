'use client'

import Link from 'next/link'
import { useLang } from '@/hooks/useLang'
import {
  siteBodyTextClass,
  siteBottomFullWidthStackClass,
  siteContainerClass,
  sitePageGapClass,
} from '@/lib/siteSpacing'
import type { InfoPage, Accommodation } from '@/lib/types'

const pageClass = `${siteContainerClass} flex flex-col ${sitePageGapClass} pt-0 pb-[120px] max-[740px]:pb-16`
const sectionClass = `flex flex-col gap-[60px] ${siteBodyTextClass}`
const linkClass = 'text-inherit underline decoration-2 underline-offset-2 hover:text-[#888] transition-colors duration-150'

export function InfoContent({
  infoPage: d,
  accommodation,
}: {
  infoPage: InfoPage
  accommodation: Pick<Accommodation, 'locations'>
}) {
  const { lang } = useLang()
  const isFr = lang === 'fr'

  return (
    <div className={pageClass}>

      {/* Overview */}
      <div className={sectionClass}>
        <p>{isFr ? d.overviewFr : d.overviewEn}</p>
      </div>

      {/* Music */}
      <div className={sectionClass}>
        <p className="uppercase">{isFr ? 'Musique' : 'Music'}</p>
        <p>{isFr ? d.musicIntroFr : d.musicIntroEn}</p>
        {d.schedule?.length > 0 && (
          <div className="flex flex-col gap-[40px]">
            {d.schedule.map((item, i) => (
              <div key={i} className="flex flex-col gap-2">
                <p>{isFr ? item.dayFr : item.dayEn}</p>
                <p className="text-black/50">{isFr ? item.detailFr : item.detailEn}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dining & Bar */}
      <div className={sectionClass}>
        <p className="uppercase">{isFr ? 'Repas & Bar' : 'Dining & Bar'}</p>
        <p>{isFr ? d.diningFr : d.diningEn}</p>
      </div>

      {/* Accommodation */}
      <div className={sectionClass}>
        <p className="uppercase">{isFr ? 'Hébergement' : 'Accommodation'}</p>
        <p>
          {isFr ? d.accommodationNoteEr : d.accommodationNoteEn}
          {' '}
          <Link href="/accommodation" className={linkClass}>
            {isFr ? 'Voir les options' : 'View options'}
          </Link>
          .
        </p>
        {accommodation.locations?.map(loc => (
          <div key={loc.name} className="flex flex-col gap-4">
            <p className="text-center uppercase">{loc.name}</p>
            {loc.hotels.map(hotel => (
              <p key={hotel.hotelName}>
                <a href={hotel.url || '#'} className={linkClass}>
                  {hotel.hotelName}
                </a>
                : {isFr ? (hotel.descriptionFr || hotel.description) : hotel.description}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className={siteBottomFullWidthStackClass}>
        <div className={siteBodyTextClass}>
          <p className="text-center">
            <a href="mailto:poste@les-ondes.fr" className={linkClass}>
              poste@les-ondes.fr
            </a>
          </p>
        </div>
      </div>

    </div>
  )
}
