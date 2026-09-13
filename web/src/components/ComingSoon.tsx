'use client'

import { useLang } from '@/hooks/useLang'
import { siteFigmaTextClass } from '@/lib/siteSpacing'

const messages = {
  planned:   { en: 'The 2027 edition of Les Ondes is being planned.', fr: "L'édition 2027 de Les Ondes est en préparation." },
  subscribe: { en: 'Subscribe for updates',                           fr: 'Abonnez-vous pour être informés' },
}

export function ComingSoon() {
  const { lang } = useLang()
  const lk = lang === 'fr' ? 'fr' : 'en'
  return (
    <div className={`flex flex-col items-center gap-4 text-center ${siteFigmaTextClass}`}>
      <p>{messages.planned[lk]}</p>
      <p>{messages.subscribe[lk]}</p>
    </div>
  )
}
