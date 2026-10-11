import { Analytics } from '@vercel/analytics/next'
import { LangProvider } from '@/components/LangProvider'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <div className="min-h-svh flex flex-col bg-white">
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
      <Analytics />
    </LangProvider>
  )
}
