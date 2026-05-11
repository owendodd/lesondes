import { createClient } from 'next-sanity'
import { cache } from 'react'
import { SITE_CONFIG_QUERY, ALL_HERO_IMAGES_QUERY } from '@/lib/queries'
import type { SiteConfig } from '@/lib/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  /** API origin is often more stable in dev than the CDN (fewer flaky ECONNRESETs) */
  useCdn: process.env.NODE_ENV === 'production',
})

function isRetriableFetchError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const message = 'message' in error ? String((error as Error).message) : ''
  if (message.includes('fetch failed')) return true

  let cursor: unknown = error
  for (let d = 0; d < 4 && cursor && typeof cursor === 'object'; d++) {
    const code =
      'code' in cursor && typeof (cursor as { code?: unknown }).code === 'string'
        ? (cursor as { code: string }).code
        : ''
    if (['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'EPIPE', 'UND_ERR_SOCKET'].includes(code)) {
      return true
    }
    cursor = 'cause' in cursor ? (cursor as { cause?: unknown }).cause : undefined
  }
  return false
}

/**
 * Retries transient TLS/TCP failures (common as `TypeError: fetch failed` / ECONNRESET against Sanity).
 */
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  /** e.g. `{ next: { revalidate: 60 } }` — cast matches next-sanity’s strict overloads */
  options?: Record<string, unknown>,
): Promise<T> {
  const maxAttempts = 4
  let last: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return (await client.fetch(query, params ?? {}, options as never)) as T
    } catch (e) {
      last = e
      if (!isRetriableFetchError(e) || attempt === maxAttempts - 1) throw e
      await new Promise(r => setTimeout(r, 300 * 2 ** attempt))
    }
  }
  throw last
}

/** Dedupes between `(site)/layout` and `(site)/page` in a single request — one Sanity round-trip for config */
export const getSiteConfig = cache(() =>
  sanityFetch<SiteConfig | null>(SITE_CONFIG_QUERY, {}, { next: { revalidate: 60 } }),
)

type SanityImage = { asset: { _ref: string }; hotspot?: object; crop?: object }

/** All per-page hero images in one round-trip */
export const getAllHeroImages = cache(() =>
  sanityFetch<{
    home:          SanityImage | null
    homeCarousel:  SanityImage[] | null
    info:          SanityImage | null
    accommodation: SanityImage | null
    tickets:       SanityImage | null
    access:        SanityImage | null
  } | null>(ALL_HERO_IMAGES_QUERY, {}, { next: { revalidate: 60 } }),
)
