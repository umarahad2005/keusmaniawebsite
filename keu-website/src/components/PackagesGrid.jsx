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

export default function PackagesGrid({ showFilters = true, ids = null }) {
  const [filter, setFilter] = useState('all')
  const { packages } = useSite()

  const list = ids
    ? packages.filter(p => ids.includes(p.id))
    : (filter === 'all' ? packages : packages.filter(p => p.category === filter))

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
