import { CATEGORIES, type Category } from '../data/types'
import { BUDGETS, type BudgetKey } from '../lib/buyBox'
import { MARGIN_OPTIONS, SDE_OPTIONS, SORTS, isDefaultFilters, type Filters, type SortKey } from '../lib/filters'
import { moneyShort } from '../lib/format'

interface Props {
  filters: Filters
  industries: string[]
  states: string[]
  hasBuyBox: boolean
  onChange: (patch: Partial<Filters>) => void
  onClear: () => void
  onEditBuyBox: () => void
}

export function FilterBar({ filters, industries, states, hasBuyBox, onChange, onClear, onEditBuyBox }: Props) {
  return (
    <div className="filter-bar" role="group" aria-label="Filters">
      <span className="filter-label">Filter</span>
      <select
        aria-label="Business type"
        value={filters.category}
        onChange={(e) => onChange({ category: e.target.value as Category | '' })}
      >
        <option value="">All types</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select aria-label="Industry" value={filters.industry} onChange={(e) => onChange({ industry: e.target.value })}>
        <option value="">All industries</option>
        {industries.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
      <select aria-label="State" value={filters.state} onChange={(e) => onChange({ state: e.target.value })}>
        <option value="">Anywhere</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        aria-label="Price"
        value={filters.price}
        onChange={(e) => onChange({ price: e.target.value as BudgetKey | '' })}
      >
        <option value="">Any price</option>
        {BUDGETS.map((b) => (
          <option key={b.key} value={b.key}>
            {b.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Minimum owner earnings"
        value={filters.minSde}
        onChange={(e) => onChange({ minSde: Number(e.target.value) })}
      >
        <option value={0}>Any cash flow</option>
        {SDE_OPTIONS.map((v) => (
          <option key={v} value={v}>
            {moneyShort(v)}+ owner earnings
          </option>
        ))}
      </select>
      <select
        aria-label="Minimum gross margin"
        value={filters.minMargin}
        onChange={(e) => onChange({ minMargin: Number(e.target.value) })}
      >
        <option value={0}>Any margin</option>
        {MARGIN_OPTIONS.map((v) => (
          <option key={v} value={v}>
            {v}%+ gross margin
          </option>
        ))}
      </select>
      {!isDefaultFilters(filters) && (
        <button className="link-btn small" onClick={onClear}>
          Clear filters
        </button>
      )}
      <span className="spacer" />
      <span className="filter-label">Sort</span>
      <select aria-label="Sort" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value as SortKey })}>
        {SORTS.filter((s) => s.key !== 'match' || hasBuyBox).map((s) => (
          <option key={s.key} value={s.key}>
            {s.label}
          </option>
        ))}
      </select>
      <button className="btn btn-ghost btn-sm" onClick={onEditBuyBox}>
        {hasBuyBox ? 'Edit my buy box' : 'Set my buy box'}
      </button>
    </div>
  )
}
