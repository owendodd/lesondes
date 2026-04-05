import type { Artist } from '@/lib/types'

export function ArtistList({ artists }: { artists: Artist[] }) {
  return (
    <div className="[grid-area:artists] flex flex-col gap-3 text-center">
      {artists.map(artist => (
        <p key={artist._id}>
          {artist.lineBreak && artist.firstName ? (
            <>
              {artist.firstName}
              <br />
              {artist.lastName}
            </>
          ) : (
            artist.firstName ? `${artist.firstName} ${artist.lastName}` : artist.lastName
          )}
        </p>
      ))}
    </div>
  )
}
