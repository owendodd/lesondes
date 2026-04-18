'use client'

import { useLang } from '@/hooks/useLang'

interface DateProps {
  datesEn?: string
  datesFr?: string
  className?: string
}

export function DateDisplay({ datesEn, datesFr, className }: DateProps) {
  const { lang } = useLang()
  return <p className={className}>{lang === 'fr' ? datesFr : datesEn}</p>
}

export function LangSwitcher() {
  const { lang, setLang } = useLang()

  const btnClass = (active: boolean) =>
    `cursor-pointer border-0 bg-transparent p-0 font-sans text-[inherit] leading-[inherit] tracking-[inherit] text-black hover:text-[#888] transition-colors duration-150${active ? ' underline decoration-2 underline-offset-2' : ''}`

  return (
    <div className="shrink-0 flex gap-2">
      <button type="button" className={btnClass(lang === 'fr')} onClick={() => setLang('fr')}>FR</button>
      <button type="button" className={btnClass(lang === 'en')} onClick={() => setLang('en')}>EN</button>
    </div>
  )
}
