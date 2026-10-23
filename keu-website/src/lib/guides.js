/* The Umrah guides (copy in src/data.js GUIDES) without the weight.

   The copy would add about 20 KB to the bundle every page loads, so only the
   build-time pre-render (and the dev server) read it from data.js:
   import.meta.env.SSR and DEV are both false in the production browser build,
   so the bundler drops GUIDES from it. In the browser:
     - a pre-rendered /guides or /guides/<slug> page carries the list in
       window.__KEU_GUIDES__ (scripts/prerender.mjs writes it on those pages only);
     - arriving from another page, the list is fetched once from
       /guides-data.json, which the pre-render writes next to the pages. */
import { useEffect, useState } from 'react'
import { GUIDES } from '../data.js'

const BUNDLED = import.meta.env.SSR || import.meta.env.DEV ? GUIDES : null
let cache = BUNDLED || (typeof window !== 'undefined' && window.__KEU_GUIDES__) || null
let pending = null

export function loadGuides() {
  if (cache) return Promise.resolve(cache)
  pending ||= fetch('/guides-data.json')
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then(list => (cache = Array.isArray(list) ? list : []))
    .catch(err => { pending = null; throw err })
  return pending
}

/** { guides, error }: guides is null while the list is loading. */
export function useGuides() {
  const [guides, setGuides] = useState(cache)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (guides) return
    let live = true
    loadGuides().then(g => { if (live) setGuides(g) }, () => { if (live) setError(true) })
    return () => { live = false }
  }, [guides])
  return { guides, error }
}
