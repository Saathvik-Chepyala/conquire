// Shape of one listing in src/data/listings.json.
// Edit the JSON, not this file, to change sample listings.

export const CATEGORIES = ['eCommerce', 'Service', 'Retail', 'Food & Beverage', 'Digital', 'Other'] as const
export type Category = (typeof CATEGORIES)[number]

export const GROWTH_TRENDS = ['up', 'flat', 'down'] as const
export type GrowthTrend = (typeof GROWTH_TRENDS)[number]

export const CONFIDENCES = ['Low', 'Medium', 'High'] as const
export type Confidence = (typeof CONFIDENCES)[number]

export interface RevenueStream {
  name: string
  sharePct: number
}

export interface Valuation {
  low: number
  high: number
  confidence: Confidence
  confidenceNote: string
}

export interface TeaserMetrics {
  revenueTTM: number
  grossMarginPct: number
  sdeMarginPct: number
  revenueStreams: RevenueStream[]
  yoyGrowthPct: number
  hoursPerWeek: number
}

/** Everything a buyer sees BEFORE signing the NDA. Must never identify the business. */
export interface Teaser {
  category: Category
  industry: string
  tagline: string
  location: { city: string; state: string }
  platform: string
  yearsInBusiness: number
  reasonForSale: string
  revenueRange: string
  profitRange: string
  growthTrend: GrowthTrend
  valuation: Valuation
  metrics: TeaserMetrics
  valueDrivers: string[]
}

export interface KeyFigure {
  label: string
  value: string
  source: string
}

export interface Memo {
  confirmedOn: string
  executiveSummary: string
  businessOverview: string
  industryAndMarket: string
  growthOpportunities: string[]
  transitionPlan: string
  askingPrice: number
  keyFigures: KeyFigure[]
  flaggedGaps: string[]
  sources: string[]
}

/** Everything a buyer sees AFTER signing the NDA. */
export interface Confidential {
  businessName: string
  url?: string
  memo: Memo
  customerProfiles: string[]
  revenues: { year: number; amount: number }[]
  expenses: { category: string; amount: number }[]
  ownership: string
  headwinds: string[]
  tailwinds: string[]
}

export interface Listing {
  id: string
  createdAt: string
  teaser: Teaser
  confidential: Confidential
}
