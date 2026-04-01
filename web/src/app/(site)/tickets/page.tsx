'use client'

import { siteContainerClass, sitePageGapClass } from '@/lib/siteSpacing'
import { useEffect, useRef } from 'react'

const pageClass = `${siteContainerClass} flex flex-col ${sitePageGapClass} pt-0 pb-[120px] max-[740px]:pb-16`

export default function TicketsPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== 'https://www.helloasso.com') return
      const dataHeight = e.data?.height
      const iframe = iframeRef.current
      if (dataHeight && iframe && dataHeight > parseFloat(iframe.style.height || '0')) {
        iframe.style.height = dataHeight + 'px'
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className={pageClass}>
      <iframe
        ref={iframeRef}
        id="haWidget"
        allowTransparency={true}
        scrolling="auto"
        src="https://www.helloasso.com/associations/les-ondes/evenements/les-ondes-cerbere-2026/widget"
        style={{ width: '100%', height: '1050px', border: 'none' }}
      />
    </div>
  )
}
