'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useLang } from '@/hooks/useLang'
import type { SiteConfig } from '@/lib/types'

const headerClass =
  'fixed top-0 right-0 left-0 z-[1] flex items-baseline justify-center gap-[clamp(40px,4.85vw,68px)] px-6 pt-[120px] pb-[120px] text-[clamp(40px,5.4vw,68px)] font-normal leading-[1.1] tracking-[-0.02em] filter-[url(#roughen)] max-[740px]:px-5 max-[740px]:py-12 max-[740px]:text-[clamp(28px,9vw,48px)]'

const wrapClass =
  'flex w-full items-baseline justify-center gap-[clamp(40px,4.85vw,68px)] max-[740px]:flex-wrap max-[740px]:gap-[clamp(12px,4vw,32px)]'

const homeLinkClass = 'cursor-pointer text-inherit no-underline'
const locationLinkClass = 'cursor-pointer text-inherit no-underline'

export function SiteHeader({ config }: { config: SiteConfig }) {
  const { lang } = useLang()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const titleRef = useRef<HTMLParagraphElement>(null)
  const locationRef = useRef<HTMLParagraphElement>(null)
  const datesRef = useRef<HTMLParagraphElement>(null)

  const dates = lang === 'fr' ? config.datesFr : config.datesEn

  // Typewriter animation (home page only)
  useEffect(() => {
    const texts = [config.title, config.location, dates]
    const els = [titleRef.current, locationRef.current, datesRef.current]

    if (!isHome) {
      // Restore plain text in case we navigated away from home mid-animation
      els.forEach((el, i) => { if (el) el.textContent = texts[i] })
      return
    }

    const charDelay = 60
    const pauseAfter = [280, 180]

    els.forEach((el, i) => {
      if (!el) return
      el.innerHTML = ''
      for (let k = 0; k < texts[i].length; k++) {
        const sp = document.createElement('span')
        sp.textContent = texts[i][k]
        sp.style.visibility = 'hidden'
        el.appendChild(sp)
      }
    })

    let cursor = 400
    const startTimes: number[] = []
    texts.forEach((text, i) => {
      startTimes.push(cursor)
      cursor += text.length * charDelay + (pauseAfter[i] || 0)
    })

    const timeouts: ReturnType<typeof setTimeout>[] = []

    els.forEach((el, i) => {
      const t = setTimeout(() => {
        const spans = el?.querySelectorAll('span')
        if (!spans || spans.length === 0) return
        const spanList = spans
        let j = 0
        function typeChar() {
          if (j >= spanList.length) return
          spanList[j].style.visibility = 'visible'
          j++
          timeouts.push(setTimeout(typeChar, charDelay))
        }
        typeChar()
      }, startTimes[i])
      timeouts.push(t)
    })

    return () => timeouts.forEach(clearTimeout)
  }, [isHome, config.title, config.location, dates])

  return (
    <header className={headerClass}>
      <div className={wrapClass}>
        <Link href="/" className={homeLinkClass}><p ref={titleRef}>{config.title}</p></Link>
        {config.locationUrl
          ? <a href={config.locationUrl} target="_blank" rel="noopener noreferrer" className={locationLinkClass}><p ref={locationRef}>{config.location}</p></a>
          : <p ref={locationRef}>{config.location}</p>
        }
        <Link href="/" className={homeLinkClass}><p ref={datesRef}>{dates}</p></Link>
      </div>
    </header>
  )
}
