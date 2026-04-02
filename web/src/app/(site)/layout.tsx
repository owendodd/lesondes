import { LangProvider } from '@/components/LangProvider'
import { LangSwitcher } from '@/components/LangSwitcher'
import { SvgFilter } from '@/components/SvgFilter'
import { SiteHeader } from '@/components/SiteHeader'
import { getSiteConfig } from '@/lib/sanity'
import type { SiteConfig } from '@/lib/types'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const rawConfig = await getSiteConfig()
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
      <SiteHeader config={config} />
      <div className="pt-[clamp(284px,calc(240px+5.94vw),315px)] max-[740px]:pt-[clamp(127px,calc(96px+9.9vw),149px)]">
        {children}
      </div>
    </LangProvider>
  )
}
