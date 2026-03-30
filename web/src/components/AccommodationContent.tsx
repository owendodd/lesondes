'use client'

import { useLang } from '@/hooks/useLang'
import { siteBodyTextClass, siteContainerClass, sitePageGapClass } from '@/lib/siteSpacing'
import type { Accommodation } from '@/lib/types'
import type { ReactNode } from 'react'

const pageClass =
  `${siteContainerClass} flex flex-col ${sitePageGapClass} pt-0 pb-[120px] max-[740px]:pb-16 ${siteBodyTextClass}`

export function AccommodationContent({
  data,
  children,
}: {
  data: Accommodation
  children?: ReactNode
}) {
  const { lang } = useLang()

  return (
    <div className={pageClass}>
      <div className="flex flex-col gap-[60px]">
      <p className="leading-[1.1]">{lang === 'fr' ? data.introFr : data.introEn}</p>
        {data.locations.map(loc => (
          <div key={loc.name} className="flex flex-col gap-4">
            <p className="text-center uppercase">{loc.name}</p>
            {loc.hotels.map(hotel => (
              <p key={hotel.hotelName}>
                <a
                  href={hotel.url || '#'}
                  className="text-inherit underline decoration-2 underline-offset-2 hover:text-[#888]"
                >
                  {hotel.hotelName}
                </a>
                : {lang === 'fr' ? (hotel.descriptionFr || hotel.description) : hotel.description}
              </p>
            ))}
          </div>
        ))}
      </div>

      {children}
    </div>
  )
}
