import type { Listing, Valuation } from '../data/types'

export function money(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export function moneyShort(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (abs >= 10_000) return `$${Math.round(n / 1000)}K`
  if (abs >= 1_000) return `$${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return `$${Math.round(n)}`
}

export const pct = (n: number) => `${n}%`
export const signedPct = (n: number) => (n > 0 ? `+${n}%` : `${n}%`)

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const rangeLabel = (v: Pick<Valuation, 'low' | 'high'>) => `${moneyShort(v.low)} – ${moneyShort(v.high)}`

export const sdeOf = (l: Listing) =>
  Math.round((l.teaser.metrics.revenueTTM * l.teaser.metrics.sdeMarginPct) / 100)

export const valuationMid = (l: Listing) => (l.teaser.valuation.low + l.teaser.valuation.high) / 2

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
