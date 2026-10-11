'use client'

import { useLang } from '@/hooks/useLang'
import { siteFigmaTextClass } from '@/lib/siteSpacing'

const paragraphs = {
  en: [
    'Les Ondes was founded by Ashley Helvey and Owen Dodd, who have each spent recent years programming intimate live performances — Owen through his apartment concert series La Bleue in Paris, and Ashley through curatorial projects across France and Italy.',
    'Both share a preference for work that stays analog, acoustic, and handmade — an inefficiency they see as its own reward, in a world increasingly built for scale and automation.',
    'Les Ondes brings that sensibility to Cerbère, the last French village before the Spanish border, and to the Hôtel Belvédère du Rayon Vert, an art deco landmark perched between the sea and the Pyrenees with its own history of music, from Fernandel to Mistinguett.',
  ],
  fr: [
    "Les Ondes a été fondé par Ashley Helvey et Owen Dodd, qui ont chacun consacré ces dernières années à la programmation de concerts intimes — Owen avec sa série de concerts d'appartement La Bleue à Paris, et Ashley à travers des projets de commissariat en France et en Italie.",
    "Tous deux partagent un goût pour un travail qui reste analogique, acoustique et fait main — une inefficacité qu'ils considèrent comme une richesse en soi, dans un monde de plus en plus pensé pour l'échelle et l'automatisation.",
    "Les Ondes porte cette sensibilité jusqu'à Cerbère, dernier village français avant la frontière espagnole, et jusqu'à l'Hôtel Belvédère du Rayon Vert, un joyau art déco perché entre mer et Pyrénées, qui a lui-même accueilli la musique par le passé, de Fernandel à Mistinguett.",
  ],
}

export function AboutText() {
  const { lang } = useLang()
  const lk = lang === 'fr' ? 'fr' : 'en'

  return (
    <div className={`flex flex-col gap-4 max-w-[700px] ${siteFigmaTextClass}`}>
      {paragraphs[lk].map(p => (
        <p key={p}>{p}</p>
      ))}
    </div>
  )
}
