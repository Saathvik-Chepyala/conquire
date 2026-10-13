import type { Category, Listing } from '../data/types'
import { BUDGETS, matchScore, type BudgetKey, type BuyBox } from './buyBox'
import { sdeOf, valuationMid } from './format'

/** Listings per page on /buy. */
export const PAGE_SIZE = 8

export const SDE_OPTIONS = [10_000, 20_000, 30_000, 40_000]
export const MARGIN_OPTIONS = [30, 50, 70]

export type SortKey = 'match' | 'newest' | 'price-asc' | 'price-desc'
export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'match', label: 'Best match' },
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
]

export interface Filters {
  category: Category | ''
  industry: string
  state: string
  price: BudgetKey | ''
  minSde: number
  minMargin: number
  sort: SortKey
}

export const DEFAULT_FILTERS: Filters = {
  category: '',
  industry: '',
  state: '',
  price: '',
  minSde: 0,
  minMargin: 0,
  sort: 'newest',
}

export function isDefaultFilters(f: Filters): boolean {
  return (
    f.category === '' &&
    f.industry === '' &&
    f.state === '' &&
    f.price === '' &&
    f.minSde === 0 &&
    f.minMargin === 0
  )
}

/** Pre-fill the filter bar from the buy box (single selections only; multi-selects stay open). */
export function filtersFromBuyBox(box: BuyBox): Filters {
  const minSde = box.minSde ? ([...SDE_OPTIONS].reverse().find((o) => o <= box.minSde!) ?? 0) : 0
  return {
    ...DEFAULT_FILTERS,
    category: box.categories.length === 1 ? box.categories[0] : '',
    industry: box.industries.length === 1 ? box.industries[0] : '',
    price: box.budget ?? '',
    minSde,
    sort: 'match',
  }
}

export function applyFilters(listings: Listing[], f: Filters, box: BuyBox | null): Listing[] {
  const band = f.price ? BUDGETS.find((b) => b.key === f.price) : undefined
  const out = listings.filter((l) => {
    const t = l.teaser
    if (f.category && t.category !== f.category) return false
    if (f.industry && t.industry !== f.industry) return false
    if (f.state && t.location.state !== f.state) return false
    if (band && !(t.valuation.low <= band.max && t.valuation.high >= band.min)) return false
    if (f.minSde && sdeOf(l) < f.minSde) return false
    if (f.minMargin && t.metrics.grossMarginPct < f.minMargin) return false
    return true
  })

  const byNewest = (a: Listing, b: Listing) => b.createdAt.localeCompare(a.createdAt)
  switch (f.sort) {
    case 'match':
      if (box) out.sort((a, b) => matchScore(b, box) - matchScore(a, box) || byNewest(a, b))
      else out.sort(byNewest)
      break
    case 'newest':
      out.sort(byNewest)
      break
    case 'price-asc':
      out.sort((a, b) => valuationMid(a) - valuationMid(b))
      break
    case 'price-desc':
      out.sort((a, b) => valuationMid(b) - valuationMid(a))
      break
  }
  return out
}
