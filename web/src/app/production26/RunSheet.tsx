'use client'

import { useState, useEffect, useRef } from 'react'

// ─── People & teams ───────────────────────────────────────────────────────────

type PersonKey =
  | 'owen' | 'ashley' | 'mailys' | 'noah'
  | 'aine'
  | 'harry'
  | 'clara' | 'nikolaj' | 'vilda'
  | 'victorg' | 'romain'
  | 'suli'
  | 'kesiah'
  | 'allteam'

const TEAMS = {
  prod:    { bg: '#e5e7eb', fg: '#374151' },
  artists: { bg: '#ede9fe', fg: '#5b21b6' },
  kitchen: { bg: '#fed7aa', fg: '#9a3412' },
  bar:     { bg: '#ccfbf1', fg: '#0f766e' },
  sound:   { bg: '#dbeafe', fg: '#1d4ed8' },
  dj:      { bg: '#ffe4e6', fg: '#be123c' },
  video:   { bg: '#fef3c7', fg: '#92400e' },
  all:     { bg: '#f1f5f9', fg: '#475569' },
} as const

type TeamKey = keyof typeof TEAMS

const PEOPLE: Record<PersonKey, { label: string; team: TeamKey }> = {
  owen:    { label: 'Owen',     team: 'prod'    },
  ashley:  { label: 'Ashley',   team: 'prod'    },
  mailys:  { label: 'Maïlys',   team: 'prod'    },
  noah:    { label: 'Noah',     team: 'prod'    },
  aine:    { label: 'Aine',     team: 'artists' },
  harry:   { label: 'Harry',    team: 'kitchen' },
  clara:   { label: 'Clara',    team: 'bar'     },
  nikolaj: { label: 'Nikolaj',  team: 'bar'     },
  vilda:   { label: 'Vilda',    team: 'bar'     },
  victorg: { label: 'Victor G', team: 'sound'   },
  romain:  { label: 'Romain',   team: 'sound'   },
  suli:    { label: 'Suli',     team: 'dj'      },
  kesiah:  { label: 'Kesiah',   team: 'video'   },
  allteam: { label: 'All team', team: 'all'     },
}

// ─── Schedule data ────────────────────────────────────────────────────────────

type Entry = {
  id: string
  time: string
  task: string
  who: PersonKey[]
  perf?: boolean
}

type Day = {
  label: string
  entries: Entry[]
}

