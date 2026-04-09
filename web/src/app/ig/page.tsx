'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

// ── Helpers ───────────────────────────────────────────────────────────────────

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

async function loadFonts() {
  const [medBuf, heavyBuf] = await Promise.all([
    fetch('/fonts/ABCDiatype-Medium-Trial.woff2').then(r => r.arrayBuffer()),
    fetch('/fonts/ABCDiatype-Heavy-Trial.woff2').then(r => r.arrayBuffer()),
  ])
  return { medB64: toBase64(medBuf), heavyB64: toBase64(heavyBuf) }
}

function svgDefs(medB64: string, heavyB64: string) {
  return '<defs>'
    + '<style>'
    + "@font-face { font-family: 'ABCDiatype'; src: url('data:font/woff2;base64," + medB64 + "') format('woff2'); font-weight: 400; }"
    + "@font-face { font-family: 'ABCDiatype'; src: url('data:font/woff2;base64," + heavyB64 + "') format('woff2'); font-weight: 700; }"
    + '</style>'
    + '</defs>'
}

// Canvas-based roughen: browsers don't render SVG filters when drawing SVG blobs to canvas,
// so we apply the displacement effect manually via pixel manipulation after rasterising.
function applyRoughen(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // scale: matches feDisplacementMap scale (0.2) × 2x export resolution
  // freq: matches feTurbulence baseFrequency (1.7) — higher = finer grain
  const scale = 1.4
  const freq = 1
  const src = ctx.getImageData(0, 0, W, H)
  const dst = new Uint8ClampedArray(src.data.length)

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Two independent hash channels → x and y displacement
      const h1 = Math.sin(x * 12.9898 * freq + y * 78.233 * freq) * 43758.5453
      const h2 = Math.sin(x * 93.9898 * freq + y * 67.345 * freq) * 43758.5453
      const dx = Math.round((h1 - Math.floor(h1) - 0.5) * scale)
      const dy = Math.round((h2 - Math.floor(h2) - 0.5) * scale)

      const sx = Math.min(W - 1, Math.max(0, x + dx))
      const sy = Math.min(H - 1, Math.max(0, y + dy))

      const si = (sy * W + sx) * 4
      const di = (y  * W + x)  * 4
      dst[di]     = src.data[si]
      dst[di + 1] = src.data[si + 1]
      dst[di + 2] = src.data[si + 2]
      dst[di + 3] = src.data[si + 3]
    }
  }

  ctx.putImageData(new ImageData(dst, W, H), 0, 0)
}

function exportPng(svgStr: string, filename: string, cW: number, cH: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = cW; canvas.height = cH
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      applyRoughen(ctx, cW, cH)
      canvas.toBlob(png => {
        if (!png) { reject(new Error('export failed')); return }
        const a = document.createElement('a')
        a.href = URL.createObjectURL(png)
        a.download = filename
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => { URL.revokeObjectURL(a.href); document.body.removeChild(a); resolve() }, 100)
      }, 'image/png')
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('svg load failed')) }
    img.src = url
  })
}

// ── Asset handle type ─────────────────────────────────────────────────────────

type AssetHandle = { save: () => Promise<void> }

// ── IG Post ───────────────────────────────────────────────────────────────────

