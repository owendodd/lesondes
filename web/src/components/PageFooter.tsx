'use client'

import Link from 'next/link'
import { useLang } from '@/hooks/useLang'
import { siteLinkClass, siteFooterClass, siteRoughenClass } from '@/lib/siteSpacing'
import { LangSwitcher } from '@/components/HeaderControls'
import type { SiteConfig } from '@/lib/types'

export function PageFooter({ config }: { config: Pick<SiteConfig, 'contactEmail'> }) {
  const { lang } = useLang()

  return (
    <footer className={`px-10 max-[740px]:px-4 pt-[56px] max-[740px]:pt-[48px] pb-[40px] ${siteFooterClass} ${siteRoughenClass}`}>
      <div className="flex flex-wrap gap-x-7 gap-y-2 max-[740px]:flex-col max-[740px]:gap-y-3">
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
        <LangSwitcher />
      </div>
    </footer>
  )
}
