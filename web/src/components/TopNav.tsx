'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from '@/lib/sanity'
import { useLang } from '@/hooks/useLang'
import { siteFigmaTextClass } from '@/lib/siteSpacing'
import type { SanityImageRef } from '@/lib/types'

const builder = createImageUrlBuilder(client)

const links = [
  { href: '/', label: '2027' },
  { href: '/archive', label: '2026' },
  { href: '/about', en: 'About', fr: 'À propos' },
] as const

export function TopNav({ headerImage }: { headerImage?: SanityImageRef | null }) {
  const pathname = usePathname()
  const { lang, setLang } = useLang()
  const imageUrl = headerImage ? builder.image(headerImage).auto('format').width(830).url() : null

  return (
    <header className={`relative z-10 flex items-stretch h-[260px] max-[740px]:h-[160px] ${siteFigmaTextClass}`}>
      <div className="relative aspect-[415/260] h-full shrink-0 flex items-center justify-center overflow-hidden">
        {imageUrl && (
          <Image src={imageUrl} alt="" fill priority className="object-cover pointer-events-none" />
        )}
        <p className="relative uppercase whitespace-nowrap">Les Ondes</p>
      </div>
      <nav className="flex-1 bg-[#f0f1ea] flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-2">
        {links.map(link => {
          const active = pathname === link.href
          const label = 'label' in link ? link.label : (lang === 'fr' ? link.fr : link.en)
          return (
            <Link
              key={link.href}
              href={link.href}
              scroll={false}
              className={`whitespace-nowrap no-underline ${active ? 'text-black/50 no-hover' : 'text-black'}`}
            >
              {label}
            </Link>
          )
        })}
        <button
          type="button"
          className="link-box cursor-pointer border-0 bg-transparent p-0 whitespace-nowrap text-black"
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
        >
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
      </nav>
    </header>
  )
}
