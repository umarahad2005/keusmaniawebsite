/* =========================================================
   Karwan-e-Usmania — Shared markup + data renderer
   Loads site.json + packages.json once, injects nav/footer,
   then renders content sections (services, why, stats,
   testimonials, about, contact, gallery, footer-contact).
   ========================================================= */

import navHTML    from '../components/nav.html?raw'
import footerHTML from '../components/footer.html?raw'
import { ICONS, icon } from './icons.js'

// ---------- Public — populated by loadData() at boot ----------
export let SITE     = {}
export let PACKAGES = []

let dataReady = null

/** Fetch site.json + packages.json from /public/data/ at runtime so
 *  edits to those files reflect immediately on reload — no rebuild. */
async function loadData() {
  if (dataReady) return dataReady
  dataReady = (async () => {
    const cacheBust = `?v=${Date.now()}`
    const [site, pkg] = await Promise.all([
      fetch(`/data/site.json${cacheBust}`).then(r => {
        if (!r.ok) throw new Error(`site.json ${r.status}`)
        return r.json()
      }),
      fetch(`/data/packages.json${cacheBust}`).then(r => {
        if (!r.ok) throw new Error(`packages.json ${r.status}`)
        return r.json()
      }),
    ])
    SITE = site
    PACKAGES = pkg.packages || []
  })()
  return dataReady
}

export async function injectShared() {
  await loadData()
  injectNav()
  injectFooter()
  injectWhatsAppFloat()
  highlightActiveNav()
  renderHome()
  renderAbout()
  renderContact()
  renderGallery()
  rewriteWhatsAppLinks()
  setFooterYear()
  setFooterContact()
  setFooterSocials()
}

export { loadData }

// ---------- Mount points ----------
function mount(id, html) {
  const el = document.getElementById(id)
  if (el) el.innerHTML = html
}

function injectNav()    { mount('nav-mount', navHTML) }
function injectFooter() { mount('footer-mount', footerHTML) }

function injectWhatsAppFloat() {
  mount('whatsapp-float-mount', `
    <a class="fab-whatsapp" href="#" data-wa-package="general" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
      <span>Book Now</span>
    </a>
  `)
}

// ---------- Active nav highlighting ----------
function highlightActiveNav() {
  const path = location.pathname.split('/').pop().replace('.html', '') || 'index'
  const map  = { index: 'home', '': 'home' }
  const key  = map[path] || path
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.dataset.nav === key) a.setAttribute('aria-current', 'page')
  })
}

// ---------- Home page renderers ----------
function renderHome() {
  const servicesEl = document.getElementById('services-strip')
  if (servicesEl) {
    servicesEl.innerHTML = SITE.services.map(s => `
      <div class="service-card">
        <div class="service-card__icon" aria-hidden="true">${icon(s.icon)}</div>
        <div class="service-card__label">${s.label}</div>
        <div class="service-card__sublabel">${s.sublabel}</div>
      </div>
    `).join('')
  }

  const whyEl = document.getElementById('why-grid')
  if (whyEl) {
    whyEl.innerHTML = SITE.whyChooseUs.map(w => whyCardHTML(w)).join('')
  }

  const statsEl = document.getElementById('stats-grid')
  if (statsEl) {
    statsEl.innerHTML = SITE.stats.map(s => `
      <div class="stat-card">
        <div class="stat-card__icon" aria-hidden="true">${icon(s.icon)}</div>
        <span class="stat-card__value" data-count="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</span>
        <span class="stat-card__label">${s.label}</span>
      </div>
    `).join('')
  }

  const testEl = document.getElementById('testimonials-grid')
  if (testEl) {
    testEl.innerHTML = SITE.testimonials.map(t => `
      <article class="testimonial-card">
        <span class="testimonial-card__quote-mark" aria-hidden="true">"</span>
        <div class="testimonial-card__stars" aria-label="${t.rating} star rating">${'★'.repeat(t.rating)}</div>
        <p class="testimonial-card__quote">${t.quote}</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar avatar-initials">${t.initials}</div>
          <div>
            <div class="testimonial-card__name">${t.name}</div>
            <div class="testimonial-card__location">${t.location} · ${t.trip}</div>
          </div>
        </div>
      </article>
    `).join('')
  }

  // Home page packages preview (3 popular ones)
  const pkgPreview = document.querySelector('#packages-preview #packages-grid')
  if (pkgPreview) {
    const top3 = PACKAGES.filter(p => ['premium-umrah','vip-umrah','ramadan-umrah'].includes(p.id))
    pkgPreview.innerHTML = top3.map(packageCardHTML).join('')
  }
}

