'use client'

import { type PointerEvent, type MouseEvent, useRef } from 'react'

interface Photo {
  url: string
  width: number
  height: number
}

export function ArchiveCarousel({ photos }: { photos: Photo[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, scrollStart: 0, moved: false })
  const snapRestoreRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function slideTargets(track: HTMLDivElement) {
    const children = Array.from(track.children) as HTMLElement[]
    const base = children[0]?.offsetLeft ?? 0
    return children.map(c => c.offsetLeft - base)
  }

  function advance(dir: 1 | -1) {
    const track = trackRef.current
    if (!track || photos.length <= 1) return
    const targets = slideTargets(track)
    const current = targets.reduce((best, t, i) => (
      Math.abs(t - track.scrollLeft) < Math.abs(targets[best] - track.scrollLeft) ? i : best
    ), 0)
    const maxScroll = track.scrollWidth - track.clientWidth
    const atEnd = track.scrollLeft >= maxScroll - 4
    if (dir === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }
    const next = Math.min(Math.max(current + dir, 0), targets.length - 1)
    track.scrollTo({ left: targets[next], behavior: 'smooth' })
  }

  // Mouse drag-to-scroll; touch uses native scrolling + CSS snap
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse') return
    const track = trackRef.current
    if (!track) return
    if (snapRestoreRef.current) clearTimeout(snapRestoreRef.current)
    drag.current = { active: true, startX: e.clientX, scrollStart: track.scrollLeft, moved: false }
    track.style.scrollSnapType = 'none' // snap fights manual scrollLeft while dragging
    track.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current
    if (!track || !drag.current.active) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 5) drag.current.moved = true
    track.scrollLeft = drag.current.scrollStart - dx
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current
    if (!track || !drag.current.active) return
    drag.current.active = false
    track.releasePointerCapture(e.pointerId)
    if (drag.current.moved) {
      const targets = slideTargets(track)
      const nearestTo = (x: number) => targets.reduce((best, t, i) => (
        Math.abs(t - x) < Math.abs(targets[best] - x) ? i : best
      ), 0)
      // a deliberate drag advances one slide in its direction; a nudge settles back
      const dx = track.scrollLeft - drag.current.scrollStart
      const idx = Math.abs(dx) > 40
        ? Math.min(Math.max(nearestTo(drag.current.scrollStart) + (dx > 0 ? 1 : -1), 0), targets.length - 1)
        : nearestTo(track.scrollLeft)
      track.scrollTo({ left: targets[idx], behavior: 'smooth' })
    }
    snapRestoreRef.current = setTimeout(() => {
      if (trackRef.current) trackRef.current.style.scrollSnapType = ''
    }, 400)
  }

  function onClick(e: MouseEvent<HTMLDivElement>) {
    if (drag.current.moved) {
      drag.current.moved = false
      return
    }
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    advance(e.clientX - rect.left < rect.width * 0.25 ? -1 : 1)
  }

  if (!photos.length) return null

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
      className="flex gap-2 overflow-x-auto snap-x snap-mandatory cursor-pointer select-none w-full px-8 max-[740px]:px-4 scroll-pl-8 max-[740px]:scroll-pl-4 [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >
      {photos.map((photo, i) => (
        <div key={photo.url} className="shrink-0 snap-start h-[min(596px,42vw)] max-[740px]:h-[60vw]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${photo.url}?h=1200&q=80&auto=format`}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            draggable={false}
            className="h-full w-auto max-w-none select-none pointer-events-none object-cover"
          />
        </div>
      ))}
    </div>
  )
}
