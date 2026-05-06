'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type FixedRow   = { id: string; label: string; qty: number | ''; price: number | '' }
type DerivedRow = { id: string; label: string; derived: true; rate: number }
type Row        = FixedRow | DerivedRow
type Category   = { id: string; label: string; rows: Row[] }

const uid = () => Math.random().toString(36).slice(2, 9)

function rowValue(r: Row, ticketIncome = 0): number {
  if ('derived' in r && r.derived) return ticketIncome * r.rate / 100
  const fixed = r as FixedRow
  const q = fixed.qty === '' ? 0 : fixed.qty
  const p = fixed.price === '' ? 0 : fixed.price
  return q * p
}
function catValue(c: Category, ti = 0)    { return c.rows.reduce((s, r) => s + rowValue(r, ti), 0) }
function allValue(cats: Category[], ti = 0) { return cats.reduce((s, c) => s + catValue(c, ti), 0) }

// ─── Initial data ─────────────────────────────────────────────────────────────

const INIT_INCOME: Category[] = [
  { id: 'tickets', label: 'Tickets', rows: [
    { id: 'ti1', label: 'Friday',   qty:  38, price: 160 },
    { id: 'ti2', label: 'Saturday', qty:  44, price: 160 },
    { id: 'ti3', label: 'Sunday',   qty:  37, price: 160 },
  ]},
  { id: 'friday', label: 'Friday', rows: [
    { id: 'fi1', label: 'Dinner',        qty: 33, price: 60 },
    { id: 'fi2', label: 'Dinner drinks', qty: 33, price: 20 },
    { id: 'fi3', label: 'Afters drinks', qty: 33, price: 30 },
  ]},
  { id: 'saturday', label: 'Saturday', rows: [
    { id: 'si1', label: 'Lunch',         qty: 38, price: 45 },
    { id: 'si2', label: 'Lunch drinks',  qty: 38, price: 10 },
    { id: 'si3', label: 'Dinner',        qty: 38, price: 60 },
    { id: 'si4', label: 'Dinner drinks', qty: 38, price: 20 },
    { id: 'si5', label: 'Afters drinks', qty: 38, price: 30 },
  ]},
  { id: 'sunday', label: 'Sunday', rows: [
    { id: 'su1', label: 'Lunch',        qty: 32, price: 45 },
    { id: 'su2', label: 'Lunch drinks', qty: 32, price: 10 },
  ]},
  { id: 'merch', label: 'Merchandise', rows: [
    { id: 'me1', label: 'Merch sales', qty: 40, price: 40 },
  ]},
]

const INIT_EXPENSES: Category[] = [
  { id: 'music', label: 'Music', rows: [
    { id: 'e1', label: 'Artist fee',    qty: 1, price: 14000 },
    { id: 'e2', label: 'Artist travel', qty: 1, price: 5000  },
    { id: 'e3', label: 'SACEM taxes',   derived: true, rate: 5.8 },
    { id: 'e4', label: 'Mixer rental',  qty: 3, price: 149   },
    { id: 'e5', label: 'Misc audio',    qty: 3, price: 98    },
  ]},
  { id: 'location', label: 'Location', rows: [
    { id: 'e6', label: 'Daily rental', qty: 3,   price: 1600 },
    { id: 'e7', label: 'Glasses',      qty: 150, price: 4.49 },
  ]},
  { id: 'food-drink', label: 'Food & drink', rows: [
    { id: 'e8',  label: 'Base chef fee',      qty: 1, price: 13000 },
    { id: 'e9',  label: 'Wine',               qty: 1, price: 3000  },
    { id: 'e10', label: 'Beer',               qty: 1, price: 200   },
    { id: 'e11', label: 'Breakfast',          qty: 3, price: 200   },
    { id: 'e12', label: 'Chef accommodation', qty: 1, price: 300   },
    { id: 'e13', label: 'Additional costs',   qty: 3, price: 100   },
  ]},
  { id: 'fees', label: 'Additional fees', rows: [
    { id: 'e14', label: 'Staff fees',          qty: 1, price: 2000 },
    { id: 'e15', label: 'Staff accommodation', qty: 6, price: 210  },
    { id: 'e16', label: 'Staff travel',        qty: 6, price: 150  },
    { id: 'e17', label: 'Contingency',         qty: 1, price: 2000 },
    { id: 'e18', label: 'Insurance',           qty: 1, price: 140  },
  ]},
]

