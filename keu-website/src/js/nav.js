/* =========================================================
   Karwan-e-Usmania — Nav drawer behaviour
   The transparent → solid scroll behaviour lives in animations.js.
   ========================================================= */

export function initNav() {
  const burger  = document.querySelector('.nav__burger')
  const drawer  = document.getElementById('nav-drawer')
  const overlay = document.querySelector('.nav-drawer-overlay')
  const close   = document.querySelector('.nav-drawer__close')
  if (!burger || !drawer || !overlay) return

  const open = () => {
    drawer.dataset.open  = 'true'
    overlay.dataset.open = 'true'
    burger.setAttribute('aria-expanded', 'true')
    drawer.setAttribute('aria-hidden', 'false')
    document.body.classList.add('no-scroll')
  }
  const shut = () => {
    drawer.dataset.open  = 'false'
    overlay.dataset.open = 'false'
    burger.setAttribute('aria-expanded', 'false')
    drawer.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('no-scroll')
  }

  burger.addEventListener('click', open)
  close?.addEventListener('click', shut)
  overlay.addEventListener('click', shut)

  // Close drawer when a link is clicked
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', shut))

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.dataset.open === 'true') shut()
  })
}
