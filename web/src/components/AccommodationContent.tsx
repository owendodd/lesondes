'use client'

import { useLang } from '@/hooks/useLang'
import { siteBodyClass, siteLinkClass } from '@/lib/siteSpacing'
import type { Location } from '@/lib/types'

interface Props {
  introEn: string
  introFr: string
  locations: Location[]
}

export function AccommodationContent({ introEn, introFr, locations }: Props) {
  const { lang } = useLang()
  const isFr = lang === 'fr'

  return (
    <div className="px-10 max-[740px]:px-4 pb-8">
      <div className={`flex flex-col gap-10 ${siteBodyClass}`}>

        {(introEn || introFr) && (
          <p>{isFr ? introFr : introEn}</p>
        )}

        {locations.map(loc => (
          <div key={loc.name} className="flex flex-col gap-4">
            <p className="uppercase">{loc.name}</p>
            <div className="flex flex-col gap-4">
              {loc.hotels.map(hotel => (
                <p key={hotel.hotelName}>
                  {hotel.url ? (
                    <a href={hotel.url} target="_blank" rel="noopener noreferrer" className={siteLinkClass}>
                      {hotel.hotelName}
                    </a>
                  ) : (
                    <span className="underline decoration-[1px] underline-offset-2">{hotel.hotelName}</span>
                  )}
                  {': '}
                  {isFr ? (hotel.descriptionFr || hotel.description) : hotel.description}
                </p>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}
