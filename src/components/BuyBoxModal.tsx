import { useEffect, useState } from 'react'
import { CATEGORIES, type Category } from '../data/types'
import { BUDGETS, EMPTY_BUY_BOX, type BudgetKey, type BuyBox } from '../lib/buyBox'

interface Props {
  open: boolean
  initial: BuyBox | null
  industries: string[]
  onSave: (box: BuyBox) => void
  onDismiss: () => void
}

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

export function BuyBoxModal({ open, initial, industries, onSave, onDismiss }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [budget, setBudget] = useState<BudgetKey | null>(null)
  const [minSde, setMinSde] = useState('')
  const [picked, setPicked] = useState<string[]>([])

  useEffect(() => {
    if (!open) return
    const b = initial ?? EMPTY_BUY_BOX
    setCategories(b.categories)
    setBudget(b.budget)
    setMinSde(b.minSde ? String(b.minSde) : '')
    setPicked(b.industries)
  }, [open, initial])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onDismiss()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onDismiss])

  if (!open) return null

  const save = () => {
    const n = parseInt(minSde.replace(/[^0-9]/g, ''), 10)
    onSave({ categories, budget, minSde: Number.isFinite(n) && n > 0 ? n : null, industries: picked })
  }

  return (
    <div className="modal-overlay" onMouseDown={onDismiss}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="buybox-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <span className="eyebrow">Quick survey · 3 questions</span>
        <h2 id="buybox-title">What are you looking for?</h2>
        <p className="muted">
          This sets your buy box. We use it to rank listings by match score and pre-fill your filters. You can
          change it any time.
        </p>

        <div className="modal-q">
          <h4>1. What type of businesses?</h4>
          <div className="chip-row">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className="chip-select"
                aria-pressed={categories.includes(c)}
                onClick={() => setCategories((cur) => toggle(cur, c))}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-q">
          <h4>2. Financial profile</h4>
          <div className="chip-row" style={{ marginBottom: 12 }}>
            {BUDGETS.map((b) => (
              <button
                key={b.key}
                type="button"
                className="chip-select"
                aria-pressed={budget === b.key}
                onClick={() => setBudget((cur) => (cur === b.key ? null : b.key))}
              >
                {b.label}
              </button>
            ))}
          </div>
          <div className="field" style={{ maxWidth: 320, marginBottom: 0 }}>
            <label htmlFor="buybox-sde">Minimum annual owner earnings (optional)</label>
            <input
              id="buybox-sde"
              inputMode="numeric"
              placeholder="e.g. 20000"
              value={minSde}
              onChange={(e) => setMinSde(e.target.value)}
            />
            <span className="hint">Owner earnings = profit with the owner's salary and one-time costs added back.</span>
          </div>
        </div>

        <div className="modal-q">
          <h4>3. Which industries?</h4>
          <div className="chip-row">
            {industries.map((i) => (
              <button
                key={i}
                type="button"
                className="chip-select"
                aria-pressed={picked.includes(i)}
                onClick={() => setPicked((cur) => toggle(cur, i))}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onDismiss}>
            Skip for now
          </button>
          <button className="btn btn-primary" onClick={save}>
            Show my matches
          </button>
        </div>
      </div>
    </div>
  )
}
