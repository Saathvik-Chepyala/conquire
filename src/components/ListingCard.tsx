import { Link } from 'react-router-dom'
import type { Listing } from '../data/types'
import { CATEGORY_STYLE } from '../data/categories'
import { plural, rangeLabel, signedPct } from '../lib/format'
import { Icon } from './Icon'

export function ListingCard({ listing, score }: { listing: Listing; score: number | null }) {
  const t = listing.teaser
  const style = CATEGORY_STYLE[t.category]
  return (
    <Link to={`/buy/${listing.id}`} className="listing-card" aria-label={t.tagline}>
      <div className="listing-cover" style={{ background: style.bg, color: style.fg }}>
        <Icon name={style.icon} size={40} />
        {score !== null && <span className="chip chip-gold match">{score}% match</span>}
      </div>
      <div className="listing-body">
        <div className="chip-row">
          <span className="chip chip-teal">{t.category}</span>
          <span className="chip">{t.industry}</span>
        </div>
        <h3>{t.tagline}</h3>
        <div className="listing-price num">
          {rangeLabel(t.valuation)}
          <span className="conf">{t.valuation.confidence} confidence</span>
        </div>
        <div className="listing-meta">
          {t.location.city}, {t.location.state} · {plural(t.yearsInBusiness, 'yr')} · {t.platform}
        </div>
        <div className="listing-foot">
          <span className="muted">Revenue {t.revenueRange}</span>
          <span className={`trend trend-${t.growthTrend} num`}>
            <Icon name={`trend-${t.growthTrend}`} size={14} />
            {signedPct(t.metrics.yoyGrowthPct)} YoY
          </span>
        </div>
      </div>
    </Link>
  )
}
