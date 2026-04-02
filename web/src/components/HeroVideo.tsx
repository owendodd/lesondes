'use client'

import { useEffect, useRef } from 'react'

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true
    const tryPlay = () => { video.play().catch(() => {}) }
    if (video.readyState >= 3) {
      tryPlay()
    } else {
      video.addEventListener('canplay', tryPlay, { once: true })
    }
    return () => video.removeEventListener('canplay', tryPlay)
  }, [])

  return (
    <div className="flex justify-center px-6">
      <video
        ref={ref}
        className="block aspect-[3/2] w-[720px] object-cover max-[740px]:w-full"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // @ts-ignore — webkit-specific attribute for older iOS Safari
        webkit-playsinline="true"
      >
        <source src="/video/WebBg.webm" type="video/webm" />
      </video>
    </div>
  )
}
