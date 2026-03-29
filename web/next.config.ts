import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const appDir = path.dirname(fileURLToPath(import.meta.url))
/** Monorepo root (`lesondes/`) — `sanity.config.ts` imports `../studio-lesondes`; root must include that path */
const turbopackRoot = path.join(appDir, '..')

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
}

export default nextConfig
