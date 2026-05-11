'use client'

import { useLang } from '@/hooks/useLang'
import { siteInlineLinkClass } from '@/lib/siteSpacing'

type Entry = {
  id?: string
  time: string
  labelEn?: string
  labelFr?: string
  nameEn: string
  nameFr?: string
  tagEn?: string
  tagFr?: string
  bioEn?: string
  bioFr?: string
  musicUrl?: string
}

type Day = {
  dayEn: string
  dayFr: string
  entries: Entry[]
}

const schedule: Day[] = [
  {
    dayEn: 'Friday 29 May',
    dayFr: 'Vendredi 29 mai',
    entries: [
      {
        id: 'horasse',
        time: '16:00',
        labelEn: 'Apéro set',
        labelFr: 'Apéro set',
        nameEn: 'Horasse',
        tagEn: '(La Becque)',
        tagFr: '(La Becque)',
        bioEn: 'Switzerland-based DJ whose project "From La Becque with love" weaves releases from La Becque Editions into attentive, listening-focused sets moving between experimental, electronic and contemporary music.',
        bioFr: 'DJ basé en Suisse dont le projet « From La Becque with love » tisse les sorties de La Becque Editions en des sets narratifs et attentifs, entre musiques expérimentales, électroniques et contemporaines.',
        musicUrl: 'https://labecque.ch/',
      },
      {
        id: 'chantal-michelle',
        time: '18:00',
        nameEn: 'Chantal Michelle',
        bioEn: 'Composer and interdisciplinary artist (Berlin / NYC) working with feedback systems, hand-blown glass instruments, and multichannel sound. Her latest album All Things Might Spill (Shelter Press, 2026) has been presented at MoMA, the Royal Academy of Arts, and Café OTO.',
        bioFr: 'Compositrice et artiste interdisciplinaire (Berlin / NYC) travaillant avec des systèmes de feedback, des instruments en verre soufflé et le son multicanal. Son dernier album All Things Might Spill (Shelter Press, 2026) a été présenté au MoMA, à la Royal Academy of Arts et au Café OTO.',
        musicUrl: 'https://open.spotify.com/artist/0mK9sFyrguHYMEYZHZVp6M',
      },
      {
        id: 'youmna-saba',
        time: '19:00',
        nameEn: 'Youmna Saba',
        bioEn: 'Lebanese musician, composer, and musicologist (Beirut / Paris) exploring the relationship between electroacoustic experimentation and Arabic musical traditions. Her fifth album Wishah (2023, Touch) centres on a digital extension of the oud developed through her research project Taïma.',
        bioFr: 'Musicienne, compositrice et musicologue libanaise (Beyrouth / Paris) explorant les liens entre expérimentation électroacoustique et traditions musicales arabes. Son cinquième album Wishah (2023, Touch) s\'articule autour d\'une extension numérique du oud développée dans le cadre de son projet Taïma.',
        musicUrl: 'https://open.spotify.com/artist/0i5L2JTgQpjnDrjWPyCnH8',
      },
      {
        id: 'lubomyr-melnyk',
        time: '19:45',
        nameEn: 'Lubomyr Melnyk',
        bioEn: 'Ukrainian-born pianist (Sweden) renowned for his continuous music technique — sustaining over nineteen notes per second per hand, letting harmonics accumulate until a single instrument fills the space of an orchestra.',
        bioFr: 'Pianiste né en Ukraine (Suède), renommé pour sa technique de « continuous music » — en maintenant plus de dix-neuf notes par seconde et par main, il laisse les harmoniques s\'accumuler jusqu\'à ce qu\'un seul instrument occupe l\'espace d\'un orchestre.',
        musicUrl: 'https://open.spotify.com/artist/0G9qoAVEY16XVywzpxP4wP',
      },
      {
        time: '21:00',
        labelEn: 'Dîner',
        labelFr: 'Dîner',
        nameEn: 'Harry Lester',
      },
      {
        id: 'souleymane-said',
        time: '23:00',
        labelEn: 'Afters set',
        labelFr: 'Afters set',
        nameEn: 'Souleymane Said',
        tagEn: '(Latency)',
        tagFr: '(Latency)',
        bioEn: 'Paris-based founder of Latency, an independent label and curatorial platform between contemporary electronic music and experimental composition. Currently musical supervisor at Fondation Cartier.',
        bioFr: 'Fondateur parisien de Latency, label indépendant et plateforme curatoriale entre musique électronique contemporaine et composition expérimentale. Actuellement superviseur musical à la Fondation Cartier.',
        musicUrl: 'https://www.latency.fr/',
      },
    ],
  },
  {
    dayEn: 'Saturday 30 May',
    dayFr: 'Samedi 30 mai',
    entries: [
      {
        id: 'josephine-foster',
        time: '07:00',
        labelEn: 'Offsite',
        labelFr: 'Offsite',
        nameEn: 'Josephine Foster',
        bioEn: 'Essential voice (Nashville / Madrid) in contemporary folk who reshapes Appalachian balladry and traditional song into spare, exploratory forms, across releases for Drag City, Bo\' Weavil, and Fire Records.',
        bioFr: 'Voix essentielle (Nashville / Madrid) du folk contemporain qui redonne vie aux ballades des Appalaches et aux chants traditionnels dans des formes épurées et exploratoires, à travers des sorties chez Drag City, Bo\' Weavil et Fire Records.',
        musicUrl: 'https://open.spotify.com/artist/1fVyf1LbeIEE4DUT4dZhHL',
      },
      {
        id: 'fredrik-rasten',
        time: '12:00',
        nameEn: 'Fredrik Rasten',
        bioEn: 'Guitarist and composer (Oslo / Berlin) working exclusively within just intonation, using real-time retuning and e-bows to produce round, sine wave-like tones in harmonious fusion.',
        bioFr: 'Guitariste et compositeur (Oslo / Berlin) travaillant exclusivement en just intonation, utilisant le ré-accordage en temps réel et des e-bows pour produire des sons ronds, proches de sinusoïdes, en fusion harmonique.',
        musicUrl: 'https://open.spotify.com/artist/1eMZzYLPCHYe8d7PTN45JL',
      },
      {
        id: 'ctm',
        time: '13:00',
        nameEn: 'CTM',
        bioEn: 'Danish cellist, singer, and composer (Copenhagen) whose work moves freely between classical composition, pop, and open improvisation. Her album Vind (2023, 15 love) is built around solo cello with digital processing.',
        bioFr: 'Violoncelliste, chanteuse et compositrice danoise (Copenhague) dont le travail circule librement entre composition classique, pop et improvisation ouverte. Son album Vind (2023, 15 love) est construit autour du violoncelle solo avec traitement numérique.',
        musicUrl: 'https://open.spotify.com/artist/7yaj7l8QczhEsLttuFDaRz',
      },
      {
        time: '14:00',
        labelEn: 'Déjeuner',
        labelFr: 'Déjeuner',
        nameEn: 'Harry Lester',
      },
      {
        id: 'lukas-de-clerck',
        time: '17:00',
        nameEn: 'Lukas De Clerck',
        bioEn: 'Musician and researcher (Brussels) who has devoted years to studying the aulos, a Greco-Roman double-pipe extinct for over a millennium, applying drone and post-minimalist composition to give the ancient form a contemporary voice.',
        bioFr: 'Musicien et chercheur (Bruxelles) ayant consacré des années à l\'étude de l\'aulos, double tuyau gréco-romain disparu depuis plus d\'un millénaire, en s\'appuyant sur le drone et une écriture post-minimaliste pour donner à cette forme ancienne une voix contemporaine.',
        musicUrl: 'https://open.spotify.com/artist/1zysFZ6qHEcsp8lkF6Eodm',
      },
      {
        id: 'elisabeth-klinck',
        time: '18:00',
        nameEn: 'Elisabeth Klinck',
        bioEn: 'Violinist and composer (Brussels) working close to the threshold between fragility and force. Her album Chronotopia (Hallow Ground, 2025) was selected by The Quietus as one of the best albums of the year.',
        bioFr: 'Violoniste et compositrice (Bruxelles) évoluant au plus près du seuil entre fragilité et puissance. Son album Chronotopia (Hallow Ground, 2025) a été sélectionné par The Quietus parmi les meilleurs albums de l\'année.',
        musicUrl: 'https://open.spotify.com/artist/6YLPwvxPgRFktmkR3zZiAM',
      },
      {
        id: 'pierre-bastien-louis-laurain',
        time: '19:00',
        nameEn: 'Pierre Bastien & Louis Laurain',
        bioEn: 'Bastien\'s (Paris) self-built Meccano orchestras animate instruments from across the world; Laurain\'s solo practice treats three trumpets as resonant space rather than melodic instrument. Their duo album CNT was released in 2025.',
        bioFr: 'Les orchestres Meccano auto-construits de Bastien (Paris) mettent en mouvement des instruments venus du monde entier ; la pratique solo de Laurain traite trois trompettes comme espaces de résonance plutôt que sources mélodiques. Leur album en duo CNT est paru en 2025.',
        musicUrl: 'https://open.spotify.com/artist/5fnXjhmTrnKmXbPDnvTUkm',
      },
      {
        id: 'mohammad-reza-mortazavi',
        time: '20:00',
        nameEn: 'Mohammad Reza Mortazavi',
        bioEn: 'Iranian percussionist and composer (Berlin) who has developed over thirty new striking techniques on tombak and daf, generating dense polyrhythmic structures that can sound like an ensemble. His 2025 album Nexus on Latency opens with Zendegi, built from the rhythm of "Woman, Life, Freedom."',
        bioFr: 'Percussionniste et compositeur iranien (Berlin) ayant développé plus de trente nouvelles techniques de frappe sur tombak et daf, générant de denses structures polyrythmiques pouvant sonner comme un ensemble. Son album Nexus (2025, Latency) s\'ouvre sur Zendegi, construit à partir du rythme de « Woman, Life, Freedom ».',
        musicUrl: 'https://open.spotify.com/artist/7JuRnCPB2mrwvXfTwPlLqB',
      },
      {
        time: '21:00',
        labelEn: 'Dîner',
        labelFr: 'Dîner',
        nameEn: 'Harry Lester',
      },
      {
        id: 'yu-su',
        time: '23:00',
        labelEn: 'Afters set',
        labelFr: 'Afters set',
        nameEn: 'Yu Su',
        tagEn: '(Short Span)',
        tagFr: '(Short Span)',
        bioEn: 'Kaifeng-born musician, DJ, producer, and sound artist (London) known for her monthly NTS Radio show moving between dub techno, ambient and club. Her 2026 album Foundry on Short Span follows Yellow River Blue (bié Records, 2021).',
        bioFr: 'Musicien·ne, DJ, producteur·rice et sound artist né·e à Kaifeng (Londres), connu·e pour son émission mensuelle sur NTS Radio entre dub techno, ambient et club. Son album Foundry (2026, Short Span) fait suite à Yellow River Blue (bié Records, 2021).',
        musicUrl: 'https://open.spotify.com/artist/69zPIMRgsZieOHFtHtvnj0',
      },
    ],
  },
  {
    dayEn: 'Sunday 31 May',
    dayFr: 'Dimanche 31 mai',
    entries: [
      {
        time: '07:00',
        labelEn: 'Offsite',
        labelFr: 'Offsite',
        nameEn: 'Mohammad Reza Mortazavi',
        musicUrl: 'https://open.spotify.com/artist/7JuRnCPB2mrwvXfTwPlLqB',
      },
      {
        id: 'maya-dhondt',
        time: '11:00',
        nameEn: 'Maya Dhondt',
        bioEn: 'Pianist and composer (Brussels) working at the intersection of contemporary piano and glitch-pop, folding piano lines into deconstructed electronics and murmured multilingual text. Her debut wow, x (2024, VIERNULVIER) was her first release under her own name.',
        bioFr: 'Pianiste et compositrice (Bruxelles) à l\'intersection du piano contemporain et de la glitch-pop, entremêlant lignes de piano, électroniques déconstruites et texte murmuré en plusieurs langues. Son premier album wow, x (2024, VIERNULVIER) est sa première sortie sous son propre nom.',
        musicUrl: 'https://open.spotify.com/artist/28yYHnTOSfRnktvIbsuiiK',
      },
      {
        id: 'mats-erlandsson',
        time: '12:00',
        nameEn: 'Mats Erlandsson',
        bioEn: 'Electroacoustic composer (Stockholm) processing field recordings and acoustic instruments through cycles of re-amplification and synthesis, building durational drone works where acoustic and electronic sources become indistinguishable. His album Glory Fades (January 2025, XKatedral) was made with Yair Elazar Glotman.',
        bioFr: 'Compositeur électroacoustique (Stockholm) traitant enregistrements de terrain et instruments acoustiques par des cycles de ré-amplification et de synthèse, construisant des œuvres drones de longue durée où sources acoustiques et électroniques deviennent indiscernables. Son album Glory Fades (janvier 2025, XKatedral) a été réalisé avec Yair Elazar Glotman.',
        musicUrl: 'https://open.spotify.com/artist/5HAu4Np5pmLMUoI194nAEs',
      },
      {
        id: 'miriam-adefris',
        time: '13:00',
        nameEn: 'Miriam Adefris',
        bioEn: 'Austrian–Ethiopian harpist (London) using live electronics to push the harp into unfamiliar territory. Collaborator of Floating Points, Ganavya, and Shabaka Hutchings; her trio Flur\'s debut album Plunge appeared in September 2025 on Latency.',
        bioFr: 'Harpiste austro-éthiopienne (Londres) utilisant l\'électronique en direct pour emmener la harpe vers des territoires inattendus. Collaboratrice de Floating Points, Ganavya et Shabaka Hutchings ; le premier album de son trio Flur, Plunge, est paru en septembre 2025 sur Latency.',
        musicUrl: 'https://open.spotify.com/artist/6BgP6cMSLzjiRKwT098mev',
      },
      {
        time: '14:00',
        labelEn: 'Déjeuner',
        labelFr: 'Déjeuner',
        nameEn: 'Harry Lester',
      },
    ],
  },
]

