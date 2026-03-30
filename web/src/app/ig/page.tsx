'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

// ── Recording helpers ────────────────────────────────────────────────────────

function getSupportedMimeType() {
  const types = ['video/mp4', 'video/webm;codecs=vp9', 'video/webm']
  return types.find(t => MediaRecorder.isTypeSupported(t)) ?? ''
}

function mimeToExt(mime: string) {
  if (mime.startsWith('video/mp4')) return 'mp4'
  return 'webm'
}

// ── Slide data ──────────────────────────────────────────────────────────────

interface LineDef {
  id: string
  text: string
  charDelay: number
  spaceExtra?: number
  pauseAfter: number
  startDelay?: number
}

interface SlideDef {
  id: string
  lines: LineDef[]
  nextOverlap: number
}

const SLIDES: SlideDef[] = [
  {
    id: 'slide-1',
    nextOverlap: -600,
    lines: [
      { id: 't-title',   text: 'LES ONDES',    charDelay: 80, pauseAfter: 60 },
      { id: 't-cerbere', text: 'Cerbère',       charDelay: 60, pauseAfter: 60 },
      { id: 'dates',     text: 'May 29 30 31',  charDelay: 50, spaceExtra: 60, pauseAfter: 0 },
    ],
  },
  {
    id: 'slide-2',
    nextOverlap: -600,
    lines: [
      { id: 'a1', text: 'Miriam Adefris',   charDelay: 40, pauseAfter: 80  },
      { id: 'a2', text: 'Pierre Bastien',   charDelay: 35, pauseAfter: 100 },
      { id: 'a3', text: 'Lukas de Clerck',  charDelay: 45, pauseAfter: 70  },
      { id: 'a4', text: 'Maya Dhondt',      charDelay: 32, pauseAfter: 120 },
      { id: 'a5', text: 'Mats Erlandsson',  charDelay: 42, pauseAfter: 90  },
      { id: 'a6', text: 'Elisabeth Klinck', charDelay: 45, pauseAfter: 0   },
    ],
  },
  {
    id: 'slide-3',
    nextOverlap: -200,
    lines: [
      { id: 'b1', text: 'Louis Laurain',           charDelay: 38, pauseAfter: 90  },
      { id: 'b2', text: 'Lubomyr Melnyk',          charDelay: 32, pauseAfter: 70  },
      { id: 'b3', text: 'Chantal Michelle',        charDelay: 44, pauseAfter: 100 },
      { id: 'b4', text: 'Mohammad Reza Mortazavi', charDelay: 30, pauseAfter: 80  },
      { id: 'b5', text: 'Fredrik Rasten',          charDelay: 50, pauseAfter: 90  },
      { id: 'b6', text: 'Youmna Saba',             charDelay: 28, pauseAfter: 0   },
    ],
  },
]

// ── Animation helpers ────────────────────────────────────────────────────────

function layoutSpaceSet(text: string): Set<number> {
  const s = new Set<number>()
  let i = 0
  while (i < text.length && text[i] === ' ') s.add(i++)
  i = text.length - 1
  while (i >= 0 && text[i] === ' ') s.add(i--)
  for (let j = 0; j < text.length; j++) {
    if (text[j] === '\n') {
      let k = j - 1
      while (k >= 0 && text[k] === ' ') s.add(k--)
      k = j + 1
      while (k < text.length && text[k] === ' ') s.add(k++)
    }
  }
  return s
}

function initLineSpans(lineId: string, text: string) {
  const el = document.getElementById(lineId)
  if (!el) return
  el.innerHTML = ''
  const layout = layoutSpaceSet(text)
  let i = 0
  for (const ch of text) {
    if (ch === '\n') {
      el.appendChild(document.createElement('br'))
    } else {
      const sp = document.createElement('span')
      sp.textContent = ch
      sp.style.visibility = layout.has(i) ? 'visible' : 'hidden'
      el.appendChild(sp)
    }
    i++
  }
}

interface AnimEvent { time: number; fn: () => void }

