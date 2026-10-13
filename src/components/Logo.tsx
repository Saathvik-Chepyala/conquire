import { useId } from 'react'
import { Link } from 'react-router-dom'

/** The mark: two overlapping circles from the deck's title slide.
 *  Gold = seller, teal = buyer, the deep-teal lens = the deal. */
export function LogoMark({ size = 34 }: { size?: number }) {
  const clip = `clip-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <svg width={size} height={(size * 40) / 48} viewBox="0 0 48 40" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <circle cx="18" cy="20" r="16" />
        </clipPath>
      </defs>
      <circle cx="18" cy="20" r="16" fill="#B5924C" />
      <circle cx="32" cy="22" r="12" fill="#1B4D4C" />
      <circle cx="32" cy="22" r="12" fill="#0F2F2E" clipPath={`url(#${clip})`} />
    </svg>
  )
}

export function Logo({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <Link to="/" className={`logo logo-${size}`} aria-label="Conquire home">
      <LogoMark size={size === 'sm' ? 34 : 64} />
      <span className="logo-word">Conquire</span>
    </Link>
  )
}
