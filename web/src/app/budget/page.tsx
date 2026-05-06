'use client'

import { useState } from 'react'

// At the Notion base of 150 guests, food/drink items show 200 covers each.
// This 4:3 ratio reflects ~1.3 meal sessions per guest across the 3-day event
// (2 dinners + 2 lunches, not every guest attends every service).
function covers(guests: number) {
  return Math.round(guests * 4 / 3)
}

const EXPENSES = [
  {
    label: 'Music',
    items: [
      { label: 'Artist fee', total: 14000 },
      { label: 'Artist travel', total: 5000 },
      { label: 'SACEM taxes', total: 1400 },
      { label: 'Mixer rental (×3)', total: 447 },
      { label: 'Misc audio (×3)', total: 294 },
    ],
  },
  {
    label: 'Location',
    items: [
      { label: 'Daily rental (×3)', total: 4800 },
      { label: 'Lighting rental (×3)', total: 300 },
      { label: 'Cleaning supplies', total: 300 },
      { label: 'Misc decor', total: 300 },
      { label: 'Candles (×100)', total: 100 },
      { label: 'Glasses (×150)', total: 673.5 },
    ],
  },
  {
    label: 'Food & drink',
    items: [
      { label: 'Base chef fee', total: 13000 },
      { label: 'Wine', total: 3000 },
      { label: 'Beer', total: 200 },
      { label: 'Breakfast (×3 days)', total: 600 },
      { label: 'Chef accommodation', total: 300 },
      { label: 'Additional costs (×3)', total: 300 },
    ],
  },
  {
    label: 'Additional fees',
    items: [
      { label: 'Staff fees (×6)', total: 2400 },
      { label: 'Staff accommodation (×6)', total: 1260 },
      { label: 'Staff travel (×6)', total: 900 },
      { label: 'Contingency', total: 2000 },
      { label: 'Insurance', total: 140 },
    ],
  },
]

const TOTAL_EXPENSES = EXPENSES.reduce(
  (sum, cat) => sum + cat.items.reduce((s, i) => s + i.total, 0),
  0,
)

function fmt(n: number) {
  const abs = Math.abs(Math.round(n))
  const s = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return '€' + s
}

function fmtProfit(n: number) {
  return (n >= 0 ? '+' : '−') + fmt(Math.abs(n))
}

function Row({ label, amount, sub }: { label: string; amount: string; sub?: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <div className="flex items-baseline gap-3 min-w-0">
        <span className="text-[20px] max-[740px]:text-[17px] leading-snug tracking-[0.02em] shrink-0">{label}</span>
        {sub && <span className="text-[13px] tracking-[0.04em] opacity-40 truncate">{sub}</span>}
      </div>
      <span className="text-[20px] max-[740px]:text-[17px] tracking-[0.02em] tabular-nums shrink-0">{amount}</span>
    </div>
  )
}

function SubRow({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4 pl-4">
      <span className="text-[15px] tracking-[0.03em] opacity-50">{label}</span>
      <span className="text-[15px] tracking-[0.03em] tabular-nums opacity-50 shrink-0">{amount}</span>
    </div>
  )
}

