/* =========================================================
   Karwan-e-Usmania — Contact form
   Validates required fields then opens WhatsApp with the
   user's message pre-filled. No backend needed — WhatsApp
   is the booking channel for this brand.
   ========================================================= */

import { SITE } from './shared.js'

export function initContact() {
  const form = document.getElementById('contact-form')
  if (!form) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // Clear previous errors
    form.querySelectorAll('.field--error').forEach(f => f.classList.remove('field--error'))

    const name    = form.querySelector('#c-name').value.trim()
    const phone   = form.querySelector('#c-phone').value.trim()
    const email   = form.querySelector('#c-email').value.trim()
    const pkg     = form.querySelector('#c-package').value
    const prefer  = form.querySelector('#c-prefer').value
    const message = form.querySelector('#c-message').value.trim()

    let ok = true
    if (!name)    { markError('#c-name'); ok = false }
    if (!phone)   { markError('#c-phone'); ok = false }
    if (!message) { markError('#c-message'); ok = false }
    if (!ok) return

    const text = [
      `Assalamu Alaikum,`,
      ``,
      `My name is ${name}.`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      pkg ? `Interested in: ${pkg}` : null,
      `Preferred contact: ${prefer}`,
      ``,
      message,
    ].filter(Boolean).join('\n')

    const url = `https://wa.me/${SITE.company.whatsapp}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener')
    form.reset()
  })

  function markError(selector) {
    const input = form.querySelector(selector)
    if (input) input.parentElement.classList.add('field--error')
  }
}
