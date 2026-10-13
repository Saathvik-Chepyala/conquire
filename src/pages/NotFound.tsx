import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container section">
      <div className="card empty">
        <h2>That page doesn't exist</h2>
        <p className="muted">The listing may have been removed from the sample data.</p>
        <Link to="/buy" className="btn btn-primary">
          Back to listings
        </Link>
      </div>
    </div>
  )
}