const IG_POST_ARTISTS = [
  'Miriam Adefris', 'Pierre Bastien', 'Lukas de Clerck', 'Maya Dhondt',
  'Mats Erlandsson', 'Elisabeth Klinck', 'Louis Laurain', 'Lubomyr Melnyk',
  'Chantal Michelle', 'Mohammad Reza\nMortazavi', 'Fredrik Rasten', 'Youmna Saba', 'CTM',
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

  const { medB64, heavyB64 } = await loadFonts()
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

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${cW}" height="${cH}">`
    + svgDefs(medB64, heavyB64)
    + `<image href="${photoB64}" x="0" y="0" width="${cW}" height="${photoH}" preserveAspectRatio="xMidYMid slice"/>`
    + `<rect x="0" y="${photoH}" width="${cW}" height="${cH - photoH}" fill="#ffffff"/>`
    + `<text x="${cW / 2}" y="${titleCenterY}" text-anchor="middle" font-family="ABCDiatype, sans-serif" font-size="${titleSize}" letter-spacing="${titleLS}" fill="#000" dominant-baseline="middle" filter="url(#r)">LES ONDES<tspan dx="${48 * S}">Cerb\u00e8re</tspan></text>`
    + artistEls
    + `<text x="${contentX + contentW}" y="${artistsTop + bodySize / 2}" text-anchor="end" font-family="ABCDiatype, sans-serif" font-size="${bodySize}" letter-spacing="${bodyLS}" fill="#000" dominant-baseline="middle" filter="url(#r)">May 29 30 31</text>`
    + '</svg>'

  await exportPng(svg, filename, cW, cH)
}