// ─── Formatting ───────────────────────────────────────────────────────────────

function fmt(n: number) {
  return '€' + Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
function fmtProfit(n: number) {
  return (n >= 0 ? '+' : '−') + fmt(n)
}

// ─── Inputs ───────────────────────────────────────────────────────────────────

const inputBase = 'w-full bg-transparent outline-none border-b border-transparent focus:border-black/20 transition-colors'
const ROW = 'text-[18px] max-[740px]:text-[15px] leading-snug tracking-[0.02em]'

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input type="text" value={value} placeholder="Item name"
      className={`${inputBase} placeholder:opacity-20`}
      onChange={e => onChange(e.target.value)} />
  )
}

function NumInput({ value, onChange, step = 1, className = '' }: {
  value: number | ''; onChange: (v: number | '') => void; step?: number; className?: string
}) {
  return (
    <input type="number" step={step} value={value}
      className={`${inputBase} text-right ${className}`}
      onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
  )
}

// ─── Budget section ───────────────────────────────────────────────────────────

function BudgetSection({ title, cats, setCats, ticketIncome = 0 }: {
  title: string
  cats: Category[]
  setCats: React.Dispatch<React.SetStateAction<Category[]>>
  ticketIncome?: number
}) {
  const total = allValue(cats, ticketIncome)

  function updateRow(catId: string, rowId: string, updated: Row) {
    setCats(cs => cs.map(c => c.id !== catId ? c : {
      ...c, rows: c.rows.map(r => r.id === rowId ? updated : r),
    }))
  }
  function deleteRow(catId: string, rowId: string) {
    setCats(cs => cs.map(c => c.id !== catId ? c : {
      ...c, rows: c.rows.filter(r => r.id !== rowId),
    }))
  }
  function addRow(catId: string) {
    setCats(cs => cs.map(c => c.id !== catId ? c : {
      ...c, rows: [...c.rows, { id: uid(), label: '', qty: 1, price: 0 }],
    }))
  }

  return (
    <div>
      <div className="flex justify-between items-baseline mb-5">
        <p className="text-[13px] tracking-[0.08em] uppercase opacity-40">{title}</p>
        <p className="text-[13px] tracking-[0.08em] tabular-nums opacity-40">{fmt(total)}</p>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-[11px] tracking-[0.08em] uppercase border-b border-black/10">
            <th className="text-left font-normal py-2 pr-6 opacity-30">Item</th>
            <th className="text-right font-normal py-2 pr-6 w-14 opacity-30">Qty</th>
            <th className="text-right font-normal py-2 pr-6 w-32 opacity-30">Price</th>
            <th className="text-right font-normal py-2 w-24 opacity-30">Total</th>
            <th className="w-6" />
          </tr>
        </thead>

        {cats.map((cat, ci) => (
          <tbody key={cat.id}>
            <tr>
              <td colSpan={5} className={`${ci === 0 ? 'pt-4' : 'pt-7'} pb-1.5 text-[11px] tracking-[0.08em] uppercase opacity-25`}>
                {cat.label}
              </td>
            </tr>

            {cat.rows.map(row => {
              const val = rowValue(row, ticketIncome)
              const isDerived = 'derived' in row && row.derived
              return (
                <tr key={row.id} className="group border-b border-black/[0.04]">
                  <td className={`py-2 pr-6 ${ROW}`}>
                    <TextInput value={row.label}
                      onChange={v => updateRow(cat.id, row.id, { ...row, label: v } as Row)} />
                  </td>

                  {isDerived ? (
                    <td colSpan={2} className={`py-2 pr-6 ${ROW} tabular-nums`}>
                      <div className="flex items-baseline justify-end gap-1.5">
                        <NumInput step={0.1} value={(row as DerivedRow).rate} className="w-12"
                          onChange={v => updateRow(cat.id, row.id, { ...row, rate: v === '' ? 0 : v } as Row)} />
                        <span className="opacity-30 text-[13px] whitespace-nowrap">% of tickets</span>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className={`py-2 pr-6 ${ROW} tabular-nums`}>
                        <NumInput value={(row as FixedRow).qty}
                          onChange={v => updateRow(cat.id, row.id, { ...row, qty: v } as Row)} />
                      </td>
                      <td className={`py-2 pr-6 ${ROW} tabular-nums`}>
                        <div className="flex items-baseline justify-end gap-0.5">
                          <span className="opacity-25 text-[13px]">€</span>
                          <NumInput step={0.01} value={(row as FixedRow).price}
                            onChange={v => updateRow(cat.id, row.id, { ...row, price: v } as Row)} />
                        </div>
                      </td>
                    </>
                  )}

                  <td className={`py-2 text-right ${ROW} tabular-nums`}>{fmt(val)}</td>
                  <td className="py-2 pl-2">
                    <button onClick={() => deleteRow(cat.id, row.id)}
                      className="opacity-0 group-hover:opacity-20 hover:!opacity-50 text-[15px] leading-none transition-opacity">×</button>
                  </td>
                </tr>
              )
            })}

            <tr>
              <td colSpan={5} className="pt-1.5 pb-2">
                <button onClick={() => addRow(cat.id)}
                  className="text-[12px] tracking-[0.06em] opacity-20 hover:opacity-50 transition-opacity">
                  + Add row
                </button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SavedState = { income: Category[]; expenses: Category[] }

export default function BudgetPage() {
  const [income,     setIncome]     = useState<Category[]>(INIT_INCOME)
  const [expenses,   setExpenses]   = useState<Category[]>(INIT_EXPENSES)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const saveTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized = useRef(false)

  // Load persisted state on mount
  useEffect(() => {
    fetch('/api/budget')
      .then(r => r.json())
      .then((data: SavedState | null) => {
        if (data?.income)   setIncome(data.income)
        if (data?.expenses) setExpenses(data.expenses)
        initialized.current = true
      })
      .catch(() => { initialized.current = true })
  }, [])

  // Debounced auto-save
  const save = useCallback((state: SavedState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveStatus('saving')
    saveTimer.current = setTimeout(() => {
      fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
        .then(() => setSaveStatus('saved'))
        .catch(() => setSaveStatus('idle'))
    }, 800)
  }, [])

  useEffect(() => {
    if (!initialized.current) return
    save({ income, expenses })
  }, [income, expenses, save])

  // Ticket income feeds SACEM
  const tTickets  = allValue(income.filter(c => c.id === 'tickets'))
  const tIncome   = allValue(income)
  const tExpenses = allValue(expenses, tTickets)
  const profit    = tIncome - tExpenses

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'var(--font-diatype), sans-serif', fontWeight: 400 }}>
      <div className="px-10 max-[740px]:px-4 py-10 max-w-[740px]">

        <div className="flex justify-between items-baseline mb-12">
          <p className="text-[34px] max-[740px]:text-[28px] leading-none tracking-[-0.02em] uppercase">Budget</p>
          <p className="text-[13px] tracking-[0.06em] opacity-25">
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved' : ''}
          </p>
        </div>

        {/* Summary KPIs */}
        <div className="flex gap-10 flex-wrap pb-10 mb-12 border-b border-black/15">
          {[
            { label: 'Income',   value: fmt(tIncome)      },
            { label: 'Expenses', value: fmt(tExpenses)    },
            { label: 'Profit',   value: fmtProfit(profit) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[13px] tracking-[0.08em] uppercase opacity-40 mb-1">{label}</p>
              <p className="text-[34px] max-[740px]:text-[26px] leading-none tracking-[-0.02em] tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        <BudgetSection title="Income"   cats={income}   setCats={setIncome} />

        <div className="mt-14 pt-10 border-t border-black/15">
          <BudgetSection title="Expenses" cats={expenses} setCats={setExpenses} ticketIncome={tTickets} />
        </div>

      </div>
    </div>
  )
}
