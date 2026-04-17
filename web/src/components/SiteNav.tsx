'use client'

import Link from 'next/link'
import { useLang } from '@/hooks/useLang'

const TICKETS_URL = 'https://www.helloasso.com/associations/les-ondes/evenements/les-ondes-cerbere-2026'

const links = [
  { href: '/info', en: 'About', fr: 'À propos' },
  { href: '/accommodation', en: 'Staying', fr: 'Se loger' },
  { href: '/access', en: 'Access', fr: 'Accès' },
]

const linkClass = 'text-inherit underline decoration-2 underline-offset-2 hover:text-[#888] transition-colors duration-150'

export function SiteNav() {
  const { lang, setLang } = useLang()

  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2">
      <a
        href={TICKETS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {lang === 'fr' ? 'Billets' : 'Tickets'}
      </a>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          scroll={false}
          className={linkClass}
        >
          {lang === 'fr' ? link.fr : link.en}
        </Link>
      ))}
      <button
        type="button"
        className={linkClass}
        onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
      >
        {lang === 'en' ? 'FR' : 'EN'}
      </button>
    </nav>
  )
}
