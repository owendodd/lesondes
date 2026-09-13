interface Photo {
  url: string
  width: number
  height: number
}

// Bento layout from the Figma design: row 0 = one large image (~62% width),
// row 1 = a small image (~38%) beside a large one (~62%), row 2 = one large image again.
// All source photos share a 3:2 aspect ratio, so width alone drives each cell's height.
const LAYOUT = [
  { row: 0, widthPct: 62.05 },
  { row: 1, widthPct: 37.95 },
  { row: 1, widthPct: 62.05 },
  { row: 2, widthPct: 62.05 },
]

export function ArchiveGallery({ photos }: { photos: Photo[] }) {
  if (!photos.length) return null

  const rows: { photo: Photo; widthPct: number }[][] = []
  photos.forEach((photo, i) => {
    const spec = LAYOUT[i] ?? { row: rows.length, widthPct: 62.05 }
    rows[spec.row] ??= []
    rows[spec.row].push({ photo, widthPct: spec.widthPct })
  })

  return (
    <div className="flex flex-col w-full">
      {rows.map((cells, i) => (
        <div key={i} className="flex items-start w-full">
          {cells.map(({ photo, widthPct }) => (
            <div key={photo.url} className="aspect-[3/2] overflow-hidden" style={{ width: `${widthPct}%` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${photo.url}?w=1800&q=80&auto=format`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
