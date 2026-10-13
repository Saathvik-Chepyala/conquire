import type { SellerForm, StreamInput } from '../../lib/sellerForm'
import { Field } from '../Field'
import { Icon } from '../Icon'

const CONNECTORS = ['QuickBooks', 'Stripe', 'Shopify']

export function StepFinancials({ form, update }: { form: SellerForm; update: (p: Partial<SellerForm>) => void }) {
  const setStream = (i: number, patch: Partial<StreamInput>) =>
    update({ streams: form.streams.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) })
  const addStream = () => update({ streams: [...form.streams, { name: '', sharePct: '' }] })
  const removeStream = (i: number) => update({ streams: form.streams.filter((_, idx) => idx !== i) })
  const toggleConnector = (c: string) =>
    update({ connected: form.connected.includes(c) ? form.connected.filter((x) => x !== c) : [...form.connected, c] })
  const shareTotal = form.streams.reduce((a, s) => a + (parseFloat(s.sharePct) || 0), 0)

  return (
    <>
      <h2>Financials</h2>
      <p className="muted">
        Connect a platform so every number in your memo links to a verified source. In this prototype the
        buttons only mark the source as connected.
      </p>
      <div className="connect-row">
        {CONNECTORS.map((c) => (
          <button
            key={c}
            type="button"
            className={`btn btn-sm ${form.connected.includes(c) ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => toggleConnector(c)}
          >
            {form.connected.includes(c) && <Icon name="check" size={14} />}
            {form.connected.includes(c) ? `${c} connected` : `Connect ${c}`}
          </button>
        ))}
        <button type="button" className="btn btn-sm btn-ghost" disabled>
          Upload P&amp;L (coming soon)
        </button>
      </div>
      <div className="field-row">
        <Field id="revenueTTM" label="Revenue, trailing 12 months ($)">
          <input id="revenueTTM" inputMode="numeric" placeholder="71400" value={form.revenueTTM} onChange={(e) => update({ revenueTTM: e.target.value })} />
        </Field>
        <Field id="netProfit" label="Net profit, trailing 12 months ($)" hint="Before your own salary. Add-backs come in step 4.">
          <input id="netProfit" inputMode="numeric" placeholder="18000" value={form.netProfit} onChange={(e) => update({ netProfit: e.target.value })} />
        </Field>
      </div>
      <div className="field-row">
        <Field id="grossMarginPct" label="Gross margin (%)">
          <input id="grossMarginPct" inputMode="numeric" placeholder="62" value={form.grossMarginPct} onChange={(e) => update({ grossMarginPct: e.target.value })} />
        </Field>
        <Field id="yoyGrowthPct" label="Year-over-year revenue growth (%)" hint="Negative numbers are fine.">
          <input id="yoyGrowthPct" inputMode="numeric" placeholder="18" value={form.yoyGrowthPct} onChange={(e) => update({ yoyGrowthPct: e.target.value })} />
        </Field>
      </div>
      <div className="field" style={{ marginBottom: 6 }}>
        <label>Revenue streams or products</label>
        <span className="hint">Name and share of revenue. Shares should add up to 100 (currently {shareTotal}).</span>
      </div>
      <div className="repeater">
        {form.streams.map((s, i) => (
          <div key={i} className="repeater-row">
            <input placeholder="Online store" value={s.name} onChange={(e) => setStream(i, { name: e.target.value })} aria-label={`Stream ${i + 1} name`} />
            <input placeholder="% share" inputMode="numeric" value={s.sharePct} onChange={(e) => setStream(i, { sharePct: e.target.value })} aria-label={`Stream ${i + 1} share`} />
            <button type="button" className="icon-btn" onClick={() => removeStream(i)} aria-label="Remove stream" disabled={form.streams.length <= 1}>
              ×
            </button>
          </div>
        ))}
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={addStream}>
            + Add stream
          </button>
        </div>
      </div>
    </>
  )
}
