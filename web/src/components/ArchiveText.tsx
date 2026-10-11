'use client'

import { useLang } from '@/hooks/useLang'
import { siteFigmaTextClass } from '@/lib/siteSpacing'
import type { Artist, InfoBottom } from '@/lib/types'

const messages = {
  intro: {
    en: 'The first edition of Les Ondes took place at the Hôtel Belvédère du Rayon Vert in the Franco-Spanish border town of Cerbère. From May 29 to 31, 2026 around 300 guests, musicians, artists, chefs, and vignerons joined us for 3 days of intimate concerts in the historic hotel and surrounding areas.',
    fr: "La première édition de Les Ondes s'est tenue à l'Hôtel Belvédère du Rayon Vert, à Cerbère, dernière ville française avant la frontière espagnole. Du 29 au 31 mai 2026, environ 300 invités — musiciens, artistes, chefs et vignerons — nous ont rejoints pour 3 jours de concerts intimes dans l'hôtel historique et ses environs.",
  },
  performersPrefix: { en: 'Performers included: ', fr: 'Avec : ' },
  mealsTemplate: {
    en: (food: string, wine: string) =>
      `Meals were prepared by ${food} and his team from Comptoir Central des Bazars, and ${wine} organized our wine program.`,
    fr: (food: string, wine: string) =>
      `Les repas ont été préparés par ${food} et son équipe du Comptoir Central des Bazars, et ${wine} a organisé notre programme de vins.`,
  },
}

interface ArchiveTextProps {
  artists: Artist[]
  infoBottom: InfoBottom | null
}

export function ArchiveText({ artists, infoBottom }: ArchiveTextProps) {
  const { lang } = useLang()
  const lk = lang === 'fr' ? 'fr' : 'en'

  const artistProse = artists
    .map(a => (a.firstName ? `${a.firstName} ${a.lastName}` : a.lastName))
    .join(', ')

  return (
    <div className={`flex flex-col gap-4 max-w-[700px] ${siteFigmaTextClass}`}>
      <p>{messages.intro[lk]}</p>

      {artistProse && <p>{`${messages.performersPrefix[lk]}${artistProse}.`}</p>}

      {infoBottom?.foodPerson && infoBottom?.winePerson && (
        <p>{messages.mealsTemplate[lk](infoBottom.foodPerson, infoBottom.winePerson)}</p>
      )}
    </div>
  )
}
