import { sanityFetch } from '@/lib/sanity'
import { ACCESS_PAGE_QUERY } from '@/lib/queries'
import { AccessContent } from '@/components/AccessContent'

interface Section {
  titleEn: string
  titleFr: string
  bodyEn: string
  bodyFr: string
}

const defaultSections: Section[] = [
  {
    titleEn: 'By Train',
    titleFr: 'En Train',
    bodyEn: 'The most direct way to reach Cerbère. From Paris Gare de Lyon, take a TGV to Perpignan, then connect to a regional TER — the total journey takes around 7 hours. An overnight sleeper also runs from Paris Gare d\'Austerlitz on Fridays, arriving in the morning. From Barcelona, direct trains run every few hours and take around 2h 30m.',
    bodyFr: 'La façon la plus directe de rejoindre Cerbère. Depuis Paris Gare de Lyon, prenez un TGV jusqu\'à Perpignan, puis connectez-vous à un TER régional — le trajet total dure environ 7 heures. Un train de nuit circule également depuis Paris Gare d\'Austerlitz le vendredi, arrivant le matin. Depuis Barcelone, des trains directs circulent toutes les quelques heures et prennent environ 2h30.',
  },
  {
    titleEn: 'By Plane',
    titleFr: 'En Avion',
    bodyEn: 'The closest airports are Perpignan (PGF) and Girona (GRO), each around 45–60 minutes by car or taxi. Barcelona (BCN) is also an option, with onward trains to Cerbère taking around 2h 30m, or around 2 hours by car. From Perpignan airport, you can also take a short taxi or bus into Perpignan station and connect to a direct TER to Cerbère.',
    bodyFr: 'Les aéroports les plus proches sont Perpignan (PGF) et Gérone (GRO), chacun à environ 45–60 minutes en voiture ou en taxi. Barcelone (BCN) est également une option, avec des trains vers Cerbère prenant environ 2h30, ou environ 2 heures en voiture. Depuis l\'aéroport de Perpignan, vous pouvez également prendre un court taxi ou bus jusqu\'à la gare de Perpignan et connecter à un TER direct vers Cerbère.',
  },
  {
    titleEn: 'By Car',
    titleFr: 'En Voiture',
    bodyEn: 'From Paris, the drive takes around 8h 30m. From Barcelona, allow just over 2 hours. The roads into Cerbère wind down through the coastal hills — allow a little extra time for the final stretch. Parking is available in and around the town.',
    bodyFr: 'Depuis Paris, le trajet prend environ 8h30. Depuis Barcelone, comptez un peu plus de 2 heures. Les routes vers Cerbère descendent à travers les collines côtières — prévoyez un peu de temps supplémentaire pour le dernier tronçon. Des parkings sont disponibles dans et autour de la ville.',
  },
]

export default async function AccessPage() {
  const data = await sanityFetch<{ sections: Section[] } | null>(
    ACCESS_PAGE_QUERY,
    {},
    { next: { revalidate: 60 } },
  )
  return <AccessContent sections={data?.sections?.length ? data.sections : defaultSections} />
}
