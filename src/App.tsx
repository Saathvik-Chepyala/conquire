import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Shell } from './components/Shell'
import { BuyBoxProvider } from './context/BuyBoxContext'
import BuyHome from './pages/BuyHome'
import Landing from './pages/Landing'
import ListingDetail from './pages/ListingDetail'
import NotFound from './pages/NotFound'
import SellLogin from './pages/SellLogin'
import SellNew from './pages/SellNew'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <BuyBoxProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Shell landing />}>
            <Route path="/" element={<Landing />} />
          </Route>
          <Route element={<Shell />}>
            <Route path="/buy" element={<BuyHome />} />
            <Route path="/buy/:id" element={<ListingDetail />} />
            <Route path="/sell" element={<SellLogin />} />
            <Route path="/sell/new" element={<SellNew />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BuyBoxProvider>
    </BrowserRouter>
  )
}
