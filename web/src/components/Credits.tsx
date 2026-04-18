'use client'

import { useLang } from '@/hooks/useLang'
import { siteArtistClass, siteInlineLinkClass } from '@/lib/siteSpacing'
import type { Credit } from '@/lib/types'

export function Credits({ credits }: { credits: Credit[] }) {
  const { lang } = useLang()

  return (
    <div className={`m-0 flex flex-col gap-4 text-center text-black ${siteArtistClass}`}>
      <div className="contents">
        {credits.map(credit => (
          <p key={credit._id}>
            {lang === 'fr' ? credit.roleFr : credit.roleEn}
            <a href={credit.url} className={`${siteInlineLinkClass} max-[740px]:block`}>
              {credit.personName}
            </a>
          </p>
        ))}
      </div>
    </div>
  )
}
