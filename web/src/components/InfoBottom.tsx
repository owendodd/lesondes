'use client'

import { useLang } from '@/hooks/useLang'
import type { InfoBottom as InfoBottomType } from '@/lib/types'

function Credit({ prefix, person }: { prefix: string; person: string }) {
  return (
    <p className="flex-1">
      {prefix}
      <br />
      {person}
    </p>
  )
}

export function InfoBottom({ data }: { data: InfoBottomType }) {
  const { lang } = useLang()
  const isFr = lang === 'fr'

  return (
    <div className="flex gap-10 max-[740px]:flex-col max-[740px]:gap-6">
      <Credit
        prefix={isFr ? data.foodCreditPrefixFr : data.foodCreditPrefixEn}
        person={data.foodPerson}
      />
      <Credit
        prefix={isFr ? data.wineCreditPrefixFr : data.wineCreditPrefixEn}
        person={data.winePerson}
      />
    </div>
  )
}
