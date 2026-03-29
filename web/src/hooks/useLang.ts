'use client'

import { useContext } from 'react'
import { LangContext } from '@/components/LangProvider'

export function useLang() {
  return useContext(LangContext)
}
