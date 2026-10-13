import { buildMemo, completeness, estimateValuation, type SellerForm } from '../../lib/sellerForm'
import { money } from '../../lib/format'
import { MemoView } from '../MemoView'
import { ValuationRange } from '../ValuationRange'

export function StepReview({ form, update }: { form: SellerForm; update: (p: Partial<SellerForm>) => void }) {
  const est = estimateValuation(form)
  const memo = buildMemo(form, est)
  const { ratio } = completeness(form)
  return (
    <>
      <h2>Review and memo preview</h2>
      <p className="muted">
        This is what buyers will see after the NDA. Your profile is {Math.round(ratio * 100)}% complete. Nothing
        goes live until you confirm.
      </p>
      <div className="tile" style={{ margin: '16px 0 20px' }}>
        <ValuationRange
          low={est.low}
          high={est.high}
          confidence={est.confidence}
          note={est.note}
          marker={memo.askingPrice}
          markerLabel={`Draft asking ${money(memo.askingPrice)}`}
        />
        <div className="muted small" style={{ marginTop: 10 }}>
          Owner earnings (SDE) {money(est.sde)} × {est.multipleLow.toFixed(2)}–{est.multipleHigh.toFixed(2)} multiple.
          Narrower with verified financials and more comparable sales; wider with self-reported numbers.
        </div>
      </div>
      <MemoView memo={memo} draft />
      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 20, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={form.confirmed}
          onChange={(e) => update({ confirmed: e.target.checked })}
          style={{ width: 18, height: 18, marginTop: 2, accentColor: 'var(--teal)' }}
        />
        <span>
          I confirm these financials and add-backs are accurate, and I have reviewed every flagged gap. I understand
          the valuation is an estimate, not an appraisal.
        </span>
      </label>
    </>
  )
}
