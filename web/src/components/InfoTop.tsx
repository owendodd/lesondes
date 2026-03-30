'use client'

import { useLang } from '@/hooks/useLang'
import type { InfoLink } from '@/lib/types'

export function InfoTop({ links }: { links: InfoLink[] }) {
  const { lang } = useLang()

  return (
    <div className="[grid-area:info-top] flex flex-col gap-4 text-center">
      <div className="flex flex-col gap-4">
        {links.map(link => (
            <a
              key={link._id}
              href={link.url}
              className="text-inherit underline decoration-2 underline-offset-2 transition-colors duration-150 hover:text-[#888]"
            >
            {lang === 'fr' ? link.labelFr : link.labelEn}
          </a>
        ))}
      </div>
    </div>
  )
}
