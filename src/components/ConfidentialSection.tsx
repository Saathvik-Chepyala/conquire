import type { Confidential } from '../data/types'
import { money } from '../lib/format'
import { Icon } from './Icon'
import { MemoView } from './MemoView'

export function ConfidentialSection({ c }: { c: Confidential }) {
  const totalExpenses = c.expenses.reduce((a, e) => a + e.amount, 0)
  return (
    <div className="confidential">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="chip-row" style={{ marginBottom: 8 }}>
          <span className="chip chip-gold">
            <Icon name="unlock" size={12} /> NDA signed
          </span>
        </div>
        <span className="eyebrow">Business name</span>
        <h2 style={{ marginTop: 4 }}>{c.businessName}</h2>
        {c.url && (
          <div className="muted" style={{ marginTop: 4 }}>
            {c.url}
          </div>
        )}
      </div>

      <MemoView memo={c.memo} />

      <div className="section-title">
        <h2>More specifics</h2>
      </div>
      <div className="grid-2">
        <div className="card">
          <h4>Customer profiles</h4>
          <ul style={{ marginTop: 8 }}>
            {c.customerProfiles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h4>Ownership</h4>
          <p style={{ marginTop: 8 }}>{c.ownership}</p>
        </div>
        <div className="card">
          <h4>Revenues</h4>
          <table className="table" style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>Year</th>
                <th className="num">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {c.revenues.map((r) => (
                <tr key={r.year}>
                  <td>{r.year}</td>
                  <td className="num">{money(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h4>Expenses (trailing 12 months)</h4>
          <table className="table" style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>Category</th>
                <th className="num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {c.expenses.map((e) => (
                <tr key={e.category}>
                  <td>{e.category}</td>
                  <td className="num">{money(e.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td className="num">{money(totalExpenses)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="hw-tw">
          <div>
            <h4 style={{ color: 'var(--red)' }}>Headwinds</h4>
            <ul style={{ marginTop: 8 }}>
              {c.headwinds.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--green)' }}>Tailwinds</h4>
            <ul style={{ marginTop: 8 }}>
              {c.tailwinds.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="section-title">
        <h2>Next steps for serious buyers</h2>
      </div>
      <div className="next-steps">
        {[
          { icon: 'folder' as const, title: 'Data room', body: 'Contracts, tax returns, and platform exports.' },
          { icon: 'phone' as const, title: 'Call with the seller', body: 'Book a 30-minute intro after verification.' },
          { icon: 'file' as const, title: 'LOI template', body: 'Start a letter of intent from a vetted template.' },
        ].map((s) => (
          <div key={s.title} className="card card-pad-sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name={s.icon} size={18} />
              <h4>{s.title}</h4>
            </div>
            <p className="muted small" style={{ margin: '8px 0 12px' }}>
              {s.body}
            </p>
            <button className="btn btn-ghost btn-sm" disabled>
              Coming soon
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
