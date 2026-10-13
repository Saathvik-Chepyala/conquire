import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { Icon } from '../components/Icon'
import { StatTile } from '../components/StatTile'

export default function Landing() {
  return (
    <section className="landing-hero container">
      <Logo size="lg" />
      <h1>Selling a very small business shouldn't need a broker.</h1>
      <p className="lede">
        Conquire gives owners of businesses valued under $100K an AI-drafted valuation and memorandum, and gives
        first-time buyers anonymous, source-linked listings they can trust.
      </p>

      <div className="role-cards">
        <Link to="/buy" className="card role-card">
          <div className="role-card-icon">
            <Icon name="users" size={22} />
          </div>
          <h2>I'm buying</h2>
          <p className="muted">
            Browse anonymous teasers, filter by industry, price, and cash flow, then sign an NDA to see the full
            memorandum.
          </p>
          <div className="cta">Browse businesses →</div>
        </Link>
        <Link to="/sell" className="card role-card">
          <div className="role-card-icon gold">
            <Icon name="briefcase" size={22} />
          </div>
          <h2>I'm selling</h2>
          <p className="muted">
            Answer a guided form, get a valuation range, and let Conquire draft the memorandum buyers expect.
          </p>
          <div className="cta">List my business →</div>
        </Link>
      </div>

      <div className="landing-stats grid-3">
        <StatTile value="35%" label="of owners had no idea what their business was worth (BizBuySell, Q2 2026)" />
        <StatTile value="$10–25K" label="typical broker minimum fee, a huge cut of a very small sale" />
        <StatTile value="90% vs 29%" label="of buyers expect seller financing, but only 29% of owners plan to offer it" />
      </div>
    </section>
  )
}