// All times are CEST (UTC+2)
const DAYS: Day[] = [
  {
    label: 'Monday 25 May',
    entries: [
      { id: 'm25-1', time: '09:00', task: 'Pickup car',                         who: ['owen'] },
      { id: 'm25-2', time: '10:00', task: 'Pickup subwoofers',                  who: ['owen'] },
      { id: 'm25-3', time: '14:00', task: 'Pickup beer from Deck and Donahue',  who: ['owen'] },
      { id: 'm25-4', time: '15:00', task: 'Pickup coffee machine from Mardi',   who: ['owen'] },
      { id: 'm25-5', time: '15:00', task: 'Pack everything',                     who: ['owen', 'aine', 'noah'] },
      { id: 'm25-6', time: '16:00', task: 'Any last-minute shopping',            who: ['owen', 'aine', 'noah'] },
    ],
  },
  {
    label: 'Tuesday 26 May',
    entries: [
      { id: 't26-1', time: '09:30', task: 'Pickup sound system from Guillaume', who: ['owen', 'noah'] },
      { id: 't26-2', time: '13:00', task: 'Pickup wine from Nicolas Renard',    who: ['owen', 'noah'] },
      { id: 't26-3', time: '16:30', task: 'Pick up wine — Clermont',            who: ['owen', 'noah'] },
      { id: 't26-4', time: '19:00', task: 'Pick up wine — Tristian',            who: ['owen', 'noah'] },
    ],
  },
  {
    label: 'Wednesday 27 May',
    entries: [
      { id: 'w27-1',  time: '09:00', task: 'Pickup wine from Pauline',                               who: ['owen', 'noah'] },
      { id: 'w27-2',  time: '09:00', task: 'Drive to Cerbère',                                       who: ['owen', 'noah'] },
      { id: 'w27-3',  time: '12:00', task: 'Pickup wine along the way',                              who: ['owen', 'noah'] },
      { id: 'w27-4',  time: '13:00', task: 'Pickup canvases / glasses in Banyuls',                   who: ['owen', 'noah'] },
      { id: 'w27-5',  time: '14:00', task: 'Arrive in Cerbère + unload all gear',                    who: ['owen', 'noah'] },
      { id: 'w27-6',  time: '14:00', task: 'SYNC with team',                                         who: ['owen', 'ashley', 'mailys', 'aine'] },
      { id: 'w27-7',  time: '15:00', task: 'Hotel walkthrough',                                      who: ['owen', 'noah', 'ashley'] },
      { id: 'w27-8',  time: '15:30', task: 'Set up command center',                                  who: ['owen', 'ashley'] },
      { id: 'w27-9',  time: '16:00', task: 'Set up zone for instruments + sound equipment storage',  who: ['owen', 'noah'] },
      { id: 'w27-10', time: '16:30', task: 'Set up green room near stage for artists',               who: ['owen', 'noah'] },
      { id: 'w27-11', time: '17:00', task: 'Set up sound system in Theater',                         who: ['owen', 'noah'] },
      { id: 'w27-12', time: '18:00', task: 'Initial sound tests',                                    who: ['owen', 'noah'] },
      { id: 'w27-13', time: '18:00', task: 'Prep welcome packages for artists',                      who: ['ashley'] },
      { id: 'w27-14', time: '19:00', task: 'Meet with pétanque club',                                who: ['owen', 'noah', 'ashley'] },
    ],
  },
  {
    label: 'Thursday 28 May',
    entries: [
      { id: 'th28-1',  time: '11:00', task: 'Set up bar + organize wine',                                                       who: ['nikolaj', 'vilda'] },
      { id: 'th28-2',  time: '11:00', task: 'Set up signage + style interior',                                                   who: ['ashley'] },
      { id: 'th28-3',  time: '12:00', task: 'Tune piano',                                                                        who: [] },
      { id: 'th28-4',  time: '13:00', task: 'Speaker tests in each performance area',                                            who: ['victorg', 'romain'] },
      { id: 'th28-5',  time: '14:00', task: 'Prep tables in each performance area',                                              who: ['owen', 'victorg', 'romain'] },
      { id: 'th28-6',  time: '15:00', task: 'BIG MEETING — hotel team (cleaners, JC run sheet review, lighting operators)',      who: ['ashley', 'owen', 'aine', 'mailys'] },
      { id: 'th28-7',  time: '15:00', task: 'Walkthrough with Kesiah',                                                           who: ['ashley', 'kesiah'] },
      { id: 'th28-8',  time: '15:00', task: 'Harry + team arrive',                                                               who: ['harry'] },
      { id: 'th28-9',  time: '15:00', task: 'Kitchen walkthrough + setup with Harry',                                            who: ['harry', 'ashley'] },
      { id: 'th28-10', time: '16:00', task: 'Initial artist arrivals',                                                           who: ['aine'] },
      { id: 'th28-11', time: '17:00', task: 'Initial soundcheck — Lubomyr (Theatre)',                                            who: ['owen', 'victorg', 'romain'] },
      { id: 'th28-12', time: '18:00', task: 'Pre-BBQ team meeting',                                                              who: ['owen', 'ashley', 'aine', 'mailys', 'victorg', 'romain', 'kesiah', 'nikolaj', 'vilda'] },
      { id: 'th28-13', time: '19:00', task: 'BBQ + pétanque',                                                                    who: ['allteam'] },
      { id: 'th28-15', time: '20:00', task: 'Victor G + Romain arrive',                                                          who: ['victorg', 'romain'] },
      { id: 'th28-14', time: '23:00', task: 'Early night',                                                                       who: ['allteam'] },
    ],
  },
  {
    label: 'Friday 29 May',
    entries: [
      { id: 'f29-1',  time: '09:00', task: 'Signage finalized',                                   who: ['ashley', 'mailys'] },
      { id: 'f29-2',  time: '10:00', task: 'Set up welcome packages for artists',                  who: ['ashley'] },
      { id: 'f29-3',  time: '10:00', task: 'Final morning walkthrough — core team',               who: ['owen', 'ashley', 'aine', 'mailys', 'nikolaj', 'vilda'] },
      { id: 'f29-5',  time: '11:00', task: 'Sound system moves to Ballroom',                      who: ['owen', 'victorg', 'romain'] },
      { id: 'f29-6',  time: '12:00', task: 'Clara arrives',                                       who: ['clara', 'owen'] },
      { id: 'f29-7',  time: '12:00', task: 'Clear + style check-in area',                        who: ['ashley'] },
      { id: 'f29-8',  time: '13:00', task: 'Soundcheck — Chantal + Lukas (Ballroom, 45 min)',    who: ['victorg', 'romain'] },
      { id: 'f29-9',  time: '13:00', task: 'Simple lunch — team',                                 who: ['allteam'] },
      { id: 'f29-10', time: '14:00', task: 'Bar setup finalized',                                 who: ['clara', 'nikolaj'] },
      { id: 'f29-4',  time: '14:00', task: 'Soundcheck — Lubomyr (Theater, 60 min)',              who: ['victorg', 'romain'] },
      { id: 'f29-11', time: '14:00', task: 'Horasse set begins',                                  who: [] },
      { id: 'f29-12', time: '15:00', task: 'Initial guest check-ins',                             who: ['mailys'] },
      { id: 'f29-13', time: '15:00', task: 'Soundcheck — Youmna (Theater, 60 min)',               who: ['victorg', 'romain'] },
      { id: 'f29-14', time: '15:00', task: 'Hotel cleaning team',                                 who: ['ashley', 'vilda'] },
      { id: 'f29-15', time: '18:00', task: 'Chantal + Lukas — Ballroom',                         who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 'f29-16', time: '19:00', task: 'Youmna — Theater',                                   who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 'f29-17', time: '18:30', task: 'Move sound system to Theater',                       who: ['owen', 'victorg', 'romain'] },
      { id: 'f29-18', time: '19:45', task: 'Lubomyr — Theater',                                  who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 'f29-19', time: '21:00', task: 'Dinner',                                             who: ['allteam'] },
      { id: 'f29-21', time: '22:30', task: 'All hands clean + clear',                            who: ['allteam'] },
      { id: 'f29-22', time: '23:00', task: 'Suli DJ set — Bar',                                  who: ['suli', 'owen'] },
      { id: 'f29-23', time: '01:00', task: 'MUSIC CURFEW',                                       who: ['allteam'] },
    ],
  },
  {
    label: 'Saturday 30 May',
    entries: [
      { id: 's30-1',  time: '06:30', task: 'Early morning setup for Josephine Foster',            who: ['ashley'] },
      { id: 's30-2',  time: '07:00', task: 'Josephine Foster — Walter Benjamin Memorial',        who: ['ashley', 'kesiah'], perf: true },
      { id: 's30-3',  time: '08:00', task: 'Soundcheck — Fredrik (Theater, 1.5h)',               who: ['victorg', 'romain'] },
      { id: 's30-4',  time: '09:30', task: 'Breakfast',                                          who: ['allteam'] },
      { id: 's30-6',  time: '09:00', task: 'Hotel cleaning team',                                who: ['ashley', 'vilda'] },
      { id: 's30-7',  time: '09:00', task: 'Verify cleaning + morning setup',                    who: ['ashley'] },
      { id: 's30-8',  time: '09:30', task: 'Soundcheck — CTM (Theater, 1.5h)',                   who: ['victorg', 'romain'] },
      { id: 's30-9',  time: '10:00', task: 'Bar restock',                                        who: ['clara', 'nikolaj'] },
      { id: 's30-10', time: '11:00', task: 'Soundcheck — Elisabeth (Theater, 1h)',               who: ['victorg', 'romain'] },
      { id: 's30-10b',time: '10:30', task: 'Soundcheck — Lukas (Ballroom, 45 min)',              who: ['victorg', 'romain'] },
      { id: 's30-11', time: '12:00', task: 'Fredrik — Theater',                                  who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 's30-12', time: '13:00', task: 'CTM — Theater',                                     who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 's30-13', time: '14:00', task: 'Lunch',                                              who: ['allteam'] },
      { id: 's30-14', time: '15:00', task: 'Soundcheck — Pierre Bastien & Louis Laurain (Theater)', who: ['victorg', 'romain'] },
      { id: 's30-15', time: '16:00', task: 'Soundcheck — Mohammad (Theater)',                    who: ['victorg', 'romain'] },
      { id: 's30-16', time: '16:00', task: 'Hotel cleaning team (afternoon)',                    who: ['ashley', 'vilda'] },
      { id: 's30-17', time: '16:00', task: 'Clean + reset',                                      who: ['ashley', 'vilda'] },
      { id: 's30-18', time: '17:00', task: 'Lukas — Ballroom',                                   who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 's30-19', time: '18:00', task: 'Elisabeth — Theater',                                who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 's30-20', time: '19:00', task: 'Pierre Bastien & Louis Laurain — Theater',           who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 's30-21', time: '20:00', task: 'Mohammad — Theater',                                 who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 's30-22', time: '21:00', task: 'Dinner',                                             who: ['allteam'] },
      { id: 's30-24', time: '22:30', task: 'All hands clean + clearing',                        who: ['allteam'] },
      { id: 's30-25', time: '23:00', task: 'Yu Su DJ set — Bar',                                 who: ['owen'] },
      { id: 's30-26', time: '01:00', task: 'MUSIC CURFEW',                                       who: ['allteam'] },
    ],
  },
  {
    label: 'Sunday 31 May',
    entries: [
      { id: 'su31-1',  time: '06:30', task: 'Early morning setup with Mohammad',           who: ['owen'] },
      { id: 'su31-2',  time: '07:00', task: 'Mohammad — outdoor performance',              who: ['owen', 'kesiah'], perf: true },
      { id: 'su31-4',  time: '08:00', task: 'Soundcheck — Maya (Theater, 45 min)',        who: ['victorg', 'romain'] },
      { id: 'su31-5',  time: '08:45', task: 'Soundcheck — Miriam (Theater, 45 min)',      who: ['victorg', 'romain'] },
      { id: 'su31-6',  time: '09:00', task: 'Hotel cleaning team',                        who: ['ashley'] },
      { id: 'su31-7',  time: '09:30', task: 'Soundcheck — Mats (Theater, 60 min)',        who: ['victorg', 'romain'] },
      { id: 'su31-8',  time: '10:00', task: 'Verify cleaning + morning setup',      who: ['ashley', 'vilda'] },
      { id: 'su31-9',  time: '10:00', task: 'Bar restock',                           who: ['clara', 'nikolaj'] },
      { id: 'su31-10', time: '11:00', task: 'Maya — Theater',                       who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 'su31-11', time: '12:00', task: 'Mats — Theater',                       who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 'su31-12', time: '13:00', task: 'Miriam — Theater',                     who: ['victorg', 'romain', 'kesiah'], perf: true },
      { id: 'su31-3',   time: '09:30', task: 'Breakfast',                                                       who: ['allteam'] },
      { id: 'su31-dep1', time: '10:50', task: 'CTM (Caecillie + Jakob) depart — taxi to Portbou station',   who: ['aine'] },
      { id: 'su31-dep2', time: '12:45', task: 'Lukas de Clerck departs — drop to Portbou station',           who: ['aine'] },
      { id: 'su31-dep3', time: '12:45', task: 'Mohammad Reza Mortazavi departs — shuttle to Portbou',        who: ['aine'] },
      { id: 'su31-dep4', time: '13:30', task: 'Youmna Saba departs — drop to Cerbère station',               who: ['aine'] },
      { id: 'su31-dep5', time: '14:00', task: 'Mats Erlandsson departs — drop to Portbou (14:35 train)',     who: ['aine'] },
      { id: 'su31-dep6', time: 'TBC',   task: 'Lubomyr Melnyk departs — to Stockholm',                       who: ['aine'] },
      { id: 'su31-dep7', time: 'TBC',   task: 'Pierre Bastien departs — to Montpellier/Amsterdam',           who: ['aine'] },
      { id: 'su31-13', time: '14:00', task: 'Closing lunch',                        who: ['allteam'] },
      { id: 'su31-14', time: '15:30', task: 'All hands clean + clear',              who: ['allteam'] },
      { id: 'su31-15', time: '16:00', task: 'Start pack down',                      who: ['owen'] },
    ],
  },
  {
    label: 'Monday 1 June',
    entries: [
      { id: 'mo1-dep1', time: 'TBC',   task: 'Louis Laurain + family depart',                              who: ['aine'] },
      { id: 'mo1-dep2', time: 'TBC',   task: 'Fredrik Rasten + Mareike depart — train + flight to Berlin', who: ['aine'] },
      { id: 'mo1-dep3', time: 'TBC',   task: 'Maya Dhondt departs — return to Brussels',                   who: ['aine'] },
      { id: 'mo1-dep4', time: 'TBC',   task: 'Elisabeth Klinck departs — return to Brussels',              who: ['aine'] },
      { id: 'mo1-dep5', time: '12:28', task: 'Chantal Michelle departs — train Cerbère to Paris',          who: ['aine'] },
      { id: 'mo1-dep6', time: '15:30', task: 'Miriam Adefris departs — taxi to Portbou station',           who: ['aine'] },
      { id: 'mo1-dep7', time: '19:05', task: 'Yu Su departs — taxi to Portbou, train to Girona',           who: ['aine'] },
    ],
  },
]

