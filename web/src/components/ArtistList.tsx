import type { Artist } from '@/lib/types'

function ArtistName({ artist }: { artist: Artist }) {
  if (artist.lineBreak && artist.firstName) {
    return <p key={artist._id}>{artist.firstName}<br />{artist.lastName}</p>
  }
  return <p key={artist._id}>{artist.firstName ? `${artist.firstName} ${artist.lastName}` : artist.lastName}</p>
}

export function ArtistList({ artists }: { artists: Artist[] }) {
  const half = Math.ceil(artists.length / 2)
  const col1 = artists.slice(0, half)
  const col2 = artists.slice(half)

  return (
    <>
      {/* Desktop: 2 columns — col1 fixed gap, col2 space-between to match col1 height */}
      <div className="flex gap-10 max-[740px]:hidden items-start">
        <div className="flex-1 flex flex-col gap-4">
          {col1.map(a => <ArtistName key={a._id} artist={a} />)}
        </div>
        <div className="flex-1 flex flex-col justify-between self-stretch">
          {col2.map(a => <ArtistName key={a._id} artist={a} />)}
        </div>
      </div>
      {/* Mobile: single column */}
      <div className="hidden max-[740px]:flex flex-col gap-3">
        {artists.map(a => <ArtistName key={a._id} artist={a} />)}
      </div>
    </>
  )
}
