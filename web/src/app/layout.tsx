import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const diatype = localFont({
  src: [
    { path: '../../public/fonts/ABCDiatype-Medium.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/ABCDiatype-Medium.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-diatype',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LES ONDES',
  description: 'Les Ondes — Cerbère, May 29 30 31',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={diatype.variable}>
      <body className="bg-white font-normal font-sans text-black antialiased">{children}</body>
    </html>
  )
}
