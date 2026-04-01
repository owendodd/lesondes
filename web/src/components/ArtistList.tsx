import type { Artist } from '@/lib/types'

export function ArtistList({ artists }: { artists: Artist[] }) {
  return (
    <div className="[grid-area:artists] flex flex-col gap-3 text-center">
      {artists.map(artist => (
        <p key={artist._id}>
          {artist.lineBreak ? (
            <>
              {artist.name.split(' ').slice(0, 2).join(' ')}
              <br />
              {artist.name.split(' ').slice(2).join(' ')}
            </>
          ) : (
            artist.name
          )}
        </p>
      ))}
    </div>
  )
}
