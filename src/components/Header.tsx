import { NavLink } from 'react-router-dom'
import { Logo } from './Logo'

const cls = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')

export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Logo />
        <nav className="nav" aria-label="Primary">
          <NavLink to="/buy" className={cls}>
            Browse
          </NavLink>
          <NavLink to="/sell" className={cls}>
            Sell a business
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
