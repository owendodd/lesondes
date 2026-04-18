import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import { LangProvider } from '@/components/LangProvider'
import { SvgFilter } from '@/components/SvgFilter'
import { SiteNav } from '@/components/SiteNav'
import { HeroImagePicker } from '@/components/HeroImagePicker'
import { DateDisplay } from '@/components/HeaderControls'
import { PageFooter } from '@/components/PageFooter'
import { getSiteConfig, getAllHeroImages } from '@/lib/sanity'
import { siteTitleClass, siteRoughenClass } from '@/lib/siteSpacing'
import type { SiteConfig } from '@/lib/types'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [rawConfig, heroImages] = await Promise.all([
    getSiteConfig(),
    getAllHeroImages(),
  ])

  const config: SiteConfig = rawConfig ?? {
    title: 'LES ONDES',
    location: 'Cerbère',
    datesEn: 'May 29 30 31',
    datesFr: '29 30 31 Mai',
    contactEmail: 'poste@les-ondes.fr',
    brevoFormAction: '',
  }

  return (
    <LangProvider>
      <SvgFilter />
      <div className="min-h-screen flex flex-col">

        <header className={`flex flex-col gap-8 max-[740px]:gap-6 px-10 max-[740px]:px-4 pt-4 ${siteRoughenClass}`}>
          <SiteNav />
          <div className={`flex flex-wrap gap-x-[48px] gap-y-1 ${siteTitleClass}`}>
            <Link href="/" scroll={false} className="no-hover text-inherit no-underline contents">
              <span className="whitespace-nowrap">{config.title}</span>
              <span className="whitespace-nowrap">{config.location}</span>
            </Link>
            <DateDisplay datesEn={config.datesEn} datesFr={config.datesFr} className="whitespace-nowrap" />
          </div>
        </header>

        {/* Content column: left 65% on desktop, full width on mobile */}
        <div className="w-full max-w-[1000px] flex flex-col flex-1">

          {/* Hero image */}
          <div className="px-10 max-[740px]:px-0 pt-10 max-[740px]:pt-6 pb-10 max-[740px]:pb-6">
            <HeroImagePicker images={heroImages} />
          </div>

          {/* Page-specific content */}
          <main className={`flex-1 ${siteRoughenClass}`}>
            {children}
          </main>

          <PageFooter config={config} />
        </div>

      </div>
      <Analytics />
    </LangProvider>
  )
}
