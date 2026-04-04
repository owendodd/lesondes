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
import type { InfoPage, SiteConfig, Credit } from '@/lib/types'

const pageClass = `${siteContainerClass} flex flex-col gap-[30px] max-[740px]:gap-4 pt-0 pb-[30px] max-[740px]:pb-4`
const linkClass = 'text-inherit underline decoration-2 underline-offset-2 hover:text-[#888] transition-colors duration-150'

export function InfoContent({
  infoPage: d,
  siteConfig,
  credits,
}: {
  infoPage: InfoPage
  siteConfig: Pick<SiteConfig, 'contactEmail' | 'brevoFormAction'>
  credits: Credit[]
}) {
  const { lang } = useLang()
  const isFr = lang === 'fr'

  return (
    <div className={pageClass}>
      <div className={`flex flex-col gap-[30px] max-[740px]:gap-4 filter-[url(#roughen)] ${siteBodyTextClass}`}>

        {/* Overview */}
        <p className="leading-[1.1]">{isFr ? d.overviewFr : d.overviewEn}</p>

        {/* Music */}
        <p className="text-center uppercase mt-[30px] max-[740px]:mt-4">{isFr ? 'Musique' : 'Music'}</p>
        <p>{isFr ? d.musicIntroFr : d.musicIntroEn}</p>

        {/* Dining & Bar */}
        <p className="text-center uppercase mt-[30px] max-[740px]:mt-4">{isFr ? 'Repas & Bar' : 'Dining & Bar'}</p>
        <p>{isFr ? d.diningFr : d.diningEn}</p>

        {/* Accommodation */}
        <p className="text-center uppercase mt-[30px] max-[740px]:mt-4">{isFr ? 'Hébergement' : 'Accommodation'}</p>
        <p>{isFr ? d.accommodationIntroFr : d.accommodationIntroEn}</p>
        {d.locations?.map(loc => (
          <div key={loc.name} className="flex flex-col gap-[30px] max-[740px]:gap-4">
            <p className="text-center uppercase mt-[30px] max-[740px]:mt-4">{loc.name}</p>
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

      {/* Footer */}
      <div className={`${siteBottomFullWidthStackClass} mt-[30px] max-[740px]:mt-4`}>
        <NewsletterContact
          brevoFormAction={siteConfig.brevoFormAction}
          email={siteConfig.contactEmail}
        />
        <Credits credits={credits} />
      </div>

    </div>
  )
}
