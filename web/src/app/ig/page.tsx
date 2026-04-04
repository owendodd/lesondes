'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ── Asset helpers ────────────────────────────────────────────────────────────

function toBase64(buf: ArrayBuffer): string {
  let binary = ''
  const bytes = new Uint8Array(buf)
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

async function fetchImageB64(src: string): Promise<string> {
  const blob = await fetch(src).then(r => r.blob())
  return new Promise(res => {
    const fr = new FileReader()
    fr.onload = () => res(fr.result as string)
    fr.readAsDataURL(blob)
  })
}

// ── IG Post shared save logic ─────────────────────────────────────────────────

const IG_POST_ARTISTS = [
  'Miriam Adefris', 'Pierre Bastien', 'Lukas de Clerck', 'Maya Dhondt',
  'Mats Erlandsson', 'Elisabeth Klinck', 'Louis Laurain', 'Lubomyr Melnyk',
  'Chantal Michelle', 'Mohammad Reza\nMortazavi', 'Fredrik Rasten', 'Youmna Saba',
]

async function saveIgPost(imageSrc: string, filename: string) {
  const W = 1080, H = 1350, S = 2
  const cW = W * S, cH = H * S
  const photoH = 675 * S
  const pad = 48 * S
  const titleSize = 60 * S
  const titleLS = -1.2 * S
  const bodySize = 26 * S
  const bodyLS = 0.08 * bodySize
  const contentW = 984 * S
  const contentX = (cW - contentW) / 2
  const upperH = photoH - pad * 2
  const titleCenterY = pad + upperH / 2 + titleSize * 0.35
  const artistsTop = photoH + pad
  const artistGap = 16 * S

  const [medBuf, heavyBuf] = await Promise.all([
    fetch('/fonts/ABCDiatype-Medium-Trial.woff2').then(r => r.arrayBuffer()),
    fetch('/fonts/ABCDiatype-Heavy-Trial.woff2').then(r => r.arrayBuffer()),
  ])
  const medB64 = toBase64(medBuf)
  const heavyB64 = toBase64(heavyBuf)
  const photoB64 = await fetchImageB64(imageSrc)

  let artistEls = ''
  let yTop = artistsTop
  IG_POST_ARTISTS.forEach((artist) => {
    const lines = artist.split('\n')
    lines.forEach((line, li) => {
      const y = yTop + li * bodySize + bodySize / 2
      artistEls += `<text x="${contentX}" y="${y}" font-family="ABCDiatype, sans-serif" font-size="${bodySize}" letter-spacing="${bodyLS}" fill="#000" dominant-baseline="middle" filter="url(#r)">${escapeXml(line)}</text>\n`
    })
    yTop += lines.length * bodySize + artistGap
  })

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${cW}" height="${cH}">
  <defs>
    <style>
      @font-face { font-family: 'ABCDiatype'; src: url('data:font/woff2;base64,${medB64}') format('woff2'); font-weight: 400; }
      @font-face { font-family: 'ABCDiatype'; src: url('data:font/woff2;base64,${heavyB64}') format('woff2'); font-weight: 700; }
    </style>
    <filter id="r" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="4" seed="8" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <image href="${photoB64}" x="0" y="0" width="${cW}" height="${photoH}" preserveAspectRatio="xMidYMid slice"/>
  <rect x="0" y="${photoH}" width="${cW}" height="${cH - photoH}" fill="#ffffff"/>
  <text x="${cW / 2}" y="${titleCenterY}" text-anchor="middle" font-family="ABCDiatype, sans-serif" font-size="${titleSize}" letter-spacing="${titleLS}" fill="#000" dominant-baseline="middle" filter="url(#r)">LES ONDES<tspan dx="${48 * S}">Cerb\u00e8re</tspan></text>
  ${artistEls}
  <text x="${contentX + contentW}" y="${artistsTop + bodySize / 2}" text-anchor="end" font-family="ABCDiatype, sans-serif" font-size="${bodySize}" letter-spacing="${bodyLS}" fill="#000" dominant-baseline="middle" filter="url(#r)">May 29 30 31</text>
</svg>`

  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  await new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = cW; canvas.height = cH
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob(png => {
        if (!png) { reject(new Error('export failed')); return }
        const a = document.createElement('a')
        a.href = URL.createObjectURL(png)
        a.download = filename
        a.click()
        resolve()
      }, 'image/png')
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('svg load failed')) }
    img.src = url
  })
}

// ── IG Title-only save logic ──────────────────────────────────────────────────

async function saveIgTitle(imageSrc: string, filename: string) {
  const W = 1080, H = 1350, S = 2
  const cW = W * S, cH = H * S
  const titleSize = 60 * S
  const titleLS = -1.2 * S
  const titleCenterY = cH / 2 + titleSize * 0.35

  const [medBuf, heavyBuf] = await Promise.all([
    fetch('/fonts/ABCDiatype-Medium-Trial.woff2').then(r => r.arrayBuffer()),
    fetch('/fonts/ABCDiatype-Heavy-Trial.woff2').then(r => r.arrayBuffer()),
  ])
  const medB64 = toBase64(medBuf)
  const heavyB64 = toBase64(heavyBuf)
  const photoB64 = await fetchImageB64(imageSrc)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${cW}" height="${cH}">
  <defs>
    <style>
      @font-face { font-family: 'ABCDiatype'; src: url('data:font/woff2;base64,${medB64}') format('woff2'); font-weight: 400; }
      @font-face { font-family: 'ABCDiatype'; src: url('data:font/woff2;base64,${heavyB64}') format('woff2'); font-weight: 700; }
    </style>
    <filter id="r" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="4" seed="8" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <image href="${photoB64}" x="0" y="0" width="${cW}" height="${cH}" preserveAspectRatio="xMidYMid slice"/>
  <text x="${cW / 2}" y="${titleCenterY}" text-anchor="middle" font-family="ABCDiatype, sans-serif" font-size="${titleSize}" letter-spacing="${titleLS}" fill="#000" dominant-baseline="middle" filter="url(#r)">LES ONDES<tspan dx="${48 * S}">Cerb\u00e8re</tspan></text>
</svg>`

  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  await new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = cW; canvas.height = cH
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob(png => {
        if (!png) { reject(new Error('export failed')); return }
        const a = document.createElement('a')
        a.href = URL.createObjectURL(png)
        a.download = filename
        a.click()
        resolve()
      }, 'image/png')
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('svg load failed')) }
    img.src = url
  })
}

