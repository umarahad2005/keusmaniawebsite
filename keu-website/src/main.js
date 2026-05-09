/* =========================================================
   Karwan-e-Usmania — Main entry
   Boots every module after DOM is ready.
   ========================================================= */

import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'

import { initScene }      from './js/scene.js'
import { initAnimations } from './js/animations.js'
import { initNav }        from './js/nav.js'
import { initCounter }    from './js/counter.js'
import { initPackages }   from './js/packages.js'
import { initGallery }    from './js/gallery.js'
import { initWhatsApp }   from './js/whatsapp.js'
import { initContact }    from './js/contact.js'
import { injectShared }   from './js/shared.js'

const boot = async () => {
  // Inject shared markup (nav + footer + WhatsApp float) into every page
  await injectShared()

  // Page-specific & cross-page modules
  initNav()
  initWhatsApp()
  initScene()        // safe — bails if no #hero-canvas on the page
  initAnimations()   // safe — bails if no relevant elements
  initCounter()
  initPackages()
  initGallery()
  initContact()

  // Mark body as hydrated so CSS can fade content in if desired
  document.body.dataset.ready = 'true'
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
