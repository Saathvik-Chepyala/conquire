import type { Category, Confidence } from '../data/types'
import { money, moneyShort, signedPct } from './format'

export interface StreamInput {
  name: string
  sharePct: string
}
export interface ExpenseInput {
  category: string
  amount: string
}

/** Everything the seller wizard collects. Inputs are kept as strings; parse with num(). */
export interface SellerForm {
  // 1 · Basics
  businessName: string
  url: string
  category: Category | ''
  industry: string
  city: string
  state: string
  yearFounded: string
  platform: string
  tagline: string
  reasonForSale: string
  // 2 · Financials
  revenueTTM: string
  grossMarginPct: string
  netProfit: string
  yoyGrowthPct: string
  streams: StreamInput[]
  connected: string[]
  // 3 · Operations
  hoursPerWeek: string
  ownership: string
  customerProfiles: string
  growthOpportunities: string
  headwinds: string
  tailwinds: string
  // 4 · Confidential details
  expenses: ExpenseInput[]
  ownerSalary: string
  oneTimeExpenses: string
  unverifiedNotes: string
  // 5 · Review
  confirmed: boolean
}

export const EMPTY_FORM: SellerForm = {
  businessName: '',
  url: '',
  category: '',
  industry: '',
  city: '',
  state: 'TX',
  yearFounded: '',
  platform: '',
  tagline: '',
  reasonForSale: '',
  revenueTTM: '',
  grossMarginPct: '',
  netProfit: '',
  yoyGrowthPct: '',
  streams: [
    { name: '', sharePct: '' },
    { name: '', sharePct: '' },
  ],
  connected: [],
  hoursPerWeek: '',
  ownership: 'Single owner, 100%',
  customerProfiles: '',
  growthOpportunities: '',
  headwinds: '',
  tailwinds: '',
  expenses: [
    { category: 'Cost of goods', amount: '' },
    { category: 'Software & platform fees', amount: '' },
    { category: 'Marketing', amount: '' },
  ],
  ownerSalary: '',
  oneTimeExpenses: '',
  unverifiedNotes: '',
  confirmed: false,
}

