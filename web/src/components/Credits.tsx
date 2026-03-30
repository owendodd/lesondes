'use client'

import { useLang } from '@/hooks/useLang'
import type { Credit } from '@/lib/types'

export function Credits({ credits }: { credits: Credit[] }) {
  const { lang } = useLang()

  return (
    <div className="m-0 flex flex-col gap-3 text-center text-[24px] leading-[1.1] tracking-[0.08em] text-black max-[740px]:text-[20px]">
      <div className="contents">
        {credits.map(credit => (
          <p key={credit._id}>
            {lang === 'fr' ? credit.roleFr : credit.roleEn}
            <a href={credit.url} className="text-inherit underline decoration-2 underline-offset-2 max-[740px]:block">
              {credit.personName}
            </a>
          </p>
        ))}
      </div>
    </div>
  )
}