// ─── Persisted state shape ────────────────────────────────────────────────────

type CustomItem = {
  id: string
  dayLabel: string
  time: string
  task: string
  who: PersonKey[]
}

type BuiltinOverride = {
  time?: string
  task?: string
  who?: PersonKey[]
}

type PersistedState = {
  checked: string[]
  customItems: CustomItem[]
  deletedBuiltin: string[]
  editedBuiltin: Record<string, BuiltinOverride>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeToSort(t: string): number {
  const [h, m] = t.split(':').map(n => parseInt(n) || 0)
  const mins = h * 60 + m
  return mins < 360 ? mins + 1440 : mins
}

const F = 'var(--font-diatype), ui-sans-serif, sans-serif'

const INPUT_STYLE: React.CSSProperties = {
  fontFamily: F,
  fontSize: 13,
  border: '1px solid rgba(0,0,0,0.15)',
  borderRadius: 5,
  padding: '6px 10px',
  background: '#fff',
  outline: 'none',
  color: '#0a0a0a',
  width: '100%',
  boxSizing: 'border-box',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Chip({ personKey }: { personKey: PersonKey }) {
  const p = PEOPLE[personKey]
  const t = TEAMS[p.team]
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 10,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      padding: '2px 7px',
      borderRadius: 999,
      background: t.bg,
      color: t.fg,
      whiteSpace: 'nowrap',
      lineHeight: 1.6,
    }}>
      {p.label}
    </span>
  )
}