// ── Header Banner save logic ──────────────────────────────────────────────────

async function saveHeaderBanner() {
  const W = 1920, H = 300, S = 2
  const cW = W * S, cH = H * S
  const fontSize = 100 * S
  const ls = -fontSize * 0.02
  const centerY = cH / 2

  const [medBuf, heavyBuf] = await Promise.all([
    fetch('/fonts/ABCDiatype-Medium-Trial.woff2').then(r => r.arrayBuffer()),
    fetch('/fonts/ABCDiatype-Heavy-Trial.woff2').then(r => r.arrayBuffer()),
  ])
  const medB64 = toBase64(medBuf)
  const heavyB64 = toBase64(heavyBuf)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cW}" height="${cH}">
  <defs>
    <style>
      @font-face { font-family: 'ABCDiatype'; src: url('data:font/woff2;base64,${medB64}') format('woff2'); font-weight: 400; }
      @font-face { font-family: 'ABCDiatype'; src: url('data:font/woff2;base64,${heavyB64}') format('woff2'); font-weight: 700; }
    </style>
    <filter id="r" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="4" seed="8" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <rect width="${cW}" height="${cH}" fill="#ffffff"/>
  <text x="${cW / 2}" y="${centerY}" text-anchor="middle" font-family="ABCDiatype, sans-serif" font-size="${fontSize}" letter-spacing="${ls}" fill="#000" dominant-baseline="middle" filter="url(#r)">LES ONDES<tspan dx="${80 * S}">Cerb\u00e8re</tspan><tspan dx="${80 * S}">May 29 30 31</tspan></text>
