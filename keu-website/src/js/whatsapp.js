/* =========================================================
   Karwan-e-Usmania — WhatsApp UX layer
   Pre-filled messages and href rewriting are handled by
   shared.js (one source of truth: src/data/packages.json).
   This module owns FAB visibility and a one-time greeting.
   ========================================================= */

const GREETING_DELAY = 6000  // ms before greeting bubble appears
const GREETING_KEY   = 'keu_wa_greeted'

export function initWhatsApp() {
  const fab = document.querySelector('.fab-whatsapp')
  if (!fab) return

  // Hide on contact page — primary CTA is the form's "Send via WhatsApp"
  if (location.pathname.endsWith('/contact.html')) {
    fab.style.display = 'none'
    return
  }

  // One-time greeting bubble (per browser / session)
  if (sessionStorage.getItem(GREETING_KEY)) return

  setTimeout(() => {
    if (sessionStorage.getItem(GREETING_KEY)) return
    sessionStorage.setItem(GREETING_KEY, '1')

    const bubble = document.createElement('div')
    bubble.setAttribute('role', 'status')
    bubble.style.cssText = `
      position: fixed;
      bottom: calc(var(--space-6) + 64px);
      right: var(--space-6);
      z-index: var(--z-sticky);
      max-width: 260px;
      padding: var(--space-3) var(--space-4);
      background: var(--color-white);
      color: var(--color-navy-dark);
      font-size: var(--text-sm);
      line-height: 1.4;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      transform: translateY(8px);
      opacity: 0;
      transition: transform .35s var(--ease-out), opacity .35s var(--ease-out);
      cursor: pointer;
    `
    bubble.innerHTML = `
      <strong style="display:block;color:var(--color-green)">Assalamu Alaikum 👋</strong>
      Tap here to chat with us on WhatsApp — most queries answered within an hour.
    `
    bubble.addEventListener('click', () => fab.click())
    document.body.appendChild(bubble)

    requestAnimationFrame(() => {
      bubble.style.transform = 'translateY(0)'
      bubble.style.opacity   = '1'
    })

    setTimeout(() => {
      bubble.style.opacity = '0'
      bubble.style.transform = 'translateY(8px)'
      setTimeout(() => bubble.remove(), 400)
    }, 8000)
  }, GREETING_DELAY)
}
