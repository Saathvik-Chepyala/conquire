import { useEffect, useMemo, useState } from 'react'
import { BuyBoxModal } from '../components/BuyBoxModal'
import { FilterBar } from '../components/FilterBar'
import { ListingCard } from '../components/ListingCard'
import { Pagination } from '../components/Pagination'
import { useBuyBox } from '../context/BuyBoxContext'
import { allIndustries, allStates, listings } from '../data/listings'
import { matchScore, type BuyBox } from '../lib/buyBox'
import { DEFAULT_FILTERS, PAGE_SIZE, applyFilters, filtersFromBuyBox, type Filters } from '../lib/filters'

export default function BuyHome() {
  const { buyBox, setBuyBox, surveyOpen, surveyDismissed, openSurvey, closeSurvey, dismissSurvey } = useBuyBox()
  const [filters, setFilters] = useState<Filters>(() => (buyBox ? filtersFromBuyBox(buyBox) : DEFAULT_FILTERS))
  const [page, setPage] = useState(1)

  // First visit: open the survey once.
  useEffect(() => {
    if (!buyBox && !surveyDismissed) openSurvey()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const results = useMemo(() => applyFilters(listings, filters, buyBox), [filters, buyBox])
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageItems = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const updateFilters = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }))
    setPage(1)
  }
  const clearFilters = () => {
    setFilters((f) => ({ ...DEFAULT_FILTERS, sort: f.sort }))
    setPage(1)
  }
  const saveBuyBox = (box: BuyBox) => {
    setBuyBox(box)
    setFilters(filtersFromBuyBox(box))
    setPage(1)
    closeSurvey()
  }
  const goToPage = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container section">
      <div className="page-head">
        <div>
          <span className="eyebrow">Buyer marketplace</span>
          <h1 style={{ fontSize: 32, marginTop: 4 }}>Recommended businesses</h1>
        </div>
        <div className="muted small">
          {results.length} of {listings.length} anonymous listings · names revealed after NDA
        </div>
      </div>

      <FilterBar
        filters={filters}
        industries={allIndustries}
        states={allStates}
        hasBuyBox={buyBox !== null}
        onChange={updateFilters}
        onClear={clearFilters}
        onEditBuyBox={openSurvey}
      />

      {pageItems.length === 0 ? (
        <div className="card empty">
          <h3>No businesses match these filters</h3>
          <p className="muted">Try widening the price band or clearing a filter.</p>
          <button className="btn btn-primary" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="listing-grid">
          {pageItems.map((l) => (
            <ListingCard key={l.id} listing={l} score={buyBox ? matchScore(l, buyBox) : null} />
          ))}
        </div>
      )}

      <Pagination page={safePage} pageCount={pageCount} onChange={goToPage} />
      {results.length > 0 && (
        <div className="muted small" style={{ textAlign: 'center' }}>
          Page {safePage} of {pageCount}
        </div>
      )}

      <BuyBoxModal
        open={surveyOpen}
        initial={buyBox}
        industries={allIndustries}
        onSave={saveBuyBox}
        onDismiss={dismissSurvey}
      />
    </div>
  )
}
