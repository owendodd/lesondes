/**
 * record-ig.mjs
 * Records the /ig animation at native 1080×1350 using Playwright.
 *
 * Usage:
 *   node scripts/record-ig.mjs              # records 1 full cycle (~22s)
 *   node scripts/record-ig.mjs --loops 3    # records 3 full cycles (~60s)
 *   node scripts/record-ig.mjs --url http://localhost:3001/ig
 *
 * Prerequisites:
 *   npm install -D playwright
 *   npx playwright install chromium
 *   Then start your dev server: npm run dev
 */

import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Config ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const getArg = (flag) => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : null
}

const URL     = getArg('--url')   ?? 'http://localhost:3000/ig'
const LOOPS   = parseInt(getArg('--loops') ?? '1', 10)
const WIDTH   = 1080
const HEIGHT  = 1350

// One full cycle duration (ms) — calculated from the animation timings in page.tsx:
//   Slide 1 → Slide 2: ~3 780ms
//   Slide 2 → Slide 3: ~7 474ms
//   Slide 3 → Slide 1: ~7 648ms
//   Total one cycle:   ~18 902ms  (+1 100ms buffer)
const ONE_CYCLE_MS = 20_000
const RECORD_MS    = ONE_CYCLE_MS * LOOPS

const outDir = path.join(__dirname, '..', 'recordings')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

// ── Main ────────────────────────────────────────────────────────────────────

console.log(`Recording ${LOOPS} cycle(s) — ${RECORD_MS / 1000}s total`)
console.log(`Output: ${outDir}/`)

const browser = await chromium.launch({
  headless: true,
  args: ['--autoplay-policy=no-user-gesture-required'],
})

const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  recordVideo: {
    dir: outDir,
    size: { width: WIDTH, height: HEIGHT },
  },
  // Allow autoplay without user gesture (needed for the background video)
  bypassCSP: true,
})

const page = await context.newPage()

// Suppress console noise from the page
page.on('console', () => {})
page.on('pageerror', () => {})

await page.goto(URL, { waitUntil: 'networkidle' })

// Give fonts and the background video a moment to initialise
await page.waitForTimeout(800)

// ── Patch the page for clean capture ────────────────────────────────────────
await page.evaluate(({ w, h }) => {
  // 1. Remove the viewport-fit scaling — at 1080×1350 the scale would be 0.9,
  //    leaving grey bands. Force scale(1) so the canvas fills the viewport exactly.
  const post = document.querySelector('[style*="transformOrigin"]')
  if (post) post.style.transform = 'scale(1)'

  // 2. Remove the dynamic body height that the resize handler sets.
  document.body.style.height = `${h}px`

  // 3. Hide the control buttons so they don't appear in the recording.
  const controls = document.querySelector('[style*="position: fixed"]')
  if (controls) controls.style.display = 'none'

  // 4. Make the outer wrapper fill the viewport without scroll.
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  document.body.style.margin = '0'
}, { w: WIDTH, h: HEIGHT })

// ── Start the animation ──────────────────────────────────────────────────────
// The "start" button text is 'start' when idle
await page.locator('button', { hasText: /^start$/ }).click()

console.log('Animation started — recording…')
await page.waitForTimeout(RECORD_MS)

// ── Finalise ─────────────────────────────────────────────────────────────────
const videoPath = await page.video()?.path()
await context.close()
await browser.close()

// Rename from the random Playwright filename to something useful
if (videoPath) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const ext = path.extname(videoPath)          // .webm
  const dest = path.join(outDir, `les-ondes-ig-${ts}${ext}`)
  fs.renameSync(videoPath, dest)
  console.log(`\nDone! Saved to:\n  ${dest}`)
  console.log('\nTip: convert to MP4 with ffmpeg:')
  console.log(`  ffmpeg -i "${dest}" -c:v libx264 -crf 18 -pix_fmt yuv420p "${dest.replace(ext, '.mp4')}"`)
} else {
  console.log('\nDone! Check the recordings/ folder.')
}
