'use client'

import Link from 'next/link'
import { useLang } from '@/hooks/useLang'
import { siteLinkClass, siteRoughenClass } from '@/lib/siteSpacing'
import type { SiteConfig } from '@/lib/types'

export function PageFooter({ config }: { config: Pick<SiteConfig, 'contactEmail'> }) {
  const { lang } = useLang()

  return (
    <footer className={`px-10 max-[740px]:px-4 pt-16 pb-10 max-[740px]:pt-12 text-[24px] max-[740px]:text-[20px] leading-[1.2] tracking-[0.04em] ${siteRoughenClass}`}>
      <div className="flex flex-wrap gap-x-7 gap-y-2 max-[740px]:flex-col max-[740px]:gap-y-1">
        <Link href="/newsletter" scroll={false} className={siteLinkClass}>
          {lang === 'fr' ? 'Newsletter' : 'Newsletter'}
        </Link>
        <a href={`mailto:${config.contactEmail}`} className={siteLinkClass}>
          {config.contactEmail}
        </a>
        <a
          href="https://www.instagram.com/les.ondes.cerbere"
          target="_blank"
          rel="noopener noreferrer"
          className={siteLinkClass}
        >
          @les.ondes.cerbere
        </a>
      </div>
    </footer>
  )
}
