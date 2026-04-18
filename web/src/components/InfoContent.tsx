'use client'

import { useLang } from '@/hooks/useLang'
import { siteBodyClass, siteLinkClass } from '@/lib/siteSpacing'
import type { InfoPage } from '@/lib/types'

const headingClass = 'uppercase'

export function InfoContent({ infoPage: d }: { infoPage: InfoPage }) {
  const { lang } = useLang()
  const isFr = lang === 'fr'

  return (
    <div className="px-10 max-[740px]:px-4 pb-8">
      <div className={`flex flex-col gap-10 ${siteBodyClass}`}>

        {/* Overview */}
        {(d.overviewEn || d.overviewFr) && (
          <p>{isFr ? d.overviewFr : d.overviewEn}</p>
        )}

        {/* Music */}
        {(d.musicIntroEn || d.musicIntroFr) && (
          <div className="flex flex-col gap-4">
            <p className={headingClass}>{isFr ? 'Musique' : 'Music'}</p>
            <p>{isFr ? d.musicIntroFr : d.musicIntroEn}</p>
          </div>
        )}

        {/* Dining & Bar */}
        {(d.diningEn || d.diningFr) && (
          <div className="flex flex-col gap-4">
            <p className={headingClass}>{isFr ? 'Repas & Bar' : 'Dining & Bar'}</p>
            <p>{isFr ? d.diningFr : d.diningEn}</p>
          </div>
        )}

      </div>
    </div>
  )
}
