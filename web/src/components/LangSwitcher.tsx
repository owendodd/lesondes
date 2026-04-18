'use client'

import { useLang } from '@/hooks/useLang'

const optionBase = 'cursor-pointer transition-colors duration-150 hover:text-[#2b5aca]'

export function LangSwitcher() {
  const { lang, setLang } = useLang()

  return (
    <div className="flex cursor-pointer justify-center gap-4">
      <p
        className={`${optionBase} ${lang === 'fr' ? 'underline decoration-2 underline-offset-2' : ''}`}
        onClick={() => setLang('fr')}
      >
        FR
      </p>
      <p
        className={`${optionBase} ${lang === 'en' ? 'underline decoration-2 underline-offset-2' : ''}`}
        onClick={() => setLang('en')}
      >
        EN
      </p>
    </div>
  )
}
