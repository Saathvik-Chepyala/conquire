import type { Category, Listing } from '../data/types'

export const BUDGETS = [
  { key: 'under-25k', label: 'Under $25K', min: 0, max: 25_000 },
  { key: '25-50k', label: '$25K – $50K', min: 25_000, max: 50_000 },
  { key: '50-100k', label: '$50K – $100K', min: 50_000, max: 100_000 },
] as const

export type BudgetKey = (typeof BUDGETS)[number]['key']

/** The buyer's "buy box": answers to the pop-up survey. */
export interface BuyBox {
  categories: Category[]
  budget: BudgetKey | null
  minSde: number | null
  industries: string[]
}

export const EMPTY_BUY_BOX: BuyBox = { categories: [], budget: null, minSde: null, industries: [] }

export function budgetOverlaps(listing: Listing, key: BudgetKey): boolean {
  const band = BUDGETS.find((b) => b.key === key)
  if (!band) return true
  const { low, high } = listing.teaser.valuation
  return low <= band.max && high >= band.min
}

/**
 * 0–100 match score. Business-type match 40 · industry match 30 · valuation
 * overlaps budget 30. An unanswered question counts as "no preference" and
 * awards its points, so a blank buy box scores every listing 100.
 */
export function matchScore(listing: Listing, box: BuyBox): number {
  const t = listing.teaser
  let score = 0
  if (box.categories.length === 0 || box.categories.includes(t.category)) score += 40
  if (box.industries.length === 0 || box.industries.includes(t.industry)) score += 30
  if (!box.budget) score += 30
  else if (budgetOverlaps(listing, box.budget)) score += 30
  else {
    // "close": within 25% of the band edges still earns half credit
    const band = BUDGETS.find((b) => b.key === box.budget)!
    if (t.valuation.low <= band.max * 1.25 && t.valuation.high >= band.min * 0.75) score += 15
  }
  return score
}
