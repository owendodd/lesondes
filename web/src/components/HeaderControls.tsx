'use client'

import { useLang } from '@/hooks/useLang'

interface Props {
  datesEn?: string
  datesFr?: string
}

export function HeaderControls({ datesEn, datesFr }: Props) {
  const { lang, setLang } = useLang()
  const dates = lang === 'fr' ? datesFr : datesEn

  const btnClass = (active: boolean) =>
    `cursor-pointer border-0 bg-transparent p-0 font-sans text-[inherit] leading-[inherit] tracking-[inherit] text-black hover:text-[#888] transition-colors duration-150${active ? ' underline decoration-2 underline-offset-2' : ''}`

  return (
    /* Desktop: flex-col items-end (dates top-right, lang bottom-right)
       Mobile: flex-row justify-between (dates left, lang right) */
    <div className="shrink-0 flex flex-col gap-4 items-end max-[740px]:w-full max-[740px]:flex-row max-[740px]:flex-wrap max-[740px]:gap-x-[26px] max-[740px]:gap-y-3 max-[740px]:items-center">
      <p>{dates}</p>
      <div className="flex gap-4">
        <button type="button" className={btnClass(lang === 'en')} onClick={() => setLang('en')}>EN</button>
        <button type="button" className={btnClass(lang === 'fr')} onClick={() => setLang('fr')}>FR</button>
      </div>
    </div>
  )
}