function CheckboxBtn({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-checked={checked}
      role="checkbox"
      style={{
        flexShrink: 0,
        width: 18,
        height: 18,
        border: '1.5px solid',
        borderColor: checked ? '#0a0a0a' : 'rgba(0,0,0,0.22)',
        borderRadius: 3,
        background: checked ? '#0a0a0a' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        marginTop: 2,
        fontFamily: F,
        transition: 'background 0.1s, border-color 0.1s',
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

function PersonSelector({
  selected,
  onChange,
}: {
  selected: PersonKey[]
  onChange: (who: PersonKey[]) => void
}) {
  function toggle(pk: PersonKey) {
    onChange(selected.includes(pk) ? selected.filter(k => k !== pk) : [...selected, pk])
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {(Object.keys(PEOPLE) as PersonKey[]).map(pk => {
        const p = PEOPLE[pk]
        const t = TEAMS[p.team]
        const active = selected.includes(pk)
        return (
          <button
            key={pk}
            type="button"
            onClick={() => toggle(pk)}
            style={{
              fontFamily: F,
              fontSize: 10,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              borderRadius: 999,
              border: '1px solid',
              cursor: 'pointer',
              background: active ? t.fg : t.bg,
              color: active ? '#fff' : t.fg,
              borderColor: active ? t.fg : 'transparent',
              lineHeight: 1.6,
            }}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}

function ItemForm({
  initialTime = '',
  initialTask = '',
  initialWho = [] as PersonKey[],
  submitLabel = 'Add',
  onSubmit,
  onCancel,
}: {
  initialTime?: string
  initialTask?: string
  initialWho?: PersonKey[]
  submitLabel?: string
  onSubmit: (time: string, task: string, who: PersonKey[]) => void
  onCancel: () => void
}) {
  const [time, setTime] = useState(initialTime)
  const [task, setTask] = useState(initialTask)
  const [who, setWho] = useState<PersonKey[]>(initialWho)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!task.trim()) return
    onSubmit(time.slice(0, 5), task.trim(), who)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#fafafa',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 7,
        padding: '14px 14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          style={{ ...INPUT_STYLE, width: 110, flexShrink: 0 }}
        />
        <input
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="Task description"
          required
          autoFocus
          style={INPUT_STYLE}
        />
      </div>
      <PersonSelector selected={who} onChange={setWho} />
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            fontFamily: F,
            fontSize: 12,
            padding: '5px 14px',
            borderRadius: 5,
            border: '1px solid rgba(0,0,0,0.15)',
            background: 'transparent',
            cursor: 'pointer',
            color: '#0a0a0a',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            fontFamily: F,
            fontSize: 12,
            padding: '5px 14px',
            borderRadius: 5,
            border: 'none',
            background: '#0a0a0a',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RunSheet() {
  // ── Persisted state ──
  const [checked, setChecked]               = useState<Set<string>>(new Set())
  const [customItems, setCustomItems]       = useState<CustomItem[]>([])
  const [deletedBuiltin, setDeletedBuiltin] = useState<Set<string>>(new Set())
  const [editedBuiltin, setEditedBuiltin]   = useState<Record<string, BuiltinOverride>>({})
  const [loaded, setLoaded]                 = useState(false)

  // ── UI state ──
  const [filter, setFilter]           = useState<PersonKey | null>(null)
  const [addingDay, setAddingDay]     = useState<string | null>(null)
  const [openMenu, setOpenMenu]       = useState<string | null>(null)
  const [confirmId, setConfirmId]     = useState<string | null>(null)
  const [editingId, setEditingId]     = useState<string | null>(null)

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Sync helpers ──

  function buildPersistedState(
    c: Set<string>,
    ci: CustomItem[],
    db: Set<string>,
    eb: Record<string, BuiltinOverride>,
  ): PersistedState {
    return { checked: [...c], customItems: ci, deletedBuiltin: [...db], editedBuiltin: eb }
  }

  function applyServerState(s: PersistedState) {
    setChecked(new Set(s.checked ?? []))
    setCustomItems(s.customItems ?? [])
    setDeletedBuiltin(new Set(s.deletedBuiltin ?? []))
    setEditedBuiltin((s.editedBuiltin ?? {}) as Record<string, BuiltinOverride>)
  }

  function scheduleSync(state: PersistedState) {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      fetch('/api/runsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      }).catch(() => {})
    }, 600)
  }

  // ── Load on mount ──
  useEffect(() => {
    fetch('/api/runsheet')
      .then(r => r.json())
      .then(data => { if (data) applyServerState(data) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  // ── Poll every 30 s (skip when a form is open) ──
  useEffect(() => {
    const id = setInterval(() => {
      if (addingDay !== null || editingId !== null) return
      fetch('/api/runsheet')
        .then(r => r.json())
        .then(data => { if (data) applyServerState(data) })
        .catch(() => {})
    }, 30_000)
    return () => clearInterval(id)
  }, [addingDay, editingId])

  // ── Close overflow menu on outside click ──
  useEffect(() => {
    if (!openMenu) return
    function onDoc(e: MouseEvent) {
      const target = e.target as Element
      if (!target.closest('[data-menu]')) {
        setOpenMenu(null)
        setConfirmId(null)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [openMenu])

  // ── Actions ──

  function toggleCheck(id: string) {
    const next = new Set(checked)
    next.has(id) ? next.delete(id) : next.add(id)
    setChecked(next)
    scheduleSync(buildPersistedState(next, customItems, deletedBuiltin, editedBuiltin))
  }

  function addItem(dayLabel: string, time: string, task: string, who: PersonKey[]) {
    const id = `custom-${Date.now()}`
    const next = [...customItems, { id, dayLabel, time, task, who }]
    setCustomItems(next)
    setAddingDay(null)
    scheduleSync(buildPersistedState(checked, next, deletedBuiltin, editedBuiltin))
  }

  function deleteItem(id: string, isCustom: boolean) {
    setOpenMenu(null)
    setConfirmId(null)
    if (isCustom) {
      const next = customItems.filter(i => i.id !== id)
      setCustomItems(next)
      scheduleSync(buildPersistedState(checked, next, deletedBuiltin, editedBuiltin))
    } else {
      const next = new Set(deletedBuiltin).add(id)
      setDeletedBuiltin(next)
      scheduleSync(buildPersistedState(checked, customItems, next, editedBuiltin))
    }
  }

  function saveEdit(id: string, isCustom: boolean, time: string, task: string, who: PersonKey[]) {
    setEditingId(null)
    if (isCustom) {
      const next = customItems.map(i => i.id === id ? { ...i, time, task, who } : i)
      setCustomItems(next)
      scheduleSync(buildPersistedState(checked, next, deletedBuiltin, editedBuiltin))
    } else {
      const next = { ...editedBuiltin, [id]: { time, task, who } }
      setEditedBuiltin(next)
      scheduleSync(buildPersistedState(checked, customItems, deletedBuiltin, next))
    }
  }

  function entryVisible(e: { who: PersonKey[] }): boolean {
    if (filter === null) return true
    if (e.who.length === 0) return true
    if (e.who.includes(filter)) return true
    if (filter !== 'allteam' && e.who.includes('allteam')) return true
    return false
  }

  // ── Render ──
  return (
    <div style={{ fontFamily: F, fontWeight: 400, color: '#0a0a0a', background: '#fff', minHeight: '100vh' }}>
      <style>{`
        .row-item:hover .overflow-btn { opacity: 1 !important; }
        .overflow-btn:focus { opacity: 1 !important; }
        @media (max-width: 580px) {
          .row-chips { margin-top: 4px; margin-left: 30px; }
          .row-inner { flex-wrap: wrap; }
        }
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
        }
        input[type="time"]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
      `}</style>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, lineHeight: 1, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            Les Ondes run sheet
          </h1>
        </div>

        {/* Person filter */}
        <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 40 }}>
          <button
            onClick={() => setFilter(null)}
            style={{
              padding: '4px 12px', borderRadius: 999, fontSize: 11,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              border: '1px solid', cursor: 'pointer', fontFamily: F,
              background: filter === null ? '#0a0a0a' : 'transparent',
              color: filter === null ? '#fff' : '#0a0a0a',
              borderColor: filter === null ? '#0a0a0a' : 'rgba(0,0,0,0.18)',
            }}
          >
            Everyone
          </button>
          {(Object.keys(PEOPLE) as PersonKey[]).map(key => {
            const p = PEOPLE[key]
            const t = TEAMS[p.team]
            const active = filter === key
            return (
              <button
                key={key}
                onClick={() => setFilter(f => f === key ? null : key)}
                style={{
                  padding: '4px 12px', borderRadius: 999, fontSize: 11,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  border: '1px solid', cursor: 'pointer', fontFamily: F,
                  background: active ? t.fg : t.bg,
                  color: active ? '#fff' : t.fg,
                  borderColor: active ? t.fg : 'transparent',
                  fontWeight: active ? 500 : 400,
                }}
              >
                {p.label}
              </button>
            )
          })}
        </div>

        {/* Days */}
        {DAYS.map((day, di) => {
          // Merge built-in (with overrides/deletions) + custom items, sorted by time
          const builtinEntries: (Entry & { isCustom: false })[] = day.entries
            .filter(e => !deletedBuiltin.has(e.id))
            .map(e => {
              const ov = editedBuiltin[e.id]
              return {
                ...e,
                ...(ov ?? {}),
                who: (ov?.who ?? e.who) as PersonKey[],
                isCustom: false as const,
              }
            })

          const dayCustom: (CustomItem & { isCustom: true; perf?: boolean })[] = customItems
            .filter(i => i.dayLabel === day.label)
            .map(i => ({ ...i, isCustom: true as const }))

          const allEntries = [...builtinEntries, ...dayCustom]
            .sort((a, b) => timeToSort(a.time) - timeToSort(b.time))
            .filter(entryVisible)

          return (
            <div key={day.label} className={di >= 4 ? 'print-break' : ''} style={{ marginBottom: 44 }}>
              <div style={{ borderBottom: '1px solid rgba(0,0,0,0.12)', paddingBottom: 8, marginBottom: 2 }}>
                <p style={{ fontSize: 13, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 500 }}>
                  {day.label}
                </p>
              </div>

              <div>
                {allEntries.map(entry => {
                  const isChecked = checked.has(entry.id)
                  const menuOpen = openMenu === entry.id
                  const confirming = confirmId === entry.id

                  if (editingId === entry.id) {
                    return (
                      <div key={entry.id} style={{ padding: '8px 0' }}>
                        <ItemForm
                          initialTime={entry.time}
                          initialTask={entry.task}
                          initialWho={entry.who as PersonKey[]}
                          submitLabel="Save"
                          onSubmit={(time, task, who) => saveEdit(entry.id, entry.isCustom, time, task, who)}
                          onCancel={() => setEditingId(null)}
                        />
                      </div>
                    )
                  }

                  return (
                    <div
                      key={entry.id}
                      className="row-item"
                      style={{
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        padding: '8px 6px',
                        marginLeft: -6,
                        marginRight: -6,
                        borderRadius: 4,
                        background: entry.perf ? 'rgba(0,0,0,0.022)' : 'transparent',
                        borderLeft: entry.perf ? '2px solid rgba(0,0,0,0.13)' : '2px solid transparent',
                        position: 'relative',
                      }}
                    >
                      <div className="row-inner" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <CheckboxBtn checked={isChecked} onChange={() => toggleCheck(entry.id)} />

                        <span style={{
                          flexShrink: 0,
                          width: 44,
                          fontSize: 12,
                          fontVariantNumeric: 'tabular-nums',
                          opacity: isChecked ? 0.3 : 0.45,
                          paddingTop: 1,
                          letterSpacing: '0.01em',
                        }}>
                          {entry.time}
                        </span>

                        <span style={{
                          flex: 1,
                          fontSize: 13,
                          lineHeight: 1.5,
                          fontWeight: entry.perf ? 500 : 400,
                          opacity: isChecked ? 0.3 : entry.perf ? 1 : 0.85,
                          textDecoration: isChecked ? 'line-through' : 'none',
                          paddingTop: 1,
                          minWidth: 0,
                        }}>
                          {entry.task}
                        </span>

                        {entry.who.length > 0 && (
                          <div className="row-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 3, opacity: isChecked ? 0.3 : 1 }}>
                            {(entry.who as PersonKey[]).map(pk => <Chip key={pk} personKey={pk} />)}
                          </div>
                        )}

                        {/* Overflow menu trigger */}
                        <div data-menu style={{ position: 'relative', flexShrink: 0 }}>
                          <button
                            className="overflow-btn no-print"
                            onClick={e => {
                              e.stopPropagation()
                              if (menuOpen) { setOpenMenu(null); setConfirmId(null) }
                              else { setOpenMenu(entry.id); setConfirmId(null) }
                            }}
                            style={{
                              fontFamily: F,
                              width: 24,
                              height: 24,
                              borderRadius: 4,
                              border: 'none',
                              background: menuOpen ? 'rgba(0,0,0,0.07)' : 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: menuOpen ? 1 : 0.25,
                              transition: 'opacity 0.1s, background 0.1s',
                              padding: 0,
                              marginTop: 0,
                              color: '#0a0a0a',
                              fontSize: 16,
                              letterSpacing: '0.05em',
                            }}
                          >
                            ···
                          </button>

                          {menuOpen && (
                            <div
                              data-menu
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: 'calc(100% + 4px)',
                                zIndex: 100,
                                background: '#fff',
                                border: '1px solid rgba(0,0,0,0.1)',
                                borderRadius: 8,
                                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                minWidth: 170,
                                overflow: 'hidden',
                              }}
                            >
                              {confirming ? (
                                <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>Delete this item?</p>
                                  <div style={{ display: 'flex', gap: 6 }}>
                                    <button
                                      onClick={() => { setConfirmId(null); setOpenMenu(null) }}
                                      style={{
                                        fontFamily: F, fontSize: 12, flex: 1, padding: '5px 0',
                                        borderRadius: 5, border: '1px solid rgba(0,0,0,0.15)',
                                        background: 'transparent', cursor: 'pointer', color: '#0a0a0a',
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => deleteItem(entry.id, entry.isCustom)}
                                      style={{
                                        fontFamily: F, fontSize: 12, flex: 1, padding: '5px 0',
                                        borderRadius: 5, border: 'none',
                                        background: '#dc2626', cursor: 'pointer', color: '#fff',
                                        fontWeight: 500,
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => { setEditingId(entry.id); setOpenMenu(null) }}
                                    style={{
                                      fontFamily: F, fontSize: 13, width: '100%', padding: '10px 14px',
                                      border: 'none', background: 'transparent', cursor: 'pointer',
                                      textAlign: 'left', display: 'flex', alignItems: 'center', gap: 9,
                                      color: '#0a0a0a',
                                    }}
                                  >
                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ opacity: 0.5 }}>
                                      <path d="M9.5 1.5L11.5 3.5L4.5 10.5H2.5V8.5L9.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                                    </svg>
                                    Edit item
                                  </button>
                                  <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '0 8px' }} />
                                  <button
                                    onClick={() => setConfirmId(entry.id)}
                                    style={{
                                      fontFamily: F, fontSize: 13, width: '100%', padding: '10px 14px',
                                      border: 'none', background: 'transparent', cursor: 'pointer',
                                      textAlign: 'left', display: 'flex', alignItems: 'center', gap: 9,
                                      color: '#dc2626',
                                    }}
                                  >
                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ opacity: 0.7 }}>
                                      <path d="M2 4H11M5 4V2.5H8V4M4.5 4L5 10.5H8L8.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Delete item
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Add item form or button */}
                {addingDay === day.label ? (
                  <div style={{ padding: '10px 0 4px' }}>
                    <ItemForm
                      onSubmit={(time, task, who) => addItem(day.label, time, task, who)}
                      onCancel={() => setAddingDay(null)}
                    />
                  </div>
                ) : (
                  <button
                    className="no-print"
                    onClick={() => { setAddingDay(day.label); setEditingId(null) }}
                    style={{
                      fontFamily: F,
                      fontSize: 12,
                      opacity: 0.35,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      color: '#0a0a0a',
                      letterSpacing: '0.01em',
                      transition: 'opacity 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.35')}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Add item
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {/* Footer */}
        <div style={{ marginTop: 48, fontSize: 11, opacity: 0.3, letterSpacing: '0.04em' }}>
          <p>Les Ondes 2026 · Document interne · Ne pas distribuer</p>
        </div>

      </div>
    </div>
  )
}
