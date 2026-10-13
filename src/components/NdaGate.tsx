import { useState } from 'react'
import { Icon } from './Icon'

export function NdaGate({ onUnlock }: { onUnlock: () => void }) {
  const [agreed, setAgreed] = useState(false)
  return (
    <div className="card nda-panel">
      <div className="chip-row" style={{ marginBottom: 8 }}>
        <span className="chip chip-dark">
          <Icon name="lock" size={12} /> NDA required
        </span>
      </div>
      <h3>Interested? Sign the NDA to see the business name and full memorandum.</h3>
      <p className="muted" style={{ marginTop: 8 }}>
        By signing you agree to use the confidential information memorandum, financials, and customer details only
        to evaluate this purchase, not to share them, and not to contact the business, its staff, or its customers
        without the seller's consent. Listings stay anonymous until a buyer is qualified.
      </p>
      <label>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <span>I agree to the Conquire NDA and will keep this information confidential.</span>
      </label>
      <button className="btn btn-primary" disabled={!agreed} onClick={onUnlock}>
        <Icon name="unlock" size={16} /> Unlock confidential details
      </button>
    </div>
  )
}
