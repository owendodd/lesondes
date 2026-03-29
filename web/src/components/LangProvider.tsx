'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'

interface LangContextValue {
  lang: 'en' | 'fr'
  setLang: (lang: 'en' | 'fr') => void
}

export const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<'en' | 'fr'>('en')

  useEffect(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'fr') setLangState('fr')
  }, [])

  function setLang(l: 'en' | 'fr') {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}
