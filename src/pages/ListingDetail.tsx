import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ConfidentialSection } from '../components/ConfidentialSection'
import { Icon } from '../components/Icon'
import { NdaGate } from '../components/NdaGate'
import { StatTile } from '../components/StatTile'
import { ValuationRange } from '../components/ValuationRange'
import { CATEGORY_STYLE } from '../data/categories'
import { getListing } from '../data/listings'
import { money, plural, sdeOf, signedPct } from '../lib/format'
import { load, save } from '../lib/storage'
import NotFound from './NotFound'

export default function ListingDetail() {
  const { id } = useParams()
  const listing = getListing(id)
  const [unlocked, setUnlocked] = useState<boolean>(() => load(`nda.${id}`, false))

  useEffect(() => {
    setUnlocked(load(`nda.${id}`, false))
  }, [id])

  if (!listing) return <NotFound />

  const t = listing.teaser
  const m = t.metrics
  const style = CATEGORY_STYLE[t.category]
  const unlock = () => {
    save(`nda.${listing.id}`, true)
    setUnlocked(true)
  }

  return (
    <div className="container section">
      <Link to="/buy" className="muted small" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
        <Icon name="arrow-left" size={14} /> All listings
      </Link>

      <div className="detail-head" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="chip-row">
            <span className="chip" style={{ background: style.bg, color: style.fg }}>
              <Icon name={style.icon} size={12} /> {t.category}
            </span>
            <span className="chip">{t.industry}</span>
            <span className="chip">{t.platform}</span>
            {!unlocked && (
              <span className="chip chip-gold">
                <Icon name="lock" size={12} /> Anonymous teaser
              </span>
            )}
          </div>
          <h1>{t.tagline}</h1>
          <div className="meta-row">
            <span>
              <Icon name="pin" size={13} /> <strong>{t.location.city}, {t.location.state}</strong>
            </span>
            <span>
              In business <strong>{plural(t.yearsInBusiness, 'year')}</strong>
            </span>
            <span>
              Reason for sale: <strong>{t.reasonForSale}</strong>
            </span>
          </div>
          <div style={{ marginTop: 18 }}>
            <h4>What pushes this value up or down</h4>
            <ul style={{ marginTop: 6 }}>
              {t.valueDrivers.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card">
          <ValuationRange
            low={t.valuation.low}
            high={t.valuation.high}
            confidence={t.valuation.confidence}
            note={t.valuation.confidenceNote}
          />
        </div>
      </div>

      <div className="section-title">
        <h2>Teaser metrics</h2>
        <span className="muted small">Ranges and ratios only. Exact P&amp;L after NDA.</span>
      </div>
      <div className="metric-grid">
        <StatTile className="metric-tile" value={money(m.revenueTTM)} label="Revenue, trailing 12 months" />
        <StatTile className="metric-tile" value={`${m.grossMarginPct}% / ${m.sdeMarginPct}%`} label="Margin profile: gross / owner earnings (SDE)">
          <div className="muted small" style={{ marginTop: 6 }}>
            ≈ {money(sdeOf(listing))} owner earnings
          </div>
        </StatTile>
        <StatTile className="metric-tile" value={signedPct(m.yoyGrowthPct)} label="Year-over-year growth">
          <span className={`trend trend-${t.growthTrend} small`} style={{ marginTop: 6 }}>
            <Icon name={`trend-${t.growthTrend}`} size={14} /> {t.growthTrend === 'up' ? 'Growing' : t.growthTrend === 'flat' ? 'Flat' : 'Declining'}
          </span>
        </StatTile>
        <StatTile className="metric-tile" value={`${m.hoursPerWeek} hrs`} label="Hours per week to run" />
        <StatTile className="metric-tile" value={plural(t.yearsInBusiness, 'year')} label="Time in business" />
        <StatTile className="metric-tile" value={`${t.location.city}, ${t.location.state}`} label="Location" />
        <div className="tile metric-tile" style={{ gridColumn: 'span 2' }}>
          <div className="stat-label" style={{ marginTop: 0 }}>
            Revenue streams and products
          </div>
          <div className="streams">
            {m.revenueStreams.map((s) => (
              <div key={s.name} className="stream-row">
                <div className="lbl">
                  <span>{s.name}</span>
                  <span className="num">{s.sharePct}%</span>
                </div>
                <div className="bar">
                  <span style={{ width: `${s.sharePct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-title">
        <h2>{unlocked ? 'Confidential details' : 'Confidential details'}</h2>
      </div>
      {unlocked ? <ConfidentialSection c={listing.confidential} /> : <NdaGate onUnlock={unlock} />}
    </div>
  )
}
