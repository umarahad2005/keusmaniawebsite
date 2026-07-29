import { useMemo } from 'react'
import { useSite } from './SiteContext.jsx'
import { SITE as DEFAULT_SITE, PACKAGES as DEFAULT_PACKAGES } from '../data.js'

const GENERAL = 'Assalamu Alaikum! I would like to enquire about your Hajj/Umrah packages.'

/* Keys are derived from whatever packages actually exist — id, tier and category.
   Previously the tier/category aliases were pinned to literal ids ('premium-umrah',
   'hajj-2025', …), so renaming or replacing a package in the admin silently dropped
   its message back to the generic one. First package of a tier/category wins. */
function buildMessages(packages) {
  const m = { general: GENERAL }
  packages.forEach(p => {
    if (!p.waMessage) return
    m[p.id] = p.waMessage
    if (p.tier     && !(p.tier     in m)) m[p.tier]     = p.waMessage
    if (p.category && !(p.category in m)) m[p.category] = p.waMessage
  })
  return m
}

/** React hook — returns a `(key, customText) → url` builder bound to the current SiteContext. */
export function useWaLink() {
  const { site, packages } = useSite()
  return useMemo(() => {
    const messages = buildMessages(packages)
    return (key = 'general', customText) => {
      const text = customText ?? messages[key] ?? messages.general
      return `https://wa.me/${site.company.whatsapp}?text=${encodeURIComponent(text)}`
    }
  }, [site, packages])
}

/** Static fallback — uses bundled defaults from data.js. Use only outside the React tree. */
export function waLink(key = 'general', customText) {
  const messages = buildMessages(DEFAULT_PACKAGES)
  const text = customText ?? messages[key] ?? messages.general
  return `https://wa.me/${DEFAULT_SITE.company.whatsapp}?text=${encodeURIComponent(text)}`
}
