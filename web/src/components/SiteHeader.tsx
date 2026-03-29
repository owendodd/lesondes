'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLang } from '@/hooks/useLang'
import type { SiteConfig } from '@/lib/types'

const headerClass =
  'fixed top-0 right-0 left-0 z-[1] flex items-baseline justify-center gap-[clamp(40px,4.85vw,68px)] px-6 pt-[120px] pb-[120px] text-[clamp(40px,5.4vw,68px)] font-normal leading-[1.1] tracking-[-0.02em] filter-[url(#roughen)] max-[740px]:px-5 max-[740px]:py-12 max-[740px]:text-[clamp(28px,9vw,48px)]'

const linkClass =
  'flex w-full cursor-pointer items-baseline justify-center gap-[clamp(40px,4.85vw,68px)] text-inherit no-underline max-[740px]:flex-wrap max-[740px]:gap-[clamp(12px,4vw,32px)]'

export function SiteHeader({ config }: { config: SiteConfig }) {
  const { lang } = useLang()
  const headerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const locationRef = useRef<HTMLParagraphElement>(null)
  const datesRef = useRef<HTMLParagraphElement>(null)

  // Offset page content below fixed header
  useEffect(() => {
    function setOffset() {
      if (headerRef.current) {
        document.body.style.paddingTop = headerRef.current.offsetHeight + 'px'
      }
    }
    setOffset()
    window.addEventListener('resize', setOffset)
    return () => window.removeEventListener('resize', setOffset)
  }, [])

  // Typewriter animation
  useEffect(() => {
    const texts = [config.title, config.location, config.datesEn]
    const els = [titleRef.current, locationRef.current, datesRef.current]
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

    els.forEach((el, i) => {
      setTimeout(() => {
        const spans = el?.querySelectorAll('span')
        if (!spans || spans.length === 0) return
        const spanList = spans
        let j = 0
        function typeChar() {
          if (j >= spanList.length) return
          spanList[j].style.visibility = 'visible'
          j++
          setTimeout(typeChar, charDelay)
        }
        typeChar()
      }, startTimes[i])
    })
  }, [config.title, config.location, config.datesEn])

  const dates = lang === 'fr' ? config.datesFr : config.datesEn

  return (
    <header className={headerClass} ref={headerRef}>
      <Link href="/" className={linkClass}>
        <p ref={titleRef}>{config.title}</p>
        <p ref={locationRef}>{config.location}</p>
        <p ref={datesRef}>{dates}</p>
      </Link>
    </header>
  )
}