export default function BudgetPage() {
  const [guests, setGuests] = useState(150)

  const c = covers(guests)
  const early    = Math.round(guests / 3)
  const standard = guests - early

  const ticketIncome  = early * 160 + standard * 180
  const dinnerIncome  = c * 60
  const lunchIncome   = c * 45
  const drinkIncome   = c * 60  // 20 dinner + 10 lunch + 30 afters
  const merchIncome   = 1600
  const totalIncome   = ticketIncome + dinnerIncome + lunchIncome + drinkIncome + merchIncome
  const netProfit     = totalIncome - TOTAL_EXPENSES

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'var(--font-diatype), sans-serif', fontWeight: 400 }}>
      <div className="px-10 max-[740px]:px-4 py-10 max-w-[680px]">

        {/* Title */}
        <p className="text-[34px] max-[740px]:text-[28px] leading-none tracking-[-0.02em] uppercase mb-12">
          Budget
        </p>

        {/* Guest input */}
        <div className="mb-12 flex flex-col gap-4">
          <p className="text-[13px] tracking-[0.08em] uppercase opacity-50">Guests</p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGuests(g => Math.max(1, g - 10))}
                className="w-9 h-9 border border-black/30 text-[18px] leading-none hover:border-black transition-colors"
              >−</button>
              <input
                type="number"
                value={guests}
                min={1}
                onChange={e => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-[4.5rem] text-center text-[28px] leading-none tracking-[-0.02em] tabular-nums border-b border-black bg-transparent outline-none"
              />
              <button
                onClick={() => setGuests(g => g + 10)}
                className="w-9 h-9 border border-black/30 text-[18px] leading-none hover:border-black transition-colors"
              >+</button>
            </div>
            <input
              type="range"
              min={50}
              max={400}
              value={guests}
              onChange={e => setGuests(Number(e.target.value))}
              className="flex-1 accent-black"
            />
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="flex gap-10 flex-wrap pb-10 mb-12 border-b border-black/15">
          {[
            { label: 'Income',   value: fmt(totalIncome),       plain: true },
            { label: 'Expenses', value: fmt(TOTAL_EXPENSES),    plain: true },
            { label: 'Profit',   value: fmtProfit(netProfit),   plain: false },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[13px] tracking-[0.08em] uppercase opacity-50 mb-1">{label}</p>
              <p className="text-[34px] max-[740px]:text-[26px] leading-none tracking-[-0.02em] tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        {/* INCOME */}
        <section className="mb-12">
          <div className="flex justify-between items-baseline mb-6">
            <p className="text-[13px] tracking-[0.08em] uppercase opacity-50">Income</p>
            <p className="text-[13px] tracking-[0.08em] tabular-nums opacity-50">{fmt(totalIncome)}</p>
          </div>
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <Row label="Tickets" amount={fmt(ticketIncome)} />
              <SubRow label={`Early bird  ${early} × €160`}      amount={fmt(early * 160)} />
              <SubRow label={`Standard  ${standard} × €180`}     amount={fmt(standard * 180)} />
            </div>

            <Row label="Dinner"      amount={fmt(dinnerIncome)} sub={`${c} covers × €60`} />
            <Row label="Lunch"       amount={fmt(lunchIncome)}  sub={`${c} covers × €45`} />

            <div className="flex flex-col gap-1">
              <Row label="Beverages" amount={fmt(drinkIncome)} />
              <SubRow label={`Dinner drinks  ${c} × €20`}  amount={fmt(c * 20)} />
              <SubRow label={`Lunch drinks  ${c} × €10`}   amount={fmt(c * 10)} />
              <SubRow label={`Afters  ${c} × €30`}         amount={fmt(c * 30)} />
            </div>

            <Row label="Merchandise" amount={fmt(merchIncome)} sub="40 × €40" />
          </div>
        </section>

        {/* EXPENSES */}
        <section>
          <div className="flex justify-between items-baseline mb-6 pt-10 border-t border-black/15">
            <p className="text-[13px] tracking-[0.08em] uppercase opacity-50">Expenses (fixed)</p>
            <p className="text-[13px] tracking-[0.08em] tabular-nums opacity-50">{fmt(TOTAL_EXPENSES)}</p>
          </div>
          <div className="flex flex-col gap-8">
            {EXPENSES.map(cat => {
              const catTotal = cat.items.reduce((s, i) => s + i.total, 0)
              return (
                <div key={cat.label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline gap-4 mb-1">
                    <span className="text-[13px] tracking-[0.08em] uppercase opacity-50">{cat.label}</span>
                    <span className="text-[13px] tracking-[0.08em] tabular-nums opacity-50">{fmt(catTotal)}</span>
                  </div>
                  {cat.items.map(item => (
                    <Row key={item.label} label={item.label} amount={fmt(item.total)} />
                  ))}
                </div>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
