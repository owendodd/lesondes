'use client'

import { useLang } from '@/hooks/useLang'
import { siteBodyClass } from '@/lib/siteSpacing'

const schedule = [
  {
    dayEn: 'Friday 29 May',
    dayFr: 'Vendredi 29 mai',
    entries: [
      { time: '16:00', name: 'Apéro set : Horasse (La Becque)' },
      { time: '18:00', name: 'Chantal Michelle' },
      { time: '19:00', name: 'Youmna Saba' },
      { time: '19:45', name: 'Lubomyr Melnyk' },
      { time: '21:00', name: 'Dîner : Harry Lester' },
      { time: '23:00', name: 'Afters set : Souleymane (Latency)' },
    ],
  },
  {
    dayEn: 'Saturday 30 May',
    dayFr: 'Samedi 30 mai',
    entries: [
      { time: '07:00', name: 'Offsite : Josephine Foster' },
      { time: '12:00', name: 'Fredrik Rasten' },
      { time: '13:00', name: 'CTM' },
      { time: '14:00', name: 'Déjeuner : Harry Lester' },
      { time: '17:00', name: 'Lukas De Clerck' },
      { time: '18:00', name: 'Elisabeth Klinck' },
      { time: '19:00', name: 'Pierre Bastien & Louis Laurain' },
      { time: '20:00', name: 'Mohammad Reza Mortazavi' },
      { time: '21:00', name: 'Dîner : Harry Lester' },
      { time: '23:00', name: 'Afters set : Yu Su (Short Span)' },
    ],
  },
  {
    dayEn: 'Sunday 31 May',
    dayFr: 'Dimanche 31 mai',
    entries: [
      { time: '07:00', name: 'Offsite : Mohammad Reza Mortazavi' },
      { time: '11:00', name: 'Maya Dhondt' },
      { time: '12:00', name: 'Mats Erlandsson' },
      { time: '13:00', name: 'Miriam Adefris' },
      { time: '14:00', name: 'Déjeuner : Harry Lester' },
    ],
  },
]

export function ScheduleContent() {
  const { lang } = useLang()

  return (
    <div className="px-10 max-[740px]:px-4 pb-8">
      <div className={`flex flex-col gap-12 ${siteBodyClass}`}>
        {schedule.map((day, i) => (
          <div key={i} className="flex flex-col gap-4">
            <p className="uppercase">{lang === 'fr' ? day.dayFr : day.dayEn}</p>
            <div className="flex flex-col gap-2">
              {day.entries.map((entry, j) => (
                <div key={j} className="flex gap-5 leading-[1.3]">
                  <span className="tabular-nums shrink-0 w-[3.2em]">{entry.time}</span>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