export const num = (s: string): number => {
  const n = parseFloat(String(s).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

export const lines = (s: string): string[] =>
  s
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean)

/** Fields that count toward completeness and are flagged in the memo if missing. */
const REQUIRED: { key: keyof SellerForm; label: string }[] = [
  { key: 'businessName', label: 'Business name' },
  { key: 'category', label: 'Business type' },
  { key: 'industry', label: 'Industry' },
  { key: 'city', label: 'City' },
  { key: 'yearFounded', label: 'Year founded' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'reasonForSale', label: 'Reason for sale' },
  { key: 'revenueTTM', label: 'Trailing-12-month revenue' },
  { key: 'grossMarginPct', label: 'Gross margin' },
  { key: 'netProfit', label: 'Net profit' },
  { key: 'yoyGrowthPct', label: 'Year-over-year growth' },
  { key: 'hoursPerWeek', label: 'Hours per week' },
  { key: 'customerProfiles', label: 'Customer profiles' },
  { key: 'growthOpportunities', label: 'Growth opportunities' },
  { key: 'headwinds', label: 'Headwinds' },
  { key: 'tailwinds', label: 'Tailwinds' },
  { key: 'ownerSalary', label: 'Owner salary add-back' },
]

export function completeness(form: SellerForm): { ratio: number; missing: string[] } {
  const missing = REQUIRED.filter(({ key }) => {
    const v = form[key]
    return typeof v === 'string' ? v.trim() === '' : !v
  }).map((r) => r.label)
  const streamsOk = form.streams.some((s) => s.name.trim() && num(s.sharePct) > 0)
  const expensesOk = form.expenses.some((e) => e.category.trim() && num(e.amount) > 0)
  if (!streamsOk) missing.push('Revenue streams')
  if (!expensesOk) missing.push('Expenses by category')
  const total = REQUIRED.length + 2
  return { ratio: (total - missing.length) / total, missing }
}

export const sdeOfForm = (f: SellerForm) => num(f.netProfit) + num(f.ownerSalary) + num(f.oneTimeExpenses)

export interface Estimate {
  low: number
  high: number
  confidence: Confidence
  note: string
  multipleLow: number
  multipleHigh: number
  sde: number
}

/** SDE × multiple range. Illustrative only; mirrors deck slide 6 (estimate, not an appraisal). */
export function estimateValuation(form: SellerForm): Estimate {
  const sde = sdeOfForm(form)
  const yoy = num(form.yoyGrowthPct)
  let multipleLow = 1.5
  let multipleHigh = 2.75
  if (yoy >= 20) {
    multipleLow += 0.25
    multipleHigh += 0.35
  } else if (yoy >= 10) {
    multipleLow += 0.1
    multipleHigh += 0.15
  } else if (yoy <= -10) {
    multipleLow -= 0.35
    multipleHigh -= 0.35
  } else if (yoy < 0) {
    multipleLow -= 0.15
    multipleHigh -= 0.15
  }

  const { ratio } = completeness(form)
  const verified = form.connected.length > 0
  const score = Math.min(1, ratio + (verified ? 0.15 : 0))
  let confidence: Confidence
  let note: string
  let low = sde * multipleLow
  let high = sde * multipleHigh
  if (score < 0.5) {
    confidence = 'Low'
    note = 'Several fields are empty and nothing is verified yet. Fill the gaps or connect a platform to narrow this range.'
    low *= 0.85
    high *= 1.15
  } else if (score < 0.9) {
    confidence = 'Medium'
    note = verified
      ? 'Platform data is connected, but a few fields are still missing.'
      : 'Most fields are filled, but every number is seller-reported. Connect Stripe, Shopify, or QuickBooks to narrow this.'
  } else {
    confidence = 'High'
    note = 'Complete profile with connected financial data.'
    const mid = (low + high) / 2
    low = mid - (mid - low) * 0.8
    high = mid + (high - mid) * 0.8
  }
  const round = (n: number) => Math.max(0, Math.round(n / 500) * 500)
  return { low: round(low), high: round(high), confidence, note, multipleLow, multipleHigh, sde }
}

export interface MemoDraft {
  executiveSummary: string
  businessOverview: string
  industryAndMarket: string
  growthOpportunities: string[]
  transitionPlan: string
  askingPrice: number
  keyFigures: { label: string; value: string; source: string }[]
  flaggedGaps: string[]
}

/** Template-based memo. In the real product this is where the AI draft comes from. */
export function buildMemo(form: SellerForm, est: Estimate): MemoDraft {
  const name = form.businessName.trim() || 'This business'
  const year = new Date().getFullYear()
  const age = form.yearFounded ? Math.max(1, year - num(form.yearFounded)) : null
  const industry = form.industry.trim() || 'small'
  const category = form.category || 'business'
  const categoryWord = category === 'eCommerce' ? 'eCommerce' : category.toLowerCase()
  const where = [form.city.trim(), form.state.trim()].filter(Boolean).join(', ') || 'Texas'
  const revenue = num(form.revenueTTM)
  const sde = est.sde
  const streams = form.streams.filter((s) => s.name.trim()).map((s) => `${s.name.trim()} (${num(s.sharePct)}%)`)
  const hours = num(form.hoursPerWeek)
  const tail = lines(form.tailwinds)
  const head = lines(form.headwinds)
  const growth = lines(form.growthOpportunities)
  const { missing } = completeness(form)

  const source = (platformHint?: string) => {
    if (platformHint && form.connected.includes(platformHint)) return `Connected ${platformHint} data (demo)`
    if (form.connected.length) return `Connected ${form.connected[0]} data (demo)`
    return 'Seller-reported, unverified'
  }

  const askingPrice = Math.round((est.low + est.high) / 2 / 500) * 500

  return {
    executiveSummary: `${name} is a${age ? ` ${age}-year-old` : ''} ${industry.toLowerCase()} ${category === 'Other' ? '' : categoryWord + ' '}business in ${where}, generating ${money(revenue)} in trailing-twelve-month revenue and ${money(sde)} in owner earnings (SDE). ${form.reasonForSale ? `Reason for sale: ${form.reasonForSale.trim().replace(/\.$/, '')}. ` : ''}Conquire's estimate places the value at ${moneyShort(est.low)} – ${moneyShort(est.high)} with ${est.confidence.toLowerCase()} confidence.`,
    businessOverview: `${streams.length ? `Revenue comes from ${streams.join(', ')}. ` : ''}Gross margin is ${num(form.grossMarginPct)}% and year-over-year growth is ${signedPct(num(form.yoyGrowthPct))}. The business takes about ${hours || '—'} hours a week to run${form.platform ? ` and operates on ${form.platform}` : ''}. Ownership: ${form.ownership || 'not stated'}.${form.customerProfiles ? ` Typical customers: ${lines(form.customerProfiles).join('; ')}.` : ''}`,
    industryAndMarket: `${industry} businesses of this size trade on owner earnings rather than revenue. Conquire benchmarks the ${est.multipleLow.toFixed(2)}×–${est.multipleHigh.toFixed(2)}× SDE multiple against BizBuySell Insight Reports and sold-deal data for comparable ${category === 'Other' ? '' : categoryWord + ' '}businesses.${tail.length ? ` Tailwinds: ${tail.join('; ')}.` : ''}${head.length ? ` Headwinds: ${head.join('; ')}.` : ''}`,
    growthOpportunities: growth.length
      ? growth
      : ['Seller has not listed growth opportunities yet (flagged below).'],
    transitionPlan: `The seller offers a ${hours && hours < 15 ? 'two-week' : '30-day'} training period, hands over ${form.platform || 'platform'} accounts, supplier contacts, and customer lists at close, and stays reachable by email for 60 days afterward.`,
    askingPrice,
    keyFigures: [
      { label: 'Revenue (TTM)', value: money(revenue), source: source('Shopify') },
      { label: 'Owner earnings (SDE)', value: money(sde), source: source('QuickBooks') },
      { label: 'Gross margin', value: `${num(form.grossMarginPct)}%`, source: source('Stripe') },
      { label: 'YoY growth', value: signedPct(num(form.yoyGrowthPct)), source: source() },
      { label: 'Draft asking price', value: money(askingPrice), source: 'Conquire estimate (SDE × multiple)' },
    ],
    flaggedGaps: [...missing.map((m) => `${m} not provided`), ...lines(form.unverifiedNotes)],
  }
}
