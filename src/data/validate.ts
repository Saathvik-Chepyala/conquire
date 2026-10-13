// Runtime check for src/data/listings.json. Throws a readable error that names
// the listing and the field, so a typo in the JSON fails loudly on load
// instead of rendering a blank card.
import { CATEGORIES, CONFIDENCES, GROWTH_TRENDS } from './types'
import type { Confidential, Listing, Memo, Teaser } from './types'

type Obj = Record<string, unknown>

function fail(path: string, message: string): never {
  throw new Error(`listings.json → ${path}: ${message}`)
}

function obj(v: unknown, path: string): Obj {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) fail(path, 'must be an object { ... }')
  return v as Obj
}

function str(o: Obj, key: string, path: string): string {
  const v = o[key]
  if (typeof v !== 'string' || v.trim() === '') fail(`${path}.${key}`, 'must be a non-empty string')
  return v
}

function optStr(o: Obj, key: string, path: string): string | undefined {
  const v = o[key]
  if (v === undefined) return undefined
  if (typeof v !== 'string') fail(`${path}.${key}`, 'must be a string if present')
  return v
}

function num(o: Obj, key: string, path: string): number {
  const v = o[key]
  if (typeof v !== 'number' || !Number.isFinite(v))
    fail(`${path}.${key}`, 'must be a plain number (no quotes, $ signs, or commas)')
  return v
}

function arr(o: Obj, key: string, path: string): unknown[] {
  const v = o[key]
  if (!Array.isArray(v)) fail(`${path}.${key}`, 'must be an array [ ... ]')
  return v
}

function strArr(o: Obj, key: string, path: string): string[] {
  return arr(o, key, path).map((v, i) => {
    if (typeof v !== 'string') fail(`${path}.${key}[${i}]`, 'must be a string')
    return v
  })
}

function oneOf<T extends string>(o: Obj, key: string, path: string, options: readonly T[]): T {
  const v = o[key]
  if (typeof v !== 'string' || !(options as readonly string[]).includes(v))
    fail(`${path}.${key}`, `must be one of ${options.map((x) => `"${x}"`).join(', ')}`)
  return v as T
}

function parseTeaser(raw: unknown, path: string): Teaser {
  const t = obj(raw, path)
  const loc = obj(t.location, `${path}.location`)
  const val = obj(t.valuation, `${path}.valuation`)
  const m = obj(t.metrics, `${path}.metrics`)
  const mp = `${path}.metrics`

  const valuation = {
    low: num(val, 'low', `${path}.valuation`),
    high: num(val, 'high', `${path}.valuation`),
    confidence: oneOf(val, 'confidence', `${path}.valuation`, CONFIDENCES),
    confidenceNote: str(val, 'confidenceNote', `${path}.valuation`),
  }
  if (valuation.high <= valuation.low) fail(`${path}.valuation`, 'high must be greater than low')
  if (valuation.high >= 100_000)
    fail(`${path}.valuation.high`, 'must be under $100,000 (Conquire lists businesses valued under $100K)')

  const streams = arr(m, 'revenueStreams', mp).map((s, i) => {
    const so = obj(s, `${mp}.revenueStreams[${i}]`)
    return { name: str(so, 'name', `${mp}.revenueStreams[${i}]`), sharePct: num(so, 'sharePct', `${mp}.revenueStreams[${i}]`) }
  })
  if (streams.length === 0) fail(`${mp}.revenueStreams`, 'needs at least one stream')
  const sum = streams.reduce((a, s) => a + s.sharePct, 0)
  if (sum !== 100) fail(`${mp}.revenueStreams`, `sharePct values must add up to 100 (currently ${sum})`)

  return {
    category: oneOf(t, 'category', path, CATEGORIES),
    industry: str(t, 'industry', path),
    tagline: str(t, 'tagline', path),
    location: { city: str(loc, 'city', `${path}.location`), state: str(loc, 'state', `${path}.location`) },
    platform: str(t, 'platform', path),
    yearsInBusiness: num(t, 'yearsInBusiness', path),
    reasonForSale: str(t, 'reasonForSale', path),
    revenueRange: str(t, 'revenueRange', path),
    profitRange: str(t, 'profitRange', path),
    growthTrend: oneOf(t, 'growthTrend', path, GROWTH_TRENDS),
    valuation,
    metrics: {
      revenueTTM: num(m, 'revenueTTM', mp),
      grossMarginPct: num(m, 'grossMarginPct', mp),
      sdeMarginPct: num(m, 'sdeMarginPct', mp),
      revenueStreams: streams,
      yoyGrowthPct: num(m, 'yoyGrowthPct', mp),
      hoursPerWeek: num(m, 'hoursPerWeek', mp),
    },
    valueDrivers: strArr(t, 'valueDrivers', path),
  }
}

