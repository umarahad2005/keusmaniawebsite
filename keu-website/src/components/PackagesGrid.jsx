import { useState } from 'react'
import { useSite } from '../lib/SiteContext.jsx'
import PackageCard from './PackageCard.jsx'

const FILTERS = [
  { id: 'all',           label: 'All' },
  { id: 'umrah',         label: 'Umrah' },
  { id: 'hajj',          label: 'Hajj' },
  { id: 'ramadan_umrah', label: 'Ramadan' },
  { id: 'family',        label: 'Family' },
]

/**
 * `featured` picks the packages flagged in the admin, falling back to the first
 * `limit` packages when nothing is flagged — so the home page always shows cards
 * even after every package has been renamed or replaced. `ids` still works for
 * pinning an explicit set.
 */
export default function PackagesGrid({ showFilters = true, ids = null, featured = false, limit = null }) {
  const [filter, setFilter] = useState('all')
  const { packages } = useSite()

  let list = packages
  if (ids) {
    list = packages.filter(p => ids.includes(p.id))
  } else if (featured) {
    const flagged = packages.filter(p => p.featured)
    list = flagged.length ? flagged : packages
  } else if (filter !== 'all') {
    list = packages.filter(p => p.category === filter)
  }
  if (limit) list = list.slice(0, limit)

  return (
    <>
      {showFilters && (
        <div className="chip-group" role="tablist" aria-label="Filter packages">
          {FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              className="chip"
              data-active={filter === f.id ? 'true' : 'false'}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className={`packages-grid ${showFilters ? 'mt-12' : ''}`}>
        {list.map(p => <PackageCard key={p.id} pkg={p} />)}
      </div>

      {list.length === 0 && (
        <p className="muted text-center mt-12">No packages in this category yet.</p>
      )}
    </>
  )
}