const scheduleTextClass = 'text-[24px] max-[740px]:text-[20px] leading-[1.2] tracking-[0.04em]'
const bioTextClass = 'text-[19px] max-[740px]:text-[16px] leading-[1.45] tracking-[0.03em] max-w-[30em] mx-auto'

export function ScheduleSection() {
  const { lang } = useLang()
  const isFr = lang === 'fr'

  return (
    <div className={`flex flex-col gap-12 text-center ${scheduleTextClass}`}>
      {schedule.map((day, i) => (
        <div key={i} className="flex flex-col gap-4">
          <p className="uppercase">{isFr ? day.dayFr : day.dayEn}</p>
          <div className="flex flex-col gap-7">
            {day.entries.map((entry, j) => {
              const name = (isFr && entry.nameFr) ? entry.nameFr : entry.nameEn
              const label = (isFr && entry.labelFr) ? entry.labelFr : entry.labelEn
              const tag = (isFr && entry.tagFr) ? entry.tagFr : entry.tagEn
              const bio = (isFr && entry.bioFr) ? entry.bioFr : entry.bioEn

              return (
                <div key={j} id={entry.id} className="flex flex-col items-center gap-1 scroll-mt-6">
                  <span className="tabular-nums leading-[1.3]">{entry.time}</span>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="leading-[1.3]">
                      {label && <>{label} : </>}
                      {entry.musicUrl ? (
                        <a
                          href={entry.musicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={siteInlineLinkClass}
                        >
                          {name}
                        </a>
                      ) : (
                        name
                      )}
                      {tag && <> {tag}</>}
                    </span>
                    {bio && <p className={bioTextClass}>{bio}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