function parseMemo(raw: unknown, path: string): Memo {
  const m = obj(raw, path)
  return {
    confirmedOn: str(m, 'confirmedOn', path),
    executiveSummary: str(m, 'executiveSummary', path),
    businessOverview: str(m, 'businessOverview', path),
    industryAndMarket: str(m, 'industryAndMarket', path),
    growthOpportunities: strArr(m, 'growthOpportunities', path),
    transitionPlan: str(m, 'transitionPlan', path),
    askingPrice: num(m, 'askingPrice', path),
    keyFigures: arr(m, 'keyFigures', path).map((k, i) => {
      const ko = obj(k, `${path}.keyFigures[${i}]`)
      const kp = `${path}.keyFigures[${i}]`
      return { label: str(ko, 'label', kp), value: str(ko, 'value', kp), source: str(ko, 'source', kp) }
    }),
    flaggedGaps: strArr(m, 'flaggedGaps', path),
    sources: strArr(m, 'sources', path),
  }
}

function parseConfidential(raw: unknown, path: string): Confidential {
  const c = obj(raw, path)
  return {
    businessName: str(c, 'businessName', path),
    url: optStr(c, 'url', path),
    memo: parseMemo(c.memo, `${path}.memo`),
    customerProfiles: strArr(c, 'customerProfiles', path),
    revenues: arr(c, 'revenues', path).map((r, i) => {
      const ro = obj(r, `${path}.revenues[${i}]`)
      return { year: num(ro, 'year', `${path}.revenues[${i}]`), amount: num(ro, 'amount', `${path}.revenues[${i}]`) }
    }),
    expenses: arr(c, 'expenses', path).map((e, i) => {
      const eo = obj(e, `${path}.expenses[${i}]`)
      return { category: str(eo, 'category', `${path}.expenses[${i}]`), amount: num(eo, 'amount', `${path}.expenses[${i}]`) }
    }),
    ownership: str(c, 'ownership', path),
    headwinds: strArr(c, 'headwinds', path),
    tailwinds: strArr(c, 'tailwinds', path),
  }
}

export function validateListings(raw: unknown): Listing[] {
  if (!Array.isArray(raw)) fail('(root)', 'the file must be a JSON array of listings: [ { ... }, { ... } ]')
  const seen = new Set<string>()
  return raw.map((item, i) => {
    const base = `listing #${i + 1}`
    const o = obj(item, base)
    const id = str(o, 'id', base)
    if (seen.has(id)) fail(`${base}.id`, `duplicate id "${id}" — every listing needs a unique id`)
    seen.add(id)
    const path = `listing "${id}"`
    const listing: Listing = {
      id,
      createdAt: str(o, 'createdAt', path),
      teaser: parseTeaser(o.teaser, `${path}.teaser`),
      confidential: parseConfidential(o.confidential, `${path}.confidential`),
    }
    // Anonymity guard: the teaser must never leak the business name.
    const name = listing.confidential.businessName.toLowerCase()
    const teaserText = JSON.stringify(listing.teaser).toLowerCase()
    if (name.length > 3 && teaserText.includes(name))
      fail(`${path}.teaser`, `contains the business name "${listing.confidential.businessName}" — teasers must stay anonymous`)
    return listing
  })
}
