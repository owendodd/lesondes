'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from '@/lib/sanity'

type SanityImageRef = { asset: { _ref: string }; hotspot?: object; crop?: object }

const builder = createImageUrlBuilder(client)

export function HomeCarousel({ images }: { images: SanityImageRef[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  function advance() {
    const track = trackRef.current
    if (!track || images.length <= 1) return
    const firstSlide = track.children[0] as HTMLElement
    if (!firstSlide) return
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
    if (atEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      track.scrollBy({ left: firstSlide.offsetWidth + 8, behavior: 'smooth' })
    }
  }

  if (!images.length) return null

  return (
    <div
      ref={trackRef}
      onClick={advance}
      className="flex gap-2 overflow-x-auto snap-x snap-mandatory cursor-pointer select-none w-full pl-10 pr-10 max-[740px]:pl-4 max-[740px]:pr-4 scroll-pl-10 max-[740px]:scroll-pl-4 [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >
      {images.map((image, i) => {
        const url = builder.image(image).auto('format').width(1920).url()
        return (
          <div key={i} className="flex-shrink-0 snap-start h-[640px] max-[740px]:h-[260px]">
            <Image
              src={url}
              alt=""
              width={1920}
              height={1280}
              className="h-full w-auto max-w-none select-none pointer-events-none"
              priority={i === 0}
              draggable={false}
            />
          </div>
        )
      })}
    </div>
  )
}