</svg>`

  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  await new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = cW; canvas.height = cH
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob(png => {
        if (!png) { reject(new Error('export failed')); return }
        const a = document.createElement('a')
        a.href = URL.createObjectURL(png)
        a.download = 'header-banner.png'
        a.click()
        resolve()
      }, 'image/png')
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('svg load failed')) }
    img.src = url
  })
}

// ── Asset registry ────────────────────────────────────────────────────────────

interface AssetDef {
  id: string
  name: string
  width: number
  height: number
  image?: string
  variant: 'post' | 'title' | 'banner'
  save: () => Promise<void>
}

const ASSETS: AssetDef[] = [
  { id: 'ig-pat1',  name: 'IgPat1',  width: 1080, height: 1350, image: '/images/Pat1.jpg', variant: 'post',  save: () => saveIgPost('/images/Pat1.jpg', 'ig-pat1.png') },
  { id: 'ig-pat2',  name: 'IgPat2',  width: 1080, height: 1350, image: '/images/Pat2.jpg', variant: 'post',  save: () => saveIgPost('/images/Pat2.jpg', 'ig-pat2.png') },
  { id: 'ig-pat3',  name: 'IgPat3',  width: 1080, height: 1350, image: '/images/Pat3.jpg', variant: 'post',  save: () => saveIgPost('/images/Pat3.jpg', 'ig-pat3.png') },
  { id: 'ig-pat1t', name: 'IgPat1T', width: 1080, height: 1350, image: '/images/Pat1.jpg', variant: 'title', save: () => saveIgTitle('/images/Pat1.jpg', 'ig-pat1t.png') },
  { id: 'ig-pat2t', name: 'IgPat2T', width: 1080, height: 1350, image: '/images/Pat2.jpg', variant: 'title', save: () => saveIgTitle('/images/Pat2.jpg', 'ig-pat2t.png') },
  { id: 'ig-pat3t', name: 'IgPat3T', width: 1080, height: 1350, image: '/images/Pat3.jpg', variant: 'title', save: () => saveIgTitle('/images/Pat3.jpg', 'ig-pat3t.png') },
  { id: 'header-banner', name: 'HeaderBanner', width: 1920, height: 300, variant: 'banner', save: saveHeaderBanner },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function IgPage() {
  const [activeId, setActiveId] = useState(ASSETS[0].id)
  const [saving, setSaving] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const asset = ASSETS.find(a => a.id === activeId)!

  useEffect(() => {
    function updateScale() {
      setScale(Math.min(
        (window.innerWidth  * 0.88) / asset.width,
        (window.innerHeight * 0.88) / asset.height,
      ))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [asset.width, asset.height])

  const handleSave = useCallback(async () => {
    if (saving) return
    setSaving(true)
    try { await asset.save() } finally { setSaving(false) }
  }, [saving, asset])

  return (
    <>
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves={4} seed={8} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.6} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Asset list — upper left */}
      <div style={{ position: 'fixed', top: 'clamp(14px, 2vh, 28px)', left: 'clamp(14px, 2vw, 28px)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ASSETS.map(a => (
          <button key={a.id} onClick={() => setActiveId(a.id)} style={{ ...btnStyle, ...(a.id === activeId ? activeBtnStyle : {}) }}>
            {a.name}
          </button>
        ))}
      </div>

      {/* Save — upper right */}
      <button onClick={handleSave} disabled={saving} style={{ ...btnStyle, position: 'fixed', top: 'clamp(14px, 2vh, 28px)', right: 'clamp(14px, 2vw, 28px)', zIndex: 10 }}>
        {saving ? 'saving…' : 'save'}
      </button>

      {/* Canvas */}
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e8e8', fontFamily: 'var(--font-diatype), sans-serif', fontWeight: 400 }}>
        <div ref={wrapRef} style={{ width: asset.width, height: asset.height, transform: `scale(${scale})`, transformOrigin: 'center center', flexShrink: 0 }}>
          {asset.variant === 'post'   && <IgPostPreview image={asset.image!} />}
          {asset.variant === 'title'  && <IgTitlePreview image={asset.image!} />}
          {asset.variant === 'banner' && <HeaderBannerPreview />}
        </div>
      </div>
    </>
  )
}

// ── Asset preview ─────────────────────────────────────────────────────────────

function IgPostPreview({ image }: { image: string }) {
  return (
    <div style={{ width: 1080, height: 1350, background: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Upper half — image background, title centered */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 675, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, boxSizing: 'border-box', gap: 48 }}>
        <p style={{ ...titleStyle, filter: 'url(#roughen)' }}>LES ONDES</p>
        <p style={{ ...titleStyle, filter: 'url(#roughen)' }}>Cerbère</p>
      </div>

      {/* Lower half — artists + date */}
      <div style={{ position: 'absolute', top: 675, left: 0, right: 0, height: 675, padding: 48, boxSizing: 'border-box', display: 'flex', gap: 48, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {IG_POST_ARTISTS.map((name, i) => (
            <p key={i} style={{ ...textStyle, filter: 'url(#roughen)' }}>{name}</p>
          ))}
        </div>
        <p style={{ ...textStyle, flex: 1, textAlign: 'right', filter: 'url(#roughen)' }}>May 29 30 31</p>
      </div>
    </div>
  )
}

function HeaderBannerPreview() {
  return (
    <div style={{ width: 1920, height: 300, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 80 }}>
      <p style={{ ...titleStyle, fontSize: 100, filter: 'url(#roughen)' }}>LES ONDES</p>
      <p style={{ ...titleStyle, fontSize: 100, filter: 'url(#roughen)' }}>Cerbère</p>
      <p style={{ ...titleStyle, fontSize: 100, filter: 'url(#roughen)' }}>May 29 30 31</p>
    </div>
  )
}

function IgTitlePreview({ image }: { image: string }) {
  return (
    <div style={{ width: 1080, height: 1350, position: 'relative', overflow: 'hidden', backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
      <p style={{ ...titleStyle, filter: 'url(#roughen)' }}>LES ONDES</p>
      <p style={{ ...titleStyle, filter: 'url(#roughen)' }}>Cerbère</p>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const titleStyle: React.CSSProperties = {
  fontSize: 60, lineHeight: 1.1, letterSpacing: '-0.02em',
  margin: 0, color: '#000', whiteSpace: 'nowrap', textAlign: 'center',
}

const textStyle: React.CSSProperties = {
  fontSize: 26, lineHeight: 1, letterSpacing: '0.08em',
  margin: 0, color: '#000', whiteSpace: 'pre',
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
