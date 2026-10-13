/* SiteProvider — fetches dynamic content from /api/content on boot,
   merges it with the bundled defaults from src/data.js. Components use
   useSite() to read SITE and PACKAGES (always defined; falls back to
   defaults if the API is unreachable).

   Public pages read the CDN-cacheable /api/content (up to about a minute old).
   Anything under /admin reads a fresh copy (api.getFresh, ?t= cache-buster):
   on boot, on entering /admin from a public page, and on every reload() — which
   only the admin editors call, after a save.

   `error` is true when the latest read failed and the page is running on the
   bundled defaults, so a page can avoid a 404 for content it cannot see. The
   context value is memoised: route changes re-render the provider (useLocation)
   but must not re-render every useSite() consumer. */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE as DEFAULT_SITE, PACKAGES as DEFAULT_PACKAGES } from '../data.js'
import { api } from './api.js'

const Ctx = createContext({
  site: DEFAULT_SITE,
  packages: DEFAULT_PACKAGES,
  loaded: false,
  error: false,
  reload: async () => {},
})

export function useSite() { return useContext(Ctx) }

export function SiteProvider({ children }) {
  const [site,     setSite]     = useState(DEFAULT_SITE)
  const [packages, setPackages] = useState(DEFAULT_PACKAGES)
  const [loaded,   setLoaded]   = useState(false)
  const [error,    setError]    = useState(false)

  const inAdmin = useLocation().pathname.startsWith('/admin')

  // Only the newest request may apply, so a slow cached read can't land on top of a fresh one.
  const seq = useRef(0)
  const load = useCallback(async (fresh) => {
    const mine = ++seq.current
    try {
      const content = fresh ? await api.getFresh('/api/content') : await api.get('/api/content')
      if (mine !== seq.current) return
      // Each top-level key in `site` can be overridden by a row in Content collection.
      // Special-case "packages" (a separate top-level field) and "site" (the rest).
      const siteOverride = content.site || {}
      setSite({ ...DEFAULT_SITE, ...siteOverride })
      setPackages(Array.isArray(content.packages) ? content.packages : DEFAULT_PACKAGES)
      setError(false)
    } catch {
      // API not reachable — keep bundled defaults silently. The site renders fine
      // without the dev API server (see scripts/dev-api.js).
      if (mine === seq.current) setError(true)
    } finally {
      setLoaded(true)
    }
  }, [])

  const reload = useCallback(() => load(true), [load])

  /* Boot: cacheable on public pages, fresh on /admin. Re-read fresh when the
     visitor moves from a public page into /admin, so the editors start from the
     database, not the CDN copy. Leaving /admin keeps what is already loaded. */
  const booted = useRef(false)
  useEffect(() => {
    if (!booted.current) { booted.current = true; load(inAdmin); return }
    if (inAdmin) load(true)
  }, [inAdmin, load])

  /* Tell motion code that the page height may have changed (more or fewer
     packages, FAQs, testimonials), so ScrollTrigger positions are refreshed and
     the reveal registry re-arms. Fired after React has painted the new content. */
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const id = requestAnimationFrame(() => window.dispatchEvent(new CustomEvent('keu:content')))
    return () => cancelAnimationFrame(id)
  }, [site, packages])

  const value = useMemo(() => ({ site, packages, loaded, error, reload }), [site, packages, loaded, error, reload])

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  )
}
