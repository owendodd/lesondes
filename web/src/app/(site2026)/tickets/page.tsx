'use client'

import { useEffect, useRef } from 'react'

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
    <div className="px-10 max-[740px]:px-4 pb-8">
      <div className="filter-none">
        <iframe
          ref={iframeRef}
          id="haWidget"
          allowTransparency={true}
          scrolling="auto"
          src="https://www.helloasso.com/associations/les-ondes/evenements/les-ondes-cerbere-2026/widget"
          style={{ width: '100%', height: '1050px', border: 'none' }}
        />
      </div>
    </div>
  )
}
