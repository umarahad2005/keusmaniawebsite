/* SiteProvider — fetches dynamic content from /api/content on boot,
   merges it with the bundled defaults from src/data.js. Components use
   useSite() to read SITE and PACKAGES (always defined; falls back to
   defaults if the API is unreachable). */

import { createContext, useContext, useEffect, useState } from 'react'
import { SITE as DEFAULT_SITE, PACKAGES as DEFAULT_PACKAGES } from '../data.js'
import { api } from './api.js'

const Ctx = createContext({
  site: DEFAULT_SITE,
  packages: DEFAULT_PACKAGES,
  loaded: false,
  reload: async () => {},
})

export function useSite() { return useContext(Ctx) }

export function SiteProvider({ children }) {
  const [site,     setSite]     = useState(DEFAULT_SITE)
  const [packages, setPackages] = useState(DEFAULT_PACKAGES)
  const [loaded,   setLoaded]   = useState(false)

  const reload = async () => {
    try {
      const content = await api.get('/api/content')
      // Each top-level key in `site` can be overridden by a row in Content collection.
      // Special-case "packages" (a separate top-level field) and "site" (the rest).
      const siteOverride = content.site || {}
      setSite({ ...DEFAULT_SITE, ...siteOverride })
      setPackages(Array.isArray(content.packages) ? content.packages : DEFAULT_PACKAGES)
    } catch {
      // API not reachable — keep bundled defaults silently. The site renders fine
      // without the dev API server (see scripts/dev-api.js).
    } finally {
      setLoaded(true)
    }
  }

  useEffect(() => { reload() }, [])

  return (
    <Ctx.Provider value={{ site, packages, loaded, reload }}>
      {children}
    </Ctx.Provider>
  )
}
