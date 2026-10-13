export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number
  pageCount: number
  onChange: (page: number) => void
}) {
  if (pageCount <= 1) return null
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)
  return (
    <nav className="pagination" aria-label="Pagination">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        ‹ Prev
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)} aria-current={p === page ? 'page' : undefined}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label="Next page">
        Next ›
      </button>
    </nav>
  )
}
