/* Launch measurement (DESIGN-LANGUAGE Phase 7, step 5).

   - Vercel Speed Insights (real-visitor Core Web Vitals) and Web Analytics.
   - A custom event when the hero is revealed, carrying its time in ms, for the
     field gate "p75 keu:hero-revealed ≤ 3.0 s".
   - A "WhatsApp click" event for every wa.me link, with the page and the
     section it was clicked in, so the owner can see which buttons bring
     bookings.

   Opt-in: the Vercel scripts load only when the build sets
   VITE_ANALYTICS=vercel, i.e. after Web Analytics and Speed Insights are
   switched on in the Vercel project (until then /_vercel/insights/script.js
   does not exist and requesting it is a console error). Any other host is
   unaffected. Nothing personal is sent: no message text, no phone numbers. */
import { inject, track as vaTrack } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'

const MODE = import.meta.env.VITE_ANALYTICS
let enabled = false

function onVercel() {
  return MODE === 'vercel'
}

export function track(name, props) {
  if (!enabled) return
  try { vaTrack(name, props) } catch { /* never break the page for analytics */ }
}

/** Where on the page a click happened: the nearest section id or landmark. */
function placeOf(el) {
  if (el.closest('.site-nav')) return 'nav'
  if (el.closest('.mobile-menu, #mobile-menu')) return 'menu'
  if (el.closest('.wa-fab')) return 'fab'
  if (el.closest('.thumb-bar')) return 'thumb-bar'
  if (el.closest('#site-footer')) return 'footer'
  if (el.closest('.dcard')) return 'team-card'
  const sec = el.closest('section[id], header[id], [data-page-header]')
  return sec?.id || (sec?.hasAttribute('data-page-header') ? 'page-header' : 'page')
}

let started = false
export function initAnalytics() {
  if (started || typeof window === 'undefined') return
  started = true
  enabled = onVercel()
  if (enabled) {
    inject({ mode: import.meta.env.PROD ? 'production' : 'development' })
    injectSpeedInsights()
  }

  // Every WhatsApp link, wherever it is: one delegated listener.
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="https://wa.me/"]')
    if (!a) return
    track('WhatsApp click', { place: placeOf(a), page: location.pathname })
  }, { capture: true })

  // Hero revealed (marked by the Preloader or VideoHero): report its time once.
  const report = () => {
    const m = performance.getEntriesByName('keu:hero-revealed')[0]
    if (m) track('Hero revealed', { ms: Math.round(m.startTime), bucket: m.startTime <= 3000 ? '≤3s' : '>3s' })
  }
  window.addEventListener('keu:hero-revealed', report, { once: true })
}

/** Mark the hero as revealed (idempotent) and tell initAnalytics. */
export function markHeroRevealed() {
  try {
    if (performance.getEntriesByName('keu:hero-revealed').length) return
    performance.mark('keu:hero-revealed')
    window.dispatchEvent(new CustomEvent('keu:hero-revealed'))
  } catch { /* old browsers */ }
}
