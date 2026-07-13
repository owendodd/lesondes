'use client'

import { useLang } from '@/hooks/useLang'
import { siteDisplayClass } from '@/lib/siteSpacing'

export function ComingSoon() {
  const { lang } = useLang()
  return (
    <p className={`text-center ${siteDisplayClass}`}>
      {lang === 'fr' ? 'Prochainement' : 'Coming Soon'}
    </p>
  )
}
