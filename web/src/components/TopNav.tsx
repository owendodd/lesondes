'use client'

import Image from 'next/image'
import Link from 'next/link'
import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from '@/lib/sanity'
import { useLang } from '@/hooks/useLang'
import { siteFigmaTextClass, siteFigmaBarHeightClass, siteFigmaCellAspectClass } from '@/lib/siteSpacing'
import type { SanityImageRef } from '@/lib/types'

const builder = createImageUrlBuilder(client)

function imgUrl(ref?: SanityImageRef | null) {
  return ref ? builder.image(ref).auto('format').width(480).url() : null
}

export function TopNav({
  headerImage,
  navImage2027,
  navImage2026,
  navImageAbout,
  navImageLang,
}: {
  headerImage?: SanityImageRef | null
  navImage2027?: SanityImageRef | null
  navImage2026?: SanityImageRef | null
  navImageAbout?: SanityImageRef | null
  navImageLang?: SanityImageRef | null
}) {
  const { lang, setLang } = useLang()

  const links: { key: string; href: string; label: string; image?: SanityImageRef | null; uppercase: boolean }[] = [
    { key: 'les-ondes', href: '/', label: 'LES ONDES', image: headerImage, uppercase: true },
    { key: '2027', href: '/', label: '2027', image: navImage2027, uppercase: true },
    { key: '2026', href: '/archive', label: '2026', image: navImage2026, uppercase: true },
    { key: 'about', href: '/about', label: lang === 'fr' ? 'À propos' : 'About', image: navImageAbout, uppercase: false },
  ]

  // Show only the language you'd switch to, spelled out.
  const otherLang = lang === 'fr' ? 'en' : 'fr'
  const otherLangLabel = otherLang === 'fr' ? 'Français' : 'English'
  const langUrl = imgUrl(navImageLang)

  const cellClass = `relative h-full ${siteFigmaCellAspectClass} shrink-0 overflow-hidden no-hover text-black`

  return (
    <header className={`relative z-10 flex gap-px ${siteFigmaBarHeightClass} ${siteFigmaTextClass}`}>
      {links.map(link => {
        const url = imgUrl(link.image)
        return (
          <Link key={link.key} href={link.href} scroll={false} className={`${cellClass} no-underline`}>
            <div className="nav-card absolute inset-0 flex items-center justify-center px-1">
              {url && <Image src={url} alt="" fill sizes="240px" priority className="object-cover pointer-events-none" />}
              <p className={`relative whitespace-nowrap ${link.uppercase ? 'uppercase' : ''}`}>{link.label}</p>
            </div>
          </Link>
        )
      })}
      <button type="button" onClick={() => setLang(otherLang)} className={`${cellClass} cursor-pointer border-0 bg-transparent p-0`}>
        <div className="nav-card absolute inset-0 flex items-center justify-center px-1">
          {langUrl && <Image src={langUrl} alt="" fill sizes="240px" className="object-cover pointer-events-none" />}
          <p className="relative whitespace-nowrap">{otherLangLabel}</p>
        </div>
      </button>
    </header>
  )
}
