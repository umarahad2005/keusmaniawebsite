import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSite } from '../lib/SiteContext.jsx'
import { gsap, Flip } from '../lib/motion.js'
import { motionEnv } from '../lib/motionEnv.js'
import PackageCard from './PackageCard.jsx'

/* Filter chips appear only for categories that actually have packages.
   The karwan offers Umrah only for now (owner, 2026-10-10), so there is no
   Hajj chip; a Hajj package added in the admin later would bring its chip back. */
const FILTERS = [
  { id: 'all',           label: 'All' },
  { id: 'umrah',         label: 'Umrah' },
  { id: 'ramadan_umrah', label: 'Ramadan' },
  { id: 'family',        label: 'Family' },
  { id: 'hajj',          label: 'Hajj' },
]

/**
 * `featured` picks the packages flagged in the admin, falling back to the first
 * `limit` packages when nothing is flagged — so the home page always shows cards
 * even after every package has been renamed or replaced. `ids` still works for
 * pinning an explicit set.
 */
export default function PackagesGrid({ showFilters = true, ids = null, featured = false, limit = null, sticky = false }) {
  const [filter, setFilter] = useState('all')
  const { packages } = useSite()
  const grid = useRef(null)
  const flipState = useRef(null)

  // Chips: the cards reorder with Flip over 600 ms. Focus stays on the chip.
  const choose = (id) => {
    if (id === filter) return
    if (grid.current && !motionEnv().reduce) {
      flipState.current = Flip.getState(grid.current.querySelectorAll('.package-card'))
    }
    setFilter(id)
  }
  useLayoutEffect(() => {
    const state = flipState.current
    if (!state) return
    flipState.current = null
    Flip.from(state, {
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      // Cards that were hidden by the previous filter fade in; removed ones are
      // already gone from the DOM (React unmounts them).
      onEnter: els => gsap.fromTo(els, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out' }),
    })
  }, [filter])

  const chips = useMemo(() => {
    const present = new Set(packages.map(p => p.category))
    return FILTERS.filter(f => f.id === 'all' || present.has(f.id))
  }, [packages])

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
      {showFilters && chips.length > 2 && (
        <div className={`filter-chips${sticky ? ' filter-chips--sticky' : ''}`} role="group" aria-label="Filter packages">
          {chips.map(f => (
            <button
              key={f.id}
              type="button"
              className="filter-chip"
              aria-pressed={filter === f.id}
              onClick={() => choose(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">{list.length} {list.length === 1 ? 'package' : 'packages'}</p>

      <div ref={grid} className={`packages-grid packages-grid--n${Math.min(list.length, 3)}`}>
        {list.map(p => <PackageCard key={p.id} pkg={p} />)}
      </div>

      {list.length === 0 && (
        <p className="packages-grid__empty">No packages in this category yet. Message us on WhatsApp and we will tell you what is available.</p>
      )}
    </>
  )
}
