'use client'

import { useLang } from '@/hooks/useLang'
import { NewsletterContact } from '@/components/NewsletterContact'
import { Credits } from '@/components/Credits'
import {
  siteBodyTextClass,
  siteBottomFullWidthStackClass,
  siteContainerClass,
  sitePageGapClass,
} from '@/lib/siteSpacing'
import type { InfoPage, Accommodation, SiteConfig, Credit } from '@/lib/types'

const pageClass = `${siteContainerClass} flex flex-col ${sitePageGapClass} pt-0 pb-[120px] max-[740px]:pb-16`
const sectionClass = `flex flex-col gap-[60px] ${siteBodyTextClass}`
const linkClass = 'text-inherit underline decoration-2 underline-offset-2 hover:text-[#888] transition-colors duration-150'

export function InfoContent({
  infoPage: d,
  accommodation,
  siteConfig,
  credits,
}: {
  infoPage: InfoPage
  accommodation: Accommodation
  siteConfig: Pick<SiteConfig, 'contactEmail' | 'brevoFormAction'>
  credits: Credit[]
}) {
  const { lang } = useLang()
  const isFr = lang === 'fr'

  return (
    <div className={pageClass}>

      {/* Overview */}
      <div className={sectionClass}>
        <p className="leading-[1.1]">{isFr ? d.overviewFr : d.overviewEn}</p>
      </div>

      {/* Music */}
      <div className={sectionClass}>
        <p className="text-center uppercase">{isFr ? 'Musique' : 'Music'}</p>
        <p>{isFr ? d.musicIntroFr : d.musicIntroEn}</p>
        {(isFr ? d.musicEthosFr : d.musicEthosEn) && (
          <p>{isFr ? d.musicEthosFr : d.musicEthosEn}</p>
        )}
      </div>

      {/* Dining & Bar */}
      <div className={sectionClass}>
        <p className="text-center uppercase">{isFr ? 'Repas & Bar' : 'Dining & Bar'}</p>
        <p>{isFr ? d.diningFr : d.diningEn}</p>
      </div>

      {/* Accommodation */}
      <div className={sectionClass}>
        <p className="text-center uppercase">{isFr ? 'Hébergement' : 'Accommodation'}</p>
        <p>
          {isFr
            ? `${accommodation.introFr} ${d.accommodationNoteEr}`
            : `${accommodation.introEn} ${d.accommodationNoteEn}`}
        </p>
        {accommodation.locations?.map(loc => (
          <div key={loc.name} className="flex flex-col gap-4">
            <p className="text-center uppercase">{loc.name}</p>
            {loc.hotels.map(hotel => (
              <p key={hotel.hotelName}>
                <a href={hotel.url || '#'} className={linkClass}>
                  {hotel.hotelName}
                </a>
                : {isFr ? (hotel.descriptionFr || hotel.description) : hotel.description}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Footer: newsletter, credits, lang */}
      <div className={siteBottomFullWidthStackClass}>
        <NewsletterContact
          brevoFormAction={siteConfig.brevoFormAction}
          email={siteConfig.contactEmail}
        />
        <Credits credits={credits} />
      </div>

    </div>
  )
}
