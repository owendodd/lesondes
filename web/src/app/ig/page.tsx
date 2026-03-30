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

// ── Helpers ─────────────────────────────────────────────────────────────────

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

// ── Component ────────────────────────────────────────────────────────────────

export default function IgPage() {
  const postRef = useRef<HTMLDivElement>(null)
  const runIdRef = useRef(0)
  const runningRef = useRef(false)
  const [isRunning, setIsRunning] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)

  // Scale canvas to fit viewport
  useEffect(() => {
    function scalePost() {
      if (!postRef.current) return
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
  }, [])

  const clearAll = useCallback(() => {
    runningRef.current = false
    runIdRef.current++
    setIsRunning(false)
    SLIDES.forEach(s => s.lines.forEach(l => initLineSpans(l.id, l.text)))
  }, [])

  // Init spans on mount
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
      // Auto-start animation
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

  return (
    <>
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves={4} seed={8} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div style={{
        fontFamily: 'var(--font-diatype), sans-serif',
        fontWeight: 400,
        background: '#e8e8e8',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* 1080×1350 canvas */}
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
          {/* Text section */}
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            {/* Slide 1 */}
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

            {/* Slide 2 */}
            <div id="slide-2" style={slideWrapStyle}>
              <div style={namesGridStyle}>
                {['a1','a2','a3','a4','a5','a6'].map(id => (
                  <p key={id} id={id} style={nameStyle} />
                ))}
              </div>
            </div>

            {/* Slide 3 */}
            <div id="slide-3" style={slideWrapStyle}>
              <div style={namesGridStyle}>
                {['b1','b2','b3','b4','b5','b6'].map(id => (
                  <p key={id} id={id} style={nameStyle} />
                ))}
              </div>
            </div>
          </div>

          {/* Video section */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <video style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              autoPlay muted loop playsInline>
              <source src="/video/BG3_crop.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        position: 'fixed', top: 'clamp(14px, 2vh, 28px)', left: 'clamp(14px, 2vw, 28px)',
        display: 'flex', gap: 10, zIndex: 10,
      }}>
        <button onClick={handleStart}  style={btnStyle}>{isRunning ? 'stop' : 'start'}</button>
        <button onClick={clearAll}     style={btnStyle}>reset</button>
        <button onClick={handleRecord} style={{ ...btnStyle, ...(isRecording ? { borderColor: 'red', color: 'red' } : {}) }}>
          {isRecording ? 'stop rec' : 'record'}
        </button>
      </div>
    </>
  )
}

// ── Inline style constants ───────────────────────────────────────────────────

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
