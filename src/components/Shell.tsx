import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function Shell({ landing = false }: { landing?: boolean }) {
  return (
    <div className="app">
      {!landing && <Header />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
