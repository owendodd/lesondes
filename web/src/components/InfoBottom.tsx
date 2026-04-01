'use client'

import { useLang } from '@/hooks/useLang'
import type { InfoBottom as InfoBottomType } from '@/lib/types'

export function InfoBottom({ data }: { data: InfoBottomType }) {
  const { lang } = useLang()

  return (
    <div className="[grid-area:info-bottom] flex flex-col gap-4 self-end text-center">
      <p>{data.hotelName}</p>
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
    </div>
  )
}
