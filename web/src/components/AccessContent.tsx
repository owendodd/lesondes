'use client'

import { useLang } from '@/hooks/useLang'
import { siteBodyClass } from '@/lib/siteSpacing'

interface Section {
  titleEn: string
  titleFr: string
  bodyEn: string
  bodyFr: string
}

export function AccessContent({ sections }: { sections: Section[] }) {
  const { lang } = useLang()

  return (
    <div className="px-10 max-[740px]:px-4 pb-8">
      <div className={`flex flex-col gap-10 ${siteBodyClass}`}>
        {sections.map((s, i) => (
          <div key={i} className="flex flex-col gap-3">
            <p className="font-medium">{lang === 'fr' ? s.titleFr : s.titleEn}</p>
            <p>{lang === 'fr' ? s.bodyFr : s.bodyEn}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
