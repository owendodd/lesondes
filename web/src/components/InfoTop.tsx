'use client'

import Link from 'next/link'
import { useLang } from '@/hooks/useLang'
import type { InfoLink } from '@/lib/types'

export function InfoTop({ links }: { links: InfoLink[] }) {
  const { lang } = useLang()

  return (
    <div className="[grid-area:info-top] flex flex-col gap-4 text-center">
      <div className="flex flex-col gap-4">
        {links.slice(0, 1).map(link => (
          <a
            key={link._id}
            href={link.url}
            className="text-inherit underline decoration-2 underline-offset-2 transition-colors duration-150 hover:text-[#2b5aca]"
          >
            {lang === 'fr' ? link.labelFr : link.labelEn}
          </a>
        ))}
        <Link
          href="/info"
          className="text-inherit underline decoration-2 underline-offset-2 transition-colors duration-150 hover:text-[#2b5aca]"
        >
          {lang === 'fr' ? 'Informations' : 'Information'}
        </Link>
        {links.slice(1).map(link => (
          <a
            key={link._id}
            href={link.url}
            className="text-inherit underline decoration-2 underline-offset-2 transition-colors duration-150 hover:text-[#2b5aca]"
          >
            {lang === 'fr' ? link.labelFr : link.labelEn}
          </a>
        ))}
      </div>
    </div>
  )
}
