/* =========================================================
   Karwan-e-Usmania — Packages page
   Renders all packages from packages.json and wires the
   category filter chips. The home page uses shared.js'
   packageCardHTML directly for its preview.
   ========================================================= */

import { PACKAGES, packageCardHTML } from './shared.js'

export function initPackages() {
  // Only run on the packages page (the home page uses #packages-preview).
  const isPackagesPage = !!document.getElementById('package-filters')
  const grid = document.getElementById('packages-grid')
  if (!grid) return

  // Render full list on packages page
  if (isPackagesPage) {
    grid.innerHTML = PACKAGES.map(packageCardHTML).join('')
    rewriteWhatsAppLinksWithin(grid)
  }

  // Filter chips
  const filterBar = document.getElementById('package-filters')
  if (!filterBar) return

  filterBar.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-filter]')
    if (!chip) return

    filterBar.querySelectorAll('[data-filter]').forEach(c => c.removeAttribute('data-active'))
    chip.setAttribute('data-active', 'true')

    const f = chip.dataset.filter
    grid.querySelectorAll('.package-card').forEach(card => {
      const matches = (f === 'all') || card.dataset.category === f
      card.style.display = matches ? '' : 'none'
    })
  })

  // Open via hash (e.g. /packages.html#vip-umrah)
  if (location.hash) {
    const target = document.querySelector(location.hash)
    if (target) target.scrollIntoView({ block: 'center' })
  }
}

// Re-rewrite WA links for any newly-rendered package CTAs.
// (shared.js does an initial pass on injectShared, but cards rendered after that need the same treatment.)
function rewriteWhatsAppLinksWithin(scope) {
  // Trigger shared.js's global rewrite by dispatching nothing — just call the same logic
  // Cheap re-implementation here to avoid a circular import for the small benefit:
  import('./shared.js').then(({ SITE, PACKAGES: ALL }) => {
    const number = SITE.company.whatsapp
    scope.querySelectorAll('[data-wa-package]').forEach(el => {
      const key = el.getAttribute('data-wa-package')
      const pkg = ALL.find(p => p.id === key)
      const msg = encodeURIComponent(pkg?.waMessage || 'Assalamu Alaikum! I would like to enquire about your packages.')
      el.setAttribute('href', `https://wa.me/${number}?text=${msg}`)
      if (el.tagName === 'A') el.setAttribute('target', '_blank')
      el.setAttribute('rel', 'noopener')
    })
  })
}
