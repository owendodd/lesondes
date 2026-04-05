import { Analytics } from '@vercel/analytics/next'
import { LangProvider } from '@/components/LangProvider'
import { LangSwitcher } from '@/components/LangSwitcher'
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
    <>
      <LangProvider>
        <SiteHeader config={config} />
        <div>
          {children}
        </div>
      </LangProvider>
      <Analytics />
    </>
  )
}
