import { getSiteConfig, sanityFetch } from '@/lib/sanity'
import { HOME_CONTENT_QUERY } from '@/lib/queries'
import { HeroVideo } from '@/components/HeroVideo'
import { InfoTop } from '@/components/InfoTop'
import { ArtistList } from '@/components/ArtistList'
import { InfoBottom } from '@/components/InfoBottom'
import { NewsletterContact } from '@/components/NewsletterContact'
import { Credits } from '@/components/Credits'
import { LangSwitcher } from '@/components/LangSwitcher'
import {
  siteBodyTextClass,
  siteBottomFullWidthStackClass,
  siteContainerClass,
  sitePageGapClass,
  sitePagePaddingYClass,
  sitePageStackClass,
} from '@/lib/siteSpacing'
import type { SiteConfig, Artist, InfoLink, InfoBottom as InfoBottomType, Credit } from '@/lib/types'

const pageClass = `relative z-[2] ${siteContainerClass} ${sitePageStackClass} ${sitePageGapClass} ${sitePagePaddingYClass}`

const twoColClass = `home-content-grid ${siteBodyTextClass}`

interface HomeData {
  siteConfig: SiteConfig
  artists: Artist[]
  infoLinks: InfoLink[]
  infoBottom: InfoBottomType
  credits: Credit[]
}

type HomeContent = Omit<HomeData, 'siteConfig'>

export default async function Home() {
  const [rawConfig, raw] = await Promise.all([
    getSiteConfig(),
    sanityFetch<HomeContent>(HOME_CONTENT_QUERY, {}, { next: { revalidate: 60 } }),
  ])
  const data: HomeData = {
    siteConfig: rawConfig ?? { title: 'LES ONDES', location: 'Cerbère', datesEn: 'May 29 30 31', datesFr: '29 30 31 Mai', contactEmail: 'poste@les-ondes.fr', brevoFormAction: '' },
    artists: raw?.artists ?? [],
    infoLinks: raw?.infoLinks ?? [],
    infoBottom: raw?.infoBottom ?? { hotelName: '', foodCreditPrefixEn: '', foodCreditPrefixFr: '', foodPerson: '', wineCreditPrefixEn: '', wineCreditPrefixFr: '', winePerson: '' },
    credits: raw?.credits ?? [],
  }

  return (
    <>
      <HeroVideo />
      <div className={pageClass}>
        <div className={twoColClass}>
          <InfoTop links={data.infoLinks} />
          <ArtistList artists={data.artists} />
          <InfoBottom data={data.infoBottom} />
        </div>

        <div className={siteBottomFullWidthStackClass}>
          <NewsletterContact brevoFormAction={data.siteConfig.brevoFormAction} email={data.siteConfig.contactEmail} />
          <Credits credits={data.credits} />
          <div className={siteBodyTextClass}>
            <LangSwitcher />
          </div>
        </div>
      </div>
    </>
  )
}
