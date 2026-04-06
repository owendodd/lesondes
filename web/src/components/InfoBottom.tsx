'use client'

import { useLang } from '@/hooks/useLang'
import type { InfoBottom as InfoBottomType } from '@/lib/types'

function HotelName({ name }: { name: string }) {
  const words = name.split(' ')
  if (words.length <= 3) return <>{name}</>
  const first = words.slice(0, words.length - 3).join(' ')
  const last = words.slice(words.length - 3).join(' ')
  return <>{first}<br />{last}</>
}

export function InfoBottom({ data }: { data: InfoBottomType }) {
  const { lang } = useLang()

  return (
    <div className="[grid-area:info-bottom] flex flex-col gap-4 self-end text-center">
      <p>
        {lang === 'fr' ? data.foodCreditPrefixFr : data.foodCreditPrefixEn}
        <br />
        {data.foodPerson}
      </p>
      <p>
        {lang === 'fr' ? data.wineCreditPrefixFr : data.wineCreditPrefixEn}
        <br />
        {data.winePerson}
      </p>
      <p>
        {data.hotelUrl ? (
          <a
            href={data.hotelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 underline-offset-2 hover:text-[#888] transition-colors duration-150"
          >
            <HotelName name={lang === 'fr' ? (data.hotelNameFr || data.hotelName) : data.hotelName} />
          </a>
        ) : (
          <HotelName name={lang === 'fr' ? (data.hotelNameFr || data.hotelName) : data.hotelName} />
        )}
      </p>
    </div>
  )
}
