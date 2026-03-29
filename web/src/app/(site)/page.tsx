import { getSiteConfig, sanityFetch } from '@/lib/sanity'
import { HOME_CONTENT_QUERY } from '@/lib/queries'
import { HeroVideo } from '@/components/HeroVideo'
import { InfoTop } from '@/components/InfoTop'
import { ArtistList } from '@/components/ArtistList'
import { InfoBottom } from '@/components/InfoBottom'
import { NewsletterContact } from '@/components/NewsletterContact'
import { Credits } from '@/components/Credits'
import type { SiteConfig, Artist, InfoLink, InfoBottom as InfoBottomType, Credit } from '@/lib/types'

const pageClass =
  'relative z-[2] mx-auto flex max-w-[800px] flex-col gap-[120px] px-6 py-[120px] max-[740px]:gap-16 max-[740px]:px-5 max-[740px]:py-16'

const twoColClass =
  'home-content-grid text-[24px] leading-[1.1] tracking-[0.08em] filter-[url(#roughen)]'

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
    siteConfig: rawConfig ?? { title: 'LES ONDES', location: 'Cerbère', datesEn: 'May 29 30 31', datesFr: '29 30 31 Mai', contactEmail: 'poste@les-ondes.fr', ticketUrl: '#', brevoFormAction: '' },
    artists: raw?.artists ?? [],
    infoLinks: raw?.infoLinks ?? [],
    infoBottom: raw?.infoBottom ?? { hotelName: '', foodCreditEn: '', foodCreditFr: '', wineCreditPrefixEn: '', wineCreditPrefixFr: '', winePerson: '' },
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

        <NewsletterContact brevoFormAction={data.siteConfig.brevoFormAction} email={data.siteConfig.contactEmail} />
        <Credits credits={data.credits} />
      </div>
    </>
  )
}
