import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import { LangProvider } from '@/components/LangProvider'
import { SvgFilter } from '@/components/SvgFilter'
import { SiteNav } from '@/components/SiteNav'
import { HeroImagePicker } from '@/components/HeroImagePicker'
import { HeaderControls } from '@/components/HeaderControls'
import { PageFooter } from '@/components/PageFooter'
import { getSiteConfig, getAllHeroImages } from '@/lib/sanity'
import { siteTextClass, siteRoughenClass } from '@/lib/siteSpacing'
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

        {/* Header: logo+nav left | dates+lang right
            Mobile: stacks to logo → nav → dates+lang row */}
        <header className={`flex max-[740px]:flex-col max-[740px]:gap-4 gap-10 px-10 max-[740px]:px-4 pt-4 ${siteTextClass} ${siteRoughenClass}`}>
          <div className="flex-1 flex flex-col gap-4 max-[740px]:gap-3">
            <Link href="/" scroll={false} className="no-hover text-inherit no-underline flex flex-wrap gap-x-6 gap-y-3">
              <span>{config.title}</span>
              <span>{config.location}</span>
            </Link>
            <SiteNav />
          </div>
          <HeaderControls datesEn={config.datesEn} datesFr={config.datesFr} />
        </header>

        {/* Content column: left 65% on desktop, full width on mobile */}
        <div className="w-full max-w-[900px] flex flex-col flex-1">

          {/* Hero image */}
          <div className="px-10 max-[740px]:px-0 pt-10 max-[740px]:pt-6 pb-10 max-[740px]:pb-6">
            <HeroImagePicker images={heroImages} />
          </div>

          {/* Page-specific content */}
          <main className={`flex-1 ${siteTextClass} ${siteRoughenClass}`}>
            {children}
          </main>

          <PageFooter config={config} />
        </div>

      </div>
      <Analytics />
    </LangProvider>
  )
}
