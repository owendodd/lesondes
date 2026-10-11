'use client'

import Link from 'next/link'
import { siteFigmaTextClass, siteFigmaBarHeightClass } from '@/lib/siteSpacing'

export function FooterBar({ contactEmail }: { contactEmail: string }) {
  return (
    <footer className={`relative z-10 bg-[#eadecf] flex flex-wrap items-center gap-4 px-8 max-[740px]:px-4 ${siteFigmaBarHeightClass} ${siteFigmaTextClass}`}>
      <a href={`mailto:${contactEmail}`} className="text-inherit no-underline">
        {contactEmail}
      </a>
      <a
        href="https://www.instagram.com/les.ondes.cerbere"
        target="_blank"
        rel="noopener noreferrer"
        className="text-inherit no-underline"
      >
        @les.ondes.cerbere
      </a>
      <Link href="/newsletter" scroll={false} className="text-inherit no-underline">
        Newsletter
      </Link>
    </footer>
  )
}
