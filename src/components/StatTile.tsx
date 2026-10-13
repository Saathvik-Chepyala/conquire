import type { ReactNode } from 'react'

export function StatTile({
  value,
  label,
  dark = false,
  large = false,
  className = '',
  children,
}: {
  value: ReactNode
  label: ReactNode
  dark?: boolean
  large?: boolean
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={`tile ${dark ? 'tile-dark' : ''} ${className}`}>
      <div className={`stat-value num ${large ? 'stat-value-lg' : ''}`}>{value}</div>
      <div className="stat-label">{label}</div>
      {children}
    </div>
  )
}
