import { getSiteConfig } from '@/lib/sanity'
import { siteDisplayClass } from '@/lib/siteSpacing'

export default async function Home() {
  const config = await getSiteConfig()

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 max-[740px]:px-4">
      <h1 className={`flex flex-wrap justify-center gap-x-[0.55em] gap-y-2 text-center ${siteDisplayClass}`}>
        <span className="whitespace-nowrap">{config?.title ?? 'LES ONDES'}</span>
        <span className="whitespace-nowrap">2027</span>
      </h1>
      <p className={`text-center ${siteDisplayClass}`}>Coming Soon</p>
    </div>
  )
}
