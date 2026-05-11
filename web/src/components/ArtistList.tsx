import Link from 'next/link'
import { siteArtistClass, siteInlineLinkClass } from '@/lib/siteSpacing'
import type { Artist } from '@/lib/types'

// Maps slugified artist full-name to the corresponding schedule anchor id
const SCHEDULE_ANCHORS: Record<string, string> = {
  'chantal-michelle':        'chantal-michelle',
  'youmna-saba':             'youmna-saba',
  'lubomyr-melnyk':          'lubomyr-melnyk',
  'josephine-foster':        'josephine-foster',
  'fredrik-rasten':          'fredrik-rasten',
  'ctm':                     'ctm',
  'lukas-de-clerck':         'lukas-de-clerck',
  'elisabeth-klinck':        'elisabeth-klinck',
  'pierre-bastien':          'pierre-bastien-louis-laurain',
  'louis-laurain':           'pierre-bastien-louis-laurain',
  'mohammad-reza-mortazavi': 'mohammad-reza-mortazavi',
  'yu-su':                   'yu-su',
  'maya-dhondt':             'maya-dhondt',
  'mats-erlandsson':         'mats-erlandsson',
  'miriam-adefris':          'miriam-adefris',
}

function toSlug(artist: Artist): string {
  const full = artist.firstName
    ? `${artist.firstName} ${artist.lastName}`
    : artist.lastName
  return full
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function ArtistName({ artist }: { artist: Artist }) {
  const anchor = SCHEDULE_ANCHORS[toSlug(artist)]
  const inner = artist.lineBreak && artist.firstName
    ? <>{artist.firstName}<br />{artist.lastName}</>
    : <>{artist.firstName ? `${artist.firstName} ${artist.lastName}` : artist.lastName}</>

  if (anchor) {
    return (
      <p>
        <Link href={`/schedule#${anchor}`} className={siteInlineLinkClass}>
          {inner}
        </Link>
      </p>
    )
  }
  return <p>{inner}</p>
}

export function ArtistList({ artists }: { artists: Artist[] }) {
  const half = Math.ceil(artists.length / 2)
  const col1 = artists.slice(0, half)
  const col2 = artists.slice(half)

  return (
    <div className={siteArtistClass}>
      {/* Desktop: 2 columns */}
      <div className="flex gap-[40px] max-[740px]:hidden items-start">
        <div className="flex-1 flex flex-col gap-3">
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
    </div>
  )
}
