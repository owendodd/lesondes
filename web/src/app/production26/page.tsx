import type { Metadata } from 'next'
import { RunSheet } from './RunSheet'

export const metadata: Metadata = {
  title: 'Run Sheet — Les Ondes 2026',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <RunSheet />
}
