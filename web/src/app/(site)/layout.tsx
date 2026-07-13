import { Analytics } from '@vercel/analytics/next'
import { LangProvider } from '@/components/LangProvider'
import { SiteBackground } from '@/components/SiteBackground'
import { TopNav } from '@/components/TopNav'
import { FooterBar } from '@/components/FooterBar'
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
      <SiteBackground />
      <div className="min-h-svh flex flex-col">
        <TopNav />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <FooterBar contactEmail={config.contactEmail} />
      </div>
      <Analytics />
    </LangProvider>
  )
}
