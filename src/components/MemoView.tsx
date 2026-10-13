import { formatDate, money } from '../lib/format'
import { Icon } from './Icon'

export interface MemoLike {
  executiveSummary: string
  businessOverview: string
  industryAndMarket: string
  growthOpportunities: string[]
  transitionPlan: string
  askingPrice: number
  keyFigures: { label: string; value: string; source: string }[]
  flaggedGaps: string[]
  sources?: string[]
  confirmedOn?: string
}

export function MemoView({ memo, draft = false }: { memo: MemoLike; draft?: boolean }) {
  return (
    <div className="card">
      <div className="chip-row" style={{ marginBottom: 10 }}>
        <span className="chip chip-teal">
          <Icon name="sparkle" size={12} /> Drafted by Conquire AI
        </span>
        {memo.confirmedOn ? (
          <span className="chip chip-gold">
            <Icon name="check" size={12} /> Confirmed by seller {formatDate(memo.confirmedOn)}
          </span>
        ) : (
          <span className="chip">{draft ? 'Draft · awaiting seller sign-off' : 'Unconfirmed'}</span>
        )}
      </div>
      <h2>Confidential Information Memorandum</h2>

      <div className="memo-section">
        <h4>Executive summary</h4>
        <p>{memo.executiveSummary}</p>
      </div>
      <div className="memo-section">
        <h4>Business overview</h4>
        <p>{memo.businessOverview}</p>
      </div>
      <div className="memo-section">
        <h4>Industry and market</h4>
        <p>{memo.industryAndMarket}</p>
      </div>
      <div className="memo-section">
        <h4>Growth opportunities</h4>
        <ul>
          {memo.growthOpportunities.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
      <div className="memo-section">
        <h4>Transition plan</h4>
        <p>{memo.transitionPlan}</p>
      </div>
      <div className="memo-section">
        <h4>Draft asking price</h4>
        <div className="stat-value num">{money(memo.askingPrice)}</div>
        <div className="muted small">Set from the valuation range. The seller can adjust before going live.</div>
      </div>

      <div className="memo-section">
        <h4>Key figures and their sources</h4>
        <p className="muted small">Every number links to a document. Gaps are flagged, not guessed.</p>
        <table className="table">
          <thead>
            <tr>
              <th>Figure</th>
              <th className="num">Value</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {memo.keyFigures.map((k) => (
              <tr key={k.label}>
                <td>{k.label}</td>
                <td className="num">
                  <strong>{k.value}</strong>
                </td>
                <td>
                  <span className="source-tag">{k.source}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {memo.flaggedGaps.length > 0 && (
        <div className="memo-section">
          <h4>Flagged, not guessed</h4>
          <ul className="flag-list">
            {memo.flaggedGaps.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      {memo.sources && memo.sources.length > 0 && (
        <div className="memo-section">
          <h4>Documents reviewed</h4>
          <div className="chip-row">
            {memo.sources.map((s) => (
              <span key={s} className="chip">
                <Icon name="file" size={12} /> {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
