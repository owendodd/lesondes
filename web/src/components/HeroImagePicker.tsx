'use client'

import { usePathname } from 'next/navigation'
import { HeroImage } from '@/components/HeroImage'
import { HomeCarousel } from '@/components/HomeCarousel'

type SanityImageRef = { asset: { _ref: string }; hotspot?: object; crop?: object }

interface HeroImages {
  home:          SanityImageRef | null
  homeCarousel:  SanityImageRef[] | null
  info:          SanityImageRef | null
  accommodation: SanityImageRef | null
  tickets:       SanityImageRef | null
  access:        SanityImageRef | null
}

const pathnameToKey: Record<string, keyof HeroImages> = {
  '/':              'home',
  '/info':          'info',
  '/accommodation': 'accommodation',
  '/tickets':       'tickets',
  '/access':        'access',
}

export function HeroImagePicker({ images }: { images: HeroImages | null }) {
  const pathname = usePathname()

  if (pathname === '/') {
    const carouselImages = images?.homeCarousel
    if (carouselImages?.length) return <HomeCarousel images={carouselImages} />
    const single = images?.home
    if (single) return <div className="px-10 max-[740px]:px-0"><HeroImage image={single} /></div>
    return null
  }

  const key = pathnameToKey[pathname]
  const image = key ? (images?.[key] ?? null) : null
  if (!image || Array.isArray(image)) return null
  return <div className="px-10 max-[740px]:px-0"><HeroImage image={image} /></div>
}