function buildTimeline(slide: SlideDef, vis: 'visible' | 'hidden'): { events: AnimEvent[]; duration: number } {
  const events: AnimEvent[] = []
  let cursor = 0

  for (const line of slide.lines) {
    cursor += line.startDelay ?? 0
    let t = cursor
    let charIdx = 0
    const layout = layoutSpaceSet(line.text)
    let i = 0
    for (const ch of line.text) {
      if (ch !== '\n') {
        if (!layout.has(i)) {
          const idx = charIdx
          const id = line.id
          events.push({
            time: t,
            fn: () => {
              const spans = document.getElementById(id)?.querySelectorAll('span')
              if (spans?.[idx]) spans[idx].style.visibility = vis
            },
          })
          t += line.charDelay + (ch === ' ' ? (line.spaceExtra ?? 0) : 0)
        }
        charIdx++
      }
      i++
    }
    cursor = t + line.pauseAfter
  }

  return { events, duration: cursor }
}

// ── Asset helpers ────────────────────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

interface AssetOpts {
  text: string
  fontSize: number
  fontWeight: 400 | 700
  letterSpacingEm: number
  textColor: string
  filterEnabled: boolean
  filterScale: number
  width: number
  height: number
}

// Build an SVG string with fonts embedded as base64 — used as an intermediate
// for canvas rendering so the browser can apply the font and filter correctly.
async function buildSvgForRender(opts: AssetOpts): Promise<string> {
  const { text, fontSize, fontWeight, letterSpacingEm, textColor, filterEnabled, filterScale, width, height } = opts

  const [mediumBuf, heavyBuf] = await Promise.all([
    fetch('/fonts/ABCDiatype-Medium-Trial.woff2').then(r => r.arrayBuffer()),
    fetch('/fonts/ABCDiatype-Heavy-Trial.woff2').then(r => r.arrayBuffer()),
  ])

  const toBase64 = (buf: ArrayBuffer) => {
    let binary = ''
    const bytes = new Uint8Array(buf)
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
    return btoa(binary)
  }

  const mediumB64 = toBase64(mediumBuf)
  const heavyB64 = toBase64(heavyBuf)

  const lines = text.split('\n')
  const lineHeight = fontSize * 1.2
  const totalGroupHeight = (lines.length - 1) * lineHeight
  const startY = height / 2 - totalGroupHeight / 2

  const filterDef = filterEnabled ? `
    <filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="4" seed="8" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="${filterScale}" xChannelSelector="R" yChannelSelector="G"/>
    </filter>` : ''

  const filterAttr = filterEnabled ? ' filter="url(#roughen)"' : ''
  const lsPx = letterSpacingEm * fontSize

  const textEls = lines.map((line, i) =>
    `  <text x="${width / 2}" y="${startY + i * lineHeight}" font-family="ABCDiatype, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" letter-spacing="${lsPx}" fill="${escapeXml(textColor)}" text-anchor="middle" dominant-baseline="middle"${filterAttr}>${escapeXml(line)}</text>`
  ).join('\n')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @font-face { font-family: 'ABCDiatype'; src: url('data:font/woff2;base64,${mediumB64}') format('woff2'); font-weight: 400; }
      @font-face { font-family: 'ABCDiatype'; src: url('data:font/woff2;base64,${heavyB64}') format('woff2'); font-weight: 700; }
    </style>${filterDef}
  </defs>
  ${textEls}
</svg>`
}

// Render the SVG via canvas — this bakes in the font and filter as pixels,
// giving correct output regardless of the viewer's font/filter support.
async function renderToPng(opts: AssetOpts): Promise<Blob> {
  const svgStr = await buildSvgForRender(opts)
  const blob = new Blob([svgStr], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = opts.width * 4
      canvas.height = opts.height * 4
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, opts.width * 4, opts.height * 4)
      URL.revokeObjectURL(url)
      canvas.toBlob(png => {
        if (png) resolve(png)
        else reject(new Error('canvas export failed'))
      }, 'image/png')
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('svg render failed')) }
    img.src = url
  })
}

// ── Canvas size presets ──────────────────────────────────────────────────────

const CANVAS_PRESETS = [
  { label: '1:1 post',  w: 1080, h: 1080 },
  { label: '4:5 post',  w: 1080, h: 1350 },
  { label: '9:16 story', w: 1080, h: 1920 },
]

// ── Component ────────────────────────────────────────────────────────────────

export default function IgPage() {
  // ── Animation state ──────────────────────────────────────────────────────
  const postRef = useRef<HTMLDivElement>(null)
  const runIdRef = useRef(0)
  const runningRef = useRef(false)
  const [isRunning, setIsRunning] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)

  // ── Tab state ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'animation' | 'assets'>('animation')

  // ── Asset state ──────────────────────────────────────────────────────────
  const assetRef = useRef<HTMLDivElement>(null)
  const [assetText, setAssetText] = useState('LES ONDES')
  const [fontSize, setFontSize] = useState(100)
  const [fontWeight, setFontWeight] = useState<400 | 700>(400)
  const [letterSpacingEm, setLetterSpacingEm] = useState(-0.02)
  const [textColor, setTextColor] = useState('#000000')
  const [filterEnabled, setFilterEnabled] = useState(true)
  const [filterScale, setFilterScale] = useState(2.4)
  const [canvasW, setCanvasW] = useState(1080)
  const [canvasH, setCanvasH] = useState(1080)
  const [exporting, setExporting] = useState(false)

  // ── Scale animation canvas ────────────────────────────────────────────────
  useEffect(() => {
    function scalePost() {
      if (!postRef.current || activeTab !== 'animation') return
      const scale = Math.min(
        (window.innerWidth  * 0.9) / 1080,
        (window.innerHeight * 0.9) / 1350,
      )
      postRef.current.style.transform = `scale(${scale})`
      document.body.style.height = `${1350 * scale + 80}px`
    }
    scalePost()
    window.addEventListener('resize', scalePost)
    return () => window.removeEventListener('resize', scalePost)
  }, [activeTab])

  // ── Scale asset canvas ────────────────────────────────────────────────────
  useEffect(() => {
    function scaleAsset() {
      if (!assetRef.current || activeTab !== 'assets') return
      const scale = Math.min(
        (window.innerWidth  * 0.9) / canvasW,
        (window.innerHeight * 0.9) / canvasH,
      )
      assetRef.current.style.transform = `scale(${scale})`
      document.body.style.height = `${canvasH * scale + 80}px`
    }
    scaleAsset()
    window.addEventListener('resize', scaleAsset)
    return () => window.removeEventListener('resize', scaleAsset)
  }, [activeTab, canvasW, canvasH])

  // ── Animation logic ───────────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    runningRef.current = false
    runIdRef.current++
    setIsRunning(false)
    SLIDES.forEach(s => s.lines.forEach(l => initLineSpans(l.id, l.text)))
  }, [])

  useEffect(() => {
    SLIDES.forEach(s => s.lines.forEach(l => initLineSpans(l.id, l.text)))
  }, [])

  const runSlide = useCallback((myRun: number, slideIdx: number) => {
    const slide = SLIDES[slideIdx]
    const nextIdx = (slideIdx + 1) % SLIDES.length
    slide.lines.forEach(l => initLineSpans(l.id, l.text))
    const { events: typeEvents, duration: typeDuration } = buildTimeline(slide, 'visible')
    typeEvents.forEach(e =>
      setTimeout(() => { if (runIdRef.current === myRun && runningRef.current) e.fn() }, e.time)
    )
    setTimeout(() => {
      if (runIdRef.current !== myRun || !runningRef.current) return
      const { events: unEvents, duration: unDuration } = buildTimeline(slide, 'hidden')
      unEvents.forEach(e =>
        setTimeout(() => { if (runIdRef.current === myRun && runningRef.current) e.fn() }, e.time)
      )
      const overlap = slide.nextOverlap ?? -2000
      setTimeout(() => {
        if (runIdRef.current === myRun && runningRef.current) runSlide(myRun, nextIdx)
      }, unDuration + overlap)
    }, typeDuration + 300)
  }, [])

  const handleStart = useCallback(() => {
    if (runningRef.current) {
      runningRef.current = false
      runIdRef.current++
      setIsRunning(false)
    } else {
      clearAll()
      runningRef.current = true
      setIsRunning(true)
      const myRun = runIdRef.current
      runSlide(myRun, 0)
    }
  }, [clearAll, runSlide])

  const handleRecord = useCallback(async () => {
    if (isRecording) {
      recorderRef.current?.stop()
      return
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 } as MediaTrackConstraints,
        audio: false,
      })
      const mimeType = getSupportedMimeType()
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      recorderRef.current = recorder
      chunksRef.current = []
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `les-ondes-ig.${mimeToExt(mimeType)}`
        a.click()
        URL.revokeObjectURL(url)
        setIsRecording(false)
      }
      stream.getVideoTracks()[0].addEventListener('ended', () => recorderRef.current?.stop(), { once: true })
      recorder.start()
      setIsRecording(true)
      if (!runningRef.current) {
        clearAll()
        runningRef.current = true
        setIsRunning(true)
        const myRun = runIdRef.current
        runSlide(myRun, 0)
      }
    } catch {
      // user cancelled dialog
    }
  }, [isRecording, clearAll, runSlide])

  // ── Asset export ──────────────────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    setExporting(true)
    try {
      const png = await renderToPng({
        text: assetText,
        fontSize,
        fontWeight,
        letterSpacingEm,
        textColor,
        filterEnabled,
        filterScale,
        width: canvasW,
        height: canvasH,
      })
      const url = URL.createObjectURL(png)
      const a = document.createElement('a')
      a.href = url
      a.download = 'les-ondes-asset.png'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }, [assetText, fontSize, fontWeight, letterSpacingEm, textColor, filterEnabled, filterScale, canvasW, canvasH])

  // ── Asset preview geometry ────────────────────────────────────────────────
  const lines = assetText.split('\n')
  const lineHeight = fontSize * 1.2
  const totalGroupHeight = (lines.length - 1) * lineHeight
  const startY = canvasH / 2 - totalGroupHeight / 2
  const lsPx = letterSpacingEm * fontSize

  return (
    <>
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves={4} seed={8} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="roughen-asset" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves={4} seed={8} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={filterScale} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Tab bar + controls */}
      <div style={{
        position: 'fixed', top: 'clamp(14px, 2vh, 28px)', left: 'clamp(14px, 2vw, 28px)',
        zIndex: 10, display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('animation')}
            style={{ ...btnStyle, ...(activeTab === 'animation' ? activeBtnStyle : {}) }}
          >
            animation
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            style={{ ...btnStyle, ...(activeTab === 'assets' ? activeBtnStyle : {}) }}
          >
            assets
          </button>
        </div>

        {/* Animation controls */}
        {activeTab === 'animation' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleStart} style={btnStyle}>{isRunning ? 'stop' : 'start'}</button>
            <button onClick={clearAll}    style={btnStyle}>reset</button>
            <button onClick={handleRecord} style={{ ...btnStyle, ...(isRecording ? { borderColor: 'red', color: 'red' } : {}) }}>
              {isRecording ? 'stop rec' : 'record'}
            </button>
          </div>
        )}

        {/* Asset controls */}
        {activeTab === 'assets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
            <textarea
              value={assetText}
              onChange={e => setAssetText(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }}
            />

            {/* Font weight */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setFontWeight(400)} style={{ ...btnStyle, ...(fontWeight === 400 ? activeBtnStyle : {}) }}>medium</button>
              <button onClick={() => setFontWeight(700)} style={{ ...btnStyle, ...(fontWeight === 700 ? activeBtnStyle : {}) }}>heavy</button>
            </div>

            <label style={labelStyle}>
              size
              <input
                type="number" value={fontSize} min={8} max={400} step={1}
                onChange={e => setFontSize(Number(e.target.value))}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              spacing
              <input
                type="number" value={letterSpacingEm} min={-0.1} max={0.5} step={0.01}
                onChange={e => setLetterSpacingEm(Number(e.target.value))}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              color
              <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={colorInputStyle} />
            </label>

            <label style={{ ...labelStyle, cursor: 'pointer' }}>
              filter
              <input
                type="checkbox" checked={filterEnabled}
                onChange={e => setFilterEnabled(e.target.checked)}
                style={{ accentColor: 'black' }}
              />
            </label>

            {filterEnabled && (
              <label style={labelStyle}>
                roughness
                <input
                  type="number" value={filterScale} min={0} max={20} step={0.1}
                  onChange={e => setFilterScale(Number(e.target.value))}
                  style={inputStyle}
                />
              </label>
            )}

            {/* Canvas size */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CANVAS_PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => { setCanvasW(p.w); setCanvasH(p.h) }}
                  style={{ ...btnStyle, ...(canvasW === p.w && canvasH === p.h ? activeBtnStyle : {}) }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button onClick={handleExport} disabled={exporting} style={{ ...btnStyle, marginTop: 4 }}>
              {exporting ? 'exporting…' : 'export png'}
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{
        fontFamily: 'var(--font-diatype), sans-serif',
        fontWeight: 400,
        background: '#e8e8e8',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        {/* Animation canvas */}
        {activeTab === 'animation' && (
          <div ref={postRef} style={{
            width: 1080,
            height: 1350,
            background: '#fff',
            transformOrigin: 'center center',
            flexShrink: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: 48,
            gap: 48,
          }}>
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <div id="slide-1" style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 48,
                filter: 'url(#roughen)',
              }}>
                <p id="t-title"   style={titleStyle} />
                <p id="t-cerbere" style={titleStyle} />
                <p id="dates"     style={titleStyle} />
              </div>

              <div id="slide-2" style={slideWrapStyle}>
                <div style={namesGridStyle}>
                  {['a1','a2','a3','a4','a5','a6'].map(id => (
                    <p key={id} id={id} style={nameStyle} />
                  ))}
                </div>
              </div>

              <div id="slide-3" style={slideWrapStyle}>
                <div style={namesGridStyle}>
                  {['b1','b2','b3','b4','b5','b6'].map(id => (
                    <p key={id} id={id} style={nameStyle} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <video style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                autoPlay muted loop playsInline>
                <source src="/video/SamFinal_web.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        )}

        {/* Asset preview */}
        {activeTab === 'assets' && (
          <div ref={assetRef} style={{
            transformOrigin: 'center center', flexShrink: 0,
            backgroundImage: 'repeating-conic-gradient(#ccc 0% 25%, #e8e8e8 0% 50%)',
            backgroundSize: '20px 20px',
          }}>
            <svg
              width={canvasW}
              height={canvasH}
              viewBox={`0 0 ${canvasW} ${canvasH}`}
              style={{ display: 'block' }}
            >
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={canvasW / 2}
                  y={startY + i * lineHeight}
                  fontFamily="var(--font-diatype), sans-serif"
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  letterSpacing={lsPx}
                  fill={textColor}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  filter={filterEnabled ? 'url(#roughen-asset)' : undefined}
                >
                  {line}
                </text>
              ))}
            </svg>
          </div>
        )}
      </div>
    </>
  )
}

// ── Inline style constants ────────────────────────────────────────────────────

const titleStyle: React.CSSProperties = {
  fontSize: 100, lineHeight: 1.1, letterSpacing: '-0.02em',
  color: '#000', whiteSpace: 'pre', textAlign: 'center',
  margin: 0,
}

const slideWrapStyle: React.CSSProperties = {
  position: 'absolute', inset: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  filter: 'url(#roughen)',
}

const namesGridStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  gap: 24, width: '100%',
}

const nameStyle: React.CSSProperties = {
  fontSize: 52, letterSpacing: '4.16px',
  textAlign: 'center', width: '100%',
  margin: 0,
}

const btnStyle: React.CSSProperties = {
  fontFamily: 'var(--font-diatype), sans-serif', fontWeight: 400,
  fontSize: 13, letterSpacing: '0.08em',
  background: 'none', border: '1px solid rgba(0,0,0,0.35)',
  padding: '5px 16px', cursor: 'pointer', color: 'black',
}

const activeBtnStyle: React.CSSProperties = {
  background: 'black', color: 'white', borderColor: 'black',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-diatype), sans-serif', fontWeight: 400,
  fontSize: 13, letterSpacing: '0.08em', color: 'black',
  display: 'flex', alignItems: 'center', gap: 8,
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-diatype), sans-serif', fontWeight: 400,
  fontSize: 13, letterSpacing: '0.08em',
  background: 'none', border: '1px solid rgba(0,0,0,0.35)',
  padding: '4px 8px', color: 'black', width: 80,
}

const colorInputStyle: React.CSSProperties = {
  width: 32, height: 24, padding: 0, border: '1px solid rgba(0,0,0,0.35)',
  cursor: 'pointer', background: 'none',
}