function whyCardHTML(w) {
  return `
    <article class="card why-card">
      <div class="why-card__icon" aria-hidden="true">${icon(w.icon)}</div>
      <h3 class="why-card__title">${w.title}</h3>
      <p class="muted">${w.body}</p>
    </article>
  `
}

// ---------- About page renderers ----------
function renderAbout() {
  const story = document.getElementById('about-story')
  if (story) {
    story.innerHTML = SITE.about.story.map(p => `<p class="lead mt-4">${p}</p>`).join('')
  }
  const why = document.getElementById('about-why-grid')
  if (why) {
    why.innerHTML = SITE.whyChooseUs.map(whyCardHTML).join('')
  }
  const certs = document.getElementById('about-certs')
  if (certs) {
    certs.innerHTML = SITE.about.certifications.map(c => `
      <li class="card text-center">
        <div class="cert-card__icon" aria-hidden="true">${icon('certificate')}</div>
        <p class="mt-4">${c}</p>
      </li>
    `).join('')
  }
  const team = document.getElementById('about-team')
  if (team && SITE.team) {
    team.innerHTML = SITE.team.map(m => `
      <article class="team-card">
        <div class="team-card__photo">
          <img src="${m.photo}" alt="${m.name}" loading="lazy" decoding="async">
        </div>
        <div class="team-card__name">${m.name}</div>
        <div class="team-card__role">${m.role}</div>
      </article>
    `).join('')
  }
}

// ---------- Contact page renderers ----------
function renderContact() {
  const info = document.getElementById('contact-info')
  if (info) {
    const c = SITE.company
    info.innerHTML = `
      <div class="card contact-card">
        <div class="contact-card__icon">${icon('pin')}</div>
        <div>
          <h3 class="contact-card__title">Visit Our Office</h3>
          <p class="muted">${c.address.street}<br>${c.address.city}, ${c.address.country} ${c.address.postalCode}</p>
        </div>
      </div>
      <div class="card contact-card">
        <div class="contact-card__icon">${icon('whatsapp')}</div>
        <div>
          <h3 class="contact-card__title">WhatsApp</h3>
          <p class="muted"><a href="#" data-wa-package="general">+${c.whatsapp.slice(0,2)} ${c.whatsapp.slice(2,5)} ${c.whatsapp.slice(5)}</a> — fastest response</p>
        </div>
      </div>
      <div class="card contact-card">
        <div class="contact-card__icon">${icon('phone')}</div>
        <div>
          <h3 class="contact-card__title">Phone</h3>
          <p class="muted"><a href="tel:${c.phone.replace(/[^+\d]/g,'')}">${c.phone}</a></p>
        </div>
      </div>
      <div class="card contact-card">
        <div class="contact-card__icon">${icon('mail')}</div>
        <div>
          <h3 class="contact-card__title">Email</h3>
          <p class="muted"><a href="mailto:${c.email}">${c.email}</a></p>
        </div>
      </div>
      <div class="card contact-card">
        <div class="contact-card__icon">${icon('clock')}</div>
        <div>
          <h3 class="contact-card__title">Office Hours</h3>
          <ul class="muted" style="list-style:none;padding:0;margin:0">
            ${c.hours.map(h => `<li><strong>${h.days}:</strong> ${h.time}</li>`).join('')}
          </ul>
        </div>
      </div>
    `
  }
  const map = document.getElementById('contact-map')
  if (map) {
    map.innerHTML = `<iframe
      src="https://www.openstreetmap.org/export/embed.html?bbox=74.34%2C31.50%2C74.36%2C31.52&amp;layer=mapnik&amp;marker=31.51%2C74.35"
      style="width:100%;height:100%;border:0"
      loading="lazy"
      title="Karwan-e-Usmania Lahore office location"
      referrerpolicy="no-referrer-when-downgrade"></iframe>`
  }
}

