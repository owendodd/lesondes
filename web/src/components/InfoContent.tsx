'use client'

import { PortableText } from '@portabletext/react'
import { useLang } from '@/hooks/useLang'
import { siteBodyClass, siteInlineLinkClass, siteLinkClass } from '@/lib/siteSpacing'
import type { InfoPage, PortableTextBlock } from '@/lib/types'

const headingClass = 'uppercase'

const portableTextComponents = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className={siteInlineLinkClass}>
        {children}
      </a>
    ),
  },
}

function Overview({ value }: { value: string | PortableTextBlock[] | undefined }) {
  if (!value || (Array.isArray(value) ? value.length === 0 : !value)) return null
  if (Array.isArray(value)) {
    return <PortableText value={value} components={portableTextComponents} />
  }
  return <p>{value}</p>
}

export function InfoContent({ infoPage: d }: { infoPage: InfoPage }) {
  const { lang } = useLang()
  const isFr = lang === 'fr'

  const overview = isFr ? d.overviewFr : d.overviewEn

  return (
    <div className="px-10 max-[740px]:px-4 pb-8">
      <div className={`flex flex-col gap-10 ${siteBodyClass}`}>

        {/* Overview */}
        {overview && <Overview value={overview} />}

        {/* Music */}
        {(d.musicIntroEn || d.musicIntroFr) && (
          <div className="flex flex-col gap-4">
            <p className={headingClass}>{isFr ? 'Musique' : 'Music'}</p>
            <p>{isFr ? d.musicIntroFr : d.musicIntroEn}</p>
            {d.spotifyUrl && (
              <a href={d.spotifyUrl} target="_blank" rel="noopener noreferrer" className={siteLinkClass}>
                Spotify
              </a>
            )}
            {d.appleMusicUrl && (
              <a href={d.appleMusicUrl} target="_blank" rel="noopener noreferrer" className={siteLinkClass}>
                Apple Music
              </a>
            )}
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
