'use client'

import { useLang } from '@/hooks/useLang'
import type { Accommodation } from '@/lib/types'
import type { ReactNode } from 'react'

const pageClass =
  'mx-auto flex max-w-[720px] flex-col gap-8 px-6 pb-[120px] text-[24px] leading-[1.1] tracking-[0.08em] filter-[url(#roughen)] max-[740px]:px-5 max-[740px]:pb-16 max-[740px]:text-[20px]'

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
      <p className="leading-[1.1]">{lang === 'fr' ? data.introFr : data.introEn}</p>

      <div className="flex flex-col gap-8">
        {data.locations.map(loc => (
          <div key={loc.name} className="flex flex-col gap-4">
            <p className="text-center uppercase">{loc.name}</p>
            {loc.hotels.map(hotel => (
              <p key={hotel.hotelName}>
                <a
                  href={hotel.url || '#'}
                  className="text-inherit underline decoration-[2px] underline-offset-2 hover:text-[#888]"
                >
                  {hotel.hotelName}
                </a>
                : {hotel.description}
              </p>
            ))}
          </div>
        ))}
      </div>

      {children}
    </div>
  )
}