function IgPostLayout({ image }: { image: string }) {
  return (
    <div style={{ width: 1080, height: 1350, background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 675, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, boxSizing: 'border-box', gap: 48 }}>
        <p style={{ ...titleStyle, filter: 'url(#roughen)' }}>LES ONDES</p>
        <p style={{ ...titleStyle, filter: 'url(#roughen)' }}>Cerbère</p>
      </div>
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

const IgPat1Post = forwardRef<AssetHandle>(function IgPat1Post(_, ref) {
  useImperativeHandle(ref, () => ({ save: () => saveIgPost('/images/Pat1.jpg', 'ig-pat1.png') }))
  return <IgPostLayout image="/images/Pat1.jpg" />
})

const IgPat2Post = forwardRef<AssetHandle>(function IgPat2Post(_, ref) {
  useImperativeHandle(ref, () => ({ save: () => saveIgPost('/images/Pat2.jpg', 'ig-pat2.png') }))
  return <IgPostLayout image="/images/Pat2.jpg" />
})

const IgPat3Post = forwardRef<AssetHandle>(function IgPat3Post(_, ref) {
  useImperativeHandle(ref, () => ({ save: () => saveIgPost('/images/Pat3.jpg', 'ig-pat3.png') }))
  return <IgPostLayout image="/images/Pat3.jpg" />
})

// ── IG Title ──────────────────────────────────────────────────────────────────

async function saveIgTitle(imageSrc: string, filename: string) {
  const W = 1080, H = 1350, S = 2
  const cW = W * S, cH = H * S
  const titleSize = 60 * S
  const titleLS = -1.2 * S
  const titleCenterY = cH / 2 + titleSize * 0.35

  const { medB64, heavyB64 } = await loadFonts()
  const photoB64 = await fetchImageB64(imageSrc)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${cW}" height="${cH}">`
    + svgDefs(medB64, heavyB64)
    + `<image href="${photoB64}" x="0" y="0" width="${cW}" height="${cH}" preserveAspectRatio="xMidYMid slice"/>`
    + `<text x="${cW / 2}" y="${titleCenterY}" text-anchor="middle" font-family="ABCDiatype, sans-serif" font-size="${titleSize}" letter-spacing="${titleLS}" fill="#000" dominant-baseline="middle" filter="url(#r)">LES ONDES<tspan dx="${48 * S}">Cerb\u00e8re</tspan></text>`
    + '</svg>'

  await exportPng(svg, filename, cW, cH)
}

function IgTitleLayout({ image }: { image: string }) {
  return (
    <div style={{ width: 1080, height: 1350, position: 'relative', overflow: 'hidden', backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
      <p style={{ ...titleStyle, filter: 'url(#roughen)' }}>LES ONDES</p>
      <p style={{ ...titleStyle, filter: 'url(#roughen)' }}>Cerbère</p>
    </div>
  )
}

const IgPat1Title = forwardRef<AssetHandle>(function IgPat1Title(_, ref) {
  useImperativeHandle(ref, () => ({ save: () => saveIgTitle('/images/Pat1.jpg', 'ig-pat1t.png') }))
  return <IgTitleLayout image="/images/Pat1.jpg" />
})

const IgPat2Title = forwardRef<AssetHandle>(function IgPat2Title(_, ref) {
  useImperativeHandle(ref, () => ({ save: () => saveIgTitle('/images/Pat2.jpg', 'ig-pat2t.png') }))
  return <IgTitleLayout image="/images/Pat2.jpg" />
})

const IgPat3Title = forwardRef<AssetHandle>(function IgPat3Title(_, ref) {
  useImperativeHandle(ref, () => ({ save: () => saveIgTitle('/images/Pat3.jpg', 'ig-pat3t.png') }))
  return <IgTitleLayout image="/images/Pat3.jpg" />
})

// ── Header Banner ─────────────────────────────────────────────────────────────

async function saveHeaderBanner(W: number, H: number) {
  const S = 2
  const cW = W * S, cH = H * S
  const fontSize = 36 * S
  const ls = -fontSize * 0.02
  const textY = 20 * S + fontSize * 1.1 / 2
  const displayText = 'LES ONDES\u00A0\u00A0\u00A0\u00A0Cerb\u00e8re'

  const { medB64, heavyB64 } = await loadFonts()

  const makeSvg = (color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cW}" height="${cH}">`
    + svgDefs(medB64, heavyB64)
    + `<text x="${cW / 2}" y="${textY}" text-anchor="middle" font-family="ABCDiatype, sans-serif" font-size="${fontSize}" letter-spacing="${ls}" fill="${color}" dominant-baseline="middle" filter="url(#r)">${escapeXml(displayText)}</text>`
    + '</svg>'

  await exportPng(makeSvg('#000'), 'sticker-black.png', cW, cH)
  await exportPng(makeSvg('#fff'), 'sticker-white.png', cW, cH)
}

const HeaderBannerAsset = forwardRef<AssetHandle>(function HeaderBannerAsset(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => ({
    save: () => saveHeaderBanner(containerRef.current?.offsetWidth ?? 500, containerRef.current?.offsetHeight ?? 88)
  }))
  return (
    <div ref={containerRef} style={{ padding: '20px 16px 16px', backgroundColor: '#fff', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      <p style={{ ...titleStyle, fontSize: 36, filter: 'url(#roughen)', flexShrink: 0 }}>
        LES ONDES{'\u00A0\u00A0\u00A0\u00A0'}Cerb{'\u00e8'}re
      </p>
    </div>
  )
})

// ── Artist Overlay ────────────────────────────────────────────────────────────

async function saveArtistOverlay(artistName: string, W: number, H: number) {
  const S = 2
  const cW = W * S, cH = H * S
  const fontSize = 36 * S
  const ls = -fontSize * 0.02
  const textY = 20 * S + fontSize * 1.1 / 2
  const displayText = artistName + '\u00A0\u00A0\u00A0\u00A0LES ONDES\u00A0\u00A0\u00A0\u00A0Cerb\u00e8re'
  const slug = artistName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const { medB64, heavyB64 } = await loadFonts()

  const makeSvg = (color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cW}" height="${cH}">`
    + svgDefs(medB64, heavyB64)
    + `<text x="${cW / 2}" y="${textY}" text-anchor="middle" font-family="ABCDiatype, sans-serif" font-size="${fontSize}" letter-spacing="${ls}" fill="${color}" dominant-baseline="middle" filter="url(#r)">${escapeXml(displayText)}</text>`
    + '</svg>'

  await exportPng(makeSvg('#000'), `artist-sticker-${slug}-black.png`, cW, cH)
  await exportPng(makeSvg('#fff'), `artist-sticker-${slug}-white.png`, cW, cH)
}

const ArtistOverlayAsset = forwardRef<AssetHandle>(function ArtistOverlayAsset(_, ref) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  useImperativeHandle(ref, () => ({
    save: async () => {
      for (let i = 0; i < IG_POST_ARTISTS.length; i++) {
        const el = rowRefs.current[i]
        const W = el?.offsetWidth ?? 500
        const H = el?.offsetHeight ?? 88
        await saveArtistOverlay(IG_POST_ARTISTS[i].replace('\n', ' '), W, H)
        await new Promise(r => setTimeout(r, 200))
      }
    }
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      {IG_POST_ARTISTS.map((artist, i) => (
        <div key={i} ref={el => { rowRefs.current[i] = el }} style={{ padding: '20px 16px 16px', backgroundColor: '#fff', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
          <p style={{ ...titleStyle, fontSize: 36, filter: 'url(#roughen)', flexShrink: 0 }}>
            {artist.replace('\n', ' ')}{'\u00A0\u00A0\u00A0\u00A0'}LES ONDES{'\u00A0\u00A0\u00A0\u00A0'}Cerb{'\u00e8'}re
          </p>
        </div>
      ))}
    </div>
  )
})

// ── Asset registry ────────────────────────────────────────────────────────────

type AssetEntry = {
  id: string
  name: string
  width: number
  height: number
  autoWidth?: boolean
  scrollable?: boolean
  Component: React.ForwardRefExoticComponent<React.RefAttributes<AssetHandle>>
}

const ASSETS: AssetEntry[] = [
  { id: 'ig-pat1',        name: 'IgPat1',        width: 1080, height: 1350, Component: IgPat1Post        },
  { id: 'ig-pat2',        name: 'IgPat2',        width: 1080, height: 1350, Component: IgPat2Post        },
  { id: 'ig-pat3',        name: 'IgPat3',        width: 1080, height: 1350, Component: IgPat3Post        },
  { id: 'ig-pat1t',       name: 'IgPat1T',       width: 1080, height: 1350, Component: IgPat1Title       },
  { id: 'ig-pat2t',       name: 'IgPat2T',       width: 1080, height: 1350, Component: IgPat2Title       },
  { id: 'ig-pat3t',       name: 'IgPat3T',       width: 1080, height: 1350, Component: IgPat3Title       },
  { id: 'header-banner',  name: 'Sticker',        width: 1500, height: 88, scrollable: true, Component: HeaderBannerAsset  },
  { id: 'artist-overlay', name: 'ArtistSticker', width: 1500, height: 88, scrollable: true, Component: ArtistOverlayAsset },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IgPage() {
  const [activeId, setActiveId] = useState(ASSETS[0].id)
  const [saving, setSaving] = useState(false)
  const assetRef = useRef<AssetHandle>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const asset = ASSETS.find(a => a.id === activeId)!
  const ActiveAsset = asset.Component

  useEffect(() => {
    if (asset.scrollable) { setScale(1); return }

    const el = wrapRef.current
    if (!el) return

    function computeScale() {
      const w = asset.autoWidth ? (el!.offsetWidth || asset.width) : asset.width
      setScale(Math.min(
        (window.innerWidth  * 0.88) / w,
        (window.innerHeight * 0.88) / asset.height,
      ))
    }

    computeScale()
    window.addEventListener('resize', computeScale)

    const obs = asset.autoWidth ? new ResizeObserver(computeScale) : null
    obs?.observe(el)

    return () => {
      window.removeEventListener('resize', computeScale)
      obs?.disconnect()
    }
  }, [asset])

  const handleSave = useCallback(async () => {
    if (saving || !assetRef.current) return
    setSaving(true)
    try { await assetRef.current.save() } finally { setSaving(false) }
  }, [saving])

  return (
    <>
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves={4} seed={10} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.4} xChannelSelector="R" yChannelSelector="G" />
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
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: asset.scrollable ? 'flex-start' : 'center', justifyContent: 'center', overflowY: asset.scrollable ? 'auto' : 'hidden', background: '#e8e8e8', fontFamily: 'var(--font-diatype), sans-serif', fontWeight: 400 }}>
        <div ref={wrapRef} style={asset.scrollable ? { padding: '80px 0' } : { width: asset.autoWidth ? 'max-content' : asset.width, height: asset.height, transform: `scale(${scale})`, transformOrigin: 'center center', flexShrink: 0 }}>
          <ActiveAsset ref={assetRef} />
        </div>
      </div>
    </>
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
