/**
 * record-ig.mjs
 * Records the /ig animation clipped to the 1080×1350 white container.
 * Captures frames at native speed, computes actual framerate, then encodes
 * to H.264 MP4 at the correct playback speed.
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
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Config ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const getArg = (flag) => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : null
}

const URL      = getArg('--url')   ?? 'http://localhost:3000/ig'
const LOOPS    = parseInt(getArg('--loops') ?? '1', 10)
const WIDTH    = 1080
const HEIGHT   = 1350

const ONE_CYCLE_MS = 20_000
const RECORD_MS    = ONE_CYCLE_MS * LOOPS

const outDir = path.join(__dirname, '..', 'recordings')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

const ts      = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const tmpDir  = path.join(outDir, `tmp_${ts}`)
const outFile = path.join(outDir, `les-ondes-ig-${ts}.mp4`)

fs.mkdirSync(tmpDir)

// ── Browser ──────────────────────────────────────────────────────────────────

console.log(`Recording ${LOOPS} cycle(s) — ${RECORD_MS / 1000}s`)
console.log(`Output: ${outFile}`)

const browser = await chromium.launch({
  headless: true,
  args: ['--autoplay-policy=no-user-gesture-required'],
})

const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
})

const page = await context.newPage()
page.on('console', () => {})
page.on('pageerror', () => {})

await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

// ── Patch the page ───────────────────────────────────────────────────────────
await page.evaluate(({ w, h }) => {
  const post = document.querySelector('[style*="transform-origin"]')
  if (post) post.style.transform = 'scale(1)'
  document.body.style.height   = `${h}px`
  document.body.style.margin   = '0'
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
  const controls = document.querySelector('[style*="position: fixed"]')
  if (controls) controls.style.display = 'none'
}, { w: WIDTH, h: HEIGHT })

// Clip to the white container
const clip = await page.evaluate(() => {
  const post = document.querySelector('[style*="transform-origin"]')
  if (!post) return { x: 0, y: 0, width: 1080, height: 1350 }
  const r = post.getBoundingClientRect()
  return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }
})

console.log(`Clip: ${clip.width}×${clip.height} at (${clip.x}, ${clip.y})`)

// ── Start animation ──────────────────────────────────────────────────────────
await page.locator('button', { hasText: /^start$/ }).click()
console.log('Animation started — capturing frames…')

// ── Capture loop ─────────────────────────────────────────────────────────────
// Capture as fast as possible; real framerate computed from actual elapsed time.
const captureStart = Date.now()
let frameCount = 0

while (Date.now() - captureStart < RECORD_MS) {
  const buf = await page.screenshot({ clip, type: 'png' })
  fs.writeFileSync(path.join(tmpDir, `frame_${String(frameCount).padStart(6, '0')}.png`), buf)
  frameCount++
  if (frameCount % 10 === 0) {
    const elapsed = ((Date.now() - captureStart) / 1000).toFixed(1)
    process.stdout.write(`\r  ${frameCount} frames — ${elapsed}s elapsed`)
  }
}

const actualDuration = (Date.now() - captureStart) / 1000
const inputFPS = frameCount / actualDuration
process.stdout.write(`\n`)
console.log(`Captured ${frameCount} frames in ${actualDuration.toFixed(1)}s (${inputFPS.toFixed(1)} fps)`)

await context.close()
await browser.close()

// ── Encode ────────────────────────────────────────────────────────────────────
// Tell ffmpeg the real input framerate so playback speed is exactly 1×.
// Output at 30fps (duplicates frames as needed).
console.log('Encoding…')

await new Promise((resolve, reject) => {
  const ff = spawn('ffmpeg', [
    '-y',
    '-framerate', String(inputFPS),
    '-i',         path.join(tmpDir, 'frame_%06d.png'),
    '-r',         '30',
    '-c:v',       'libx264',
    '-crf',       '15',
    '-preset',    'medium',
    '-pix_fmt',   'yuv420p',
    outFile,
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
  ff.stderr.on('data', () => {})
  ff.on('close', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)))
})

// ── Cleanup ───────────────────────────────────────────────────────────────────
fs.rmSync(tmpDir, { recursive: true })

console.log(`\nDone! Saved to:\n  ${outFile}`)
