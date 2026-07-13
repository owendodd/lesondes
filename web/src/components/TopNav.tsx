'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/hooks/useLang'
import { siteMinimalNavClass } from '@/lib/siteSpacing'

const links = [
  { href: '/', en: 'Home', fr: 'Accueil' },
  { href: '/archive', en: 'Archive', fr: 'Archives' },
  { href: '/newsletter', en: 'Newsletter', fr: 'Infolettre' },
]

export function TopNav() {
  const pathname = usePathname()
  const { lang, setLang } = useLang()

  const langClass = (active: boolean) =>
    `cursor-pointer bg-transparent p-0 font-sans text-[inherit] leading-none tracking-[inherit] text-black ${active ? '' : 'opacity-30 link-box'}`

  return (
    <header className={`relative z-10 flex justify-between items-center px-8 max-[740px]:px-4 py-4 ${siteMinimalNavClass}`}>
      <nav className="flex gap-4 max-[740px]:gap-3">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            scroll={false}
            className={`text-inherit no-underline ${pathname === link.href ? 'opacity-30 no-hover' : ''}`}
          >
            {lang === 'fr' ? link.fr : link.en}
          </Link>
        ))}
      </nav>
      <div className="flex gap-4 max-[740px]:gap-3">
        <button type="button" className={langClass(lang === 'fr')} onClick={() => setLang('fr')}>FR</button>
        <button type="button" className={langClass(lang === 'en')} onClick={() => setLang('en')}>EN</button>
      </div>
    </header>
  )
}
