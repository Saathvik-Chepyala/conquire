import type { Confidence } from '../data/types'
import { moneyShort } from '../lib/format'

interface Props {
  low: number
  high: number
  confidence: Confidence
  note: string
  marker?: number
  markerLabel?: string
  title?: string
}

/** The deck's "range, not a single number" visual (slide 6). */
export function ValuationRange({ low, high, confidence, note, marker, markerLabel, title = 'Estimated value' }: Props) {
  const min = low * 0.7
  const max = high * 1.3
  const span = Math.max(1, max - min)
  const left = ((low - min) / span) * 100
  const width = ((high - low) / span) * 100
  const m = marker ?? (low + high) / 2
  const markerLeft = Math.min(100, Math.max(0, ((m - min) / span) * 100))
  return (
    <div>
      <div className="muted small">{title} · estimate, not an appraisal</div>
      <div className="stat-value stat-value-lg num" style={{ marginTop: 6 }}>
        {moneyShort(low)} – {moneyShort(high)}
      </div>
      <div className="range-wrap">
        <div className="range-track">
          <div className="range-fill" style={{ left: `${left}%`, width: `${width}%` }} />
          <div className="range-marker" style={{ left: `${markerLeft}%` }} title={markerLabel} />
        </div>
        <div className="range-labels num">
          <span>Low {moneyShort(low)}</span>
          {markerLabel && <span className="gold">{markerLabel}</span>}
          <span>High {moneyShort(high)}</span>
        </div>
      </div>
      <div className="conf-badge">Confidence: {confidence}</div>
      <div className="muted small">{note}</div>
    </div>
  )
}
