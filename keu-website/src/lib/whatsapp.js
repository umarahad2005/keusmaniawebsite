import { useMemo } from 'react'
import { useSite } from './SiteContext.jsx'
import { SITE as DEFAULT_SITE, PACKAGES as DEFAULT_PACKAGES } from '../data.js'

/* Umrah only for now (owner, 2026-10-10): no Hajj wording in any message. */
const GENERAL = 'Assalamu Alaikum! I would like to enquire about your Umrah packages.'
const UMRAH   = 'Assalamu Alaikum! I would like details about your Umrah packages, dates and hotels.'
const QAFILA  = 'Assalamu Alaikum! I would like to apply for the Qafila e Shoq spiritual journey.'

/* wa.me wants digits only: '+92-333-4883578' or '+923334883578' becomes '923334883578'.
   With a '+' wa.me answers with a redirect, which some in-app browsers drop. */
export function waNumber(raw) {
  return String(raw || '').replace(/\D/g, '')
}

/* Keys are derived from whatever packages actually exist — id, tier and category.
   Previously the tier/category aliases were pinned to literal ids ('premium-umrah',
   'hajj-2025', …), so renaming or replacing a package in the admin silently dropped
   its message back to the generic one. First package of a tier/category wins. */
function buildMessages(packages, site) {
  const m = { general: GENERAL, umrah: UMRAH, qafila: site?.qafila?.waMessage || QAFILA }
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
    const messages = buildMessages(packages, site)
    return (key = 'general', customText) => {
      const text = customText ?? messages[key] ?? messages.general
      return `https://wa.me/${waNumber(site.company.whatsapp)}?text=${encodeURIComponent(text)}`
    }
  }, [site, packages])
}

/** Static fallback — uses bundled defaults from data.js. Use only outside the React tree. */
export function waLink(key = 'general', customText) {
  const messages = buildMessages(DEFAULT_PACKAGES, DEFAULT_SITE)
  const text = customText ?? messages[key] ?? messages.general
  return `https://wa.me/${waNumber(DEFAULT_SITE.company.whatsapp)}?text=${encodeURIComponent(text)}`
}