// ---------- Gallery page renderer ----------
function renderGallery() {
  const grid = document.getElementById('gallery-grid')
  if (!grid) return
  grid.innerHTML = SITE.gallery.map(img => {
    const cls = img.size === 'tall' ? 'gallery-item gallery-item--tall'
              : img.size === 'wide' ? 'gallery-item gallery-item--wide'
              : 'gallery-item'
    return `
      <figure class="${cls}" data-lightbox="true">
        <img src="${img.src}" alt="${img.alt}" loading="lazy" decoding="async">
        <figcaption class="gallery-item__caption">${img.alt}</figcaption>
      </figure>
    `
  }).join('')
}

// ---------- WhatsApp link rewriter (data-wa-package attribute) ----------
function rewriteWhatsAppLinks() {
  const number = SITE.company.whatsapp
  const messages = {
    general: 'Assalamu Alaikum! I would like to enquire about your Hajj/Umrah packages.',
  }
  PACKAGES.forEach(p => { messages[p.id]   = p.waMessage })
  PACKAGES.forEach(p => { messages[p.tier] = p.waMessage })
  messages.economy = PACKAGES.find(p => p.tier === 'economy')?.waMessage || messages.general
  messages.premium = PACKAGES.find(p => p.id === 'premium-umrah')?.waMessage || messages.general
  messages.vip     = PACKAGES.find(p => p.tier === 'vip')?.waMessage || messages.general
  messages.ramadan = PACKAGES.find(p => p.id === 'ramadan-umrah')?.waMessage || messages.general
  messages.hajj    = PACKAGES.find(p => p.id === 'hajj-2025')?.waMessage || messages.general
  messages.family  = PACKAGES.find(p => p.id === 'family-umrah')?.waMessage || messages.general

  document.querySelectorAll('[data-wa-package]').forEach(el => {
    const key = el.getAttribute('data-wa-package')
    const msg = encodeURIComponent(messages[key] || messages.general)
    el.setAttribute('href', `https://wa.me/${number}?text=${msg}`)
    if (el.tagName === 'A') el.setAttribute('target', '_blank')
    el.setAttribute('rel', 'noopener')
  })
}

// ---------- Footer helpers ----------
function setFooterYear() {
  const el = document.getElementById('footer-year')
  if (el) el.textContent = new Date().getFullYear()
}

function setFooterContact() {
  const list = document.getElementById('footer-contact-list')
  if (!list) return
  const c = SITE.company
  list.innerHTML = `
    <li class="footer__contact-line">${icon('pin')}<span>${c.address.city}, ${c.address.country}</span></li>
    <li class="footer__contact-line">${icon('phone')}<a href="tel:${c.phone.replace(/[^+\d]/g,'')}">${c.phone}</a></li>
    <li class="footer__contact-line">${icon('whatsapp')}<a href="#" data-wa-package="general">WhatsApp</a></li>
    <li class="footer__contact-line">${icon('mail')}<a href="mailto:${c.email}">${c.email}</a></li>
  `
}

function setFooterSocials() {
  const wrap = document.querySelector('.footer__socials')
  if (!wrap) return
  wrap.innerHTML = SITE.company.socials.map(s => `
    <a class="footer__social" href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}">${icon(s.icon)}</a>
  `).join('')
}

// ---------- Reusable package-card HTML builder ----------
export function packageCardHTML(p) {
  const badge = p.badge ? `<span class="badge badge--gold package-card__badge">${p.badge}</span>` : ''
  const inclusions = p.inclusions.map(i => `<li class="package-card__inclusion">${i}</li>`).join('')
  return `
    <article class="package-card" id="${p.id}" data-category="${p.category}" data-tier="${p.tier}">
      ${badge}
      <h3 class="package-card__title">${p.name}</h3>
      <p class="package-card__subtitle">${p.subtitle}</p>
      <div class="package-card__price">
        <span class="package-card__price-amount">${p.priceLabel}</span>
        ${p.price ? `<span class="package-card__price-currency">/ person</span>` : ''}
      </div>
      <p class="package-card__nights">${p.summary}</p>
      <div class="package-card__divider"></div>
      <ul class="package-card__inclusions">${inclusions}</ul>
      <a class="btn btn--primary btn--full package-card__cta" href="#" data-wa-package="${p.id}">
        Book on WhatsApp
      </a>
    </article>
  `
}
