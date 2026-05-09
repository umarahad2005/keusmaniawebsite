import { useMemo } from 'react'
import { useSite } from './SiteContext.jsx'
import { SITE as DEFAULT_SITE, PACKAGES as DEFAULT_PACKAGES } from '../data.js'

const GENERAL = 'Assalamu Alaikum! I would like to enquire about your Hajj/Umrah packages.'

function buildMessages(packages) {
  const m = { general: GENERAL }
  packages.forEach(p => { m[p.id] = p.waMessage; m[p.tier] = p.waMessage })
  m.economy = packages.find(p => p.tier === 'economy')?.waMessage || GENERAL
  m.premium = packages.find(p => p.id === 'premium-umrah')?.waMessage || GENERAL
  m.vip     = packages.find(p => p.tier === 'vip')?.waMessage || GENERAL
  m.ramadan = packages.find(p => p.id === 'ramadan-umrah')?.waMessage || GENERAL
  m.hajj    = packages.find(p => p.id === 'hajj-2025')?.waMessage || GENERAL
  m.family  = packages.find(p => p.id === 'family-umrah')?.waMessage || GENERAL
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
