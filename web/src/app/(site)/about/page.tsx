import type { Metadata } from 'next'
import { AboutText } from '@/components/AboutText'

export const metadata: Metadata = {
  title: 'LES ONDES — About',
}

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col px-4 pt-4">
      <AboutText />
    </div>
  )
}
