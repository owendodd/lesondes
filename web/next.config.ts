import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const appDir = path.dirname(fileURLToPath(import.meta.url))
/** Monorepo root (`lesondes/`) — `sanity.config.ts` imports `../studio-lesondes`; root must include that path */
const turbopackRoot = path.join(appDir, '..')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'cdn.sanity.io' }],
  },
  turbopack: {
    root: turbopackRoot,
  },
  async redirects() {
    return [
      {
        source: '/studio',
        destination: '/studio/structure',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
