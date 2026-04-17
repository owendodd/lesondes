'use client'

import { usePathname } from 'next/navigation'
import { HeroImage } from '@/components/HeroImage'

type SanityImageRef = { asset: { _ref: string }; hotspot?: object; crop?: object }

interface HeroImages {
  home:          SanityImageRef | null
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
  const key = pathnameToKey[pathname] ?? 'home'
  const image = images?.[key] ?? null

  if (!image) return null
  return <HeroImage image={image} />
}
