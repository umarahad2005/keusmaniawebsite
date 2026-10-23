/* Full-screen mobile menu (DESIGN-LANGUAGE §4 MobileMenu).
   Green-950 panel, Cormorant links with gold running numbers, WhatsApp and Call
   at the foot with the office hours. Opens with a 900 ms polygon wipe, then the
   links rise. The page behind is inert, focus is trapped, Esc closes and focus
   returns to the menu button. */
import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { gsap, EASE, STAGGER } from '../lib/motion.js'
import { motionEnv } from '../lib/motionEnv.js'
import { useWaLink, waNumber } from '../lib/whatsapp.js'
import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'
import { useMenu } from './chrome/ChromeContext.jsx'
import { hoursRows } from '../lib/hours.js'
import BrandMark from './brand/BrandMark.jsx'

const LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/packages', label: 'Packages' },
  { to: '/about',    label: 'About' },
  { to: '/gallery',  label: 'Gallery' },
  { to: '/updates',  label: 'Updates' },
  { to: '/contact',  label: 'Contact' },
]

const CLOSED = 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)'
const OPEN = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

export default function MobileMenu({ returnFocusTo }) {
  const { menuOpen, setMenuOpen } = useMenu()
  const { site } = useSite()
  const wa = useWaLink()
  const panel = useRef(null)
  const firstOpen = useRef(true)
  const c = site.company

  // Open / close animation.
  useEffect(() => {
    const el = panel.current
    if (!el) return
    if (firstOpen.current) { firstOpen.current = false; if (!menuOpen) return }
    const env = motionEnv()
    const links = el.querySelectorAll('[data-menu-item]')
    gsap.killTweensOf([el, links])
    if (menuOpen) {
      el.hidden = false
      if (env.reduce) {
        gsap.fromTo(el, { autoAlpha: 0, clipPath: OPEN }, { autoAlpha: 1, duration: 0.2 })
      } else if (env.lowEnd) {
        gsap.fromTo(el, { autoAlpha: 0, clipPath: OPEN }, { autoAlpha: 1, duration: 0.35 })
      } else {
        gsap.set(el, { autoAlpha: 1 })
        gsap.fromTo(el, { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.9, ease: 'power4.inOut' })
        gsap.from(links, { autoAlpha: 0, y: 12, duration: 0.5, ease: EASE.quiet, stagger: STAGGER.normal, delay: 0.45 })
      }
      el.querySelector('[data-menu-close]')?.focus()
    } else {
      const done = () => { el.hidden = true; returnFocusTo?.current?.focus() }
      if (env.reduce || env.lowEnd) gsap.to(el, { autoAlpha: 0, duration: 0.2, onComplete: done })
      else gsap.to(el, { clipPath: CLOSED, duration: 0.6, ease: 'power3.inOut', onComplete: done })
    }
  }, [menuOpen, returnFocusTo])

  // Page behind is inert; Lenis paused; Esc closes; focus stays inside.
  useEffect(() => {
    if (!menuOpen) return
    const others = ['main-content', 'site-footer'].map(id => document.getElementById(id)).filter(Boolean)
    others.forEach(el => { el.inert = true })
    window.__lenis?.stop()
    document.body.classList.add('no-scroll')

    const onKey = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); return }
      if (e.key !== 'Tab') return
      const items = panel.current.querySelectorAll('a[href], button:not([disabled])')
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      others.forEach(el => { el.inert = false })
      window.__lenis?.start()
      document.body.classList.remove('no-scroll')
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, setMenuOpen])

  const close = () => setMenuOpen(false)

  return (
    <div
      id="mobile-menu"
      className="mobile-menu"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      hidden
    >
      <div className="mobile-menu__head">
        <BrandMark variant="reversed" size={36} />
        <button className="mobile-menu__close" type="button" onClick={close} aria-label="Close menu" data-menu-close>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <nav className="mobile-menu__nav" aria-label="Menu">
        <ol role="list">
          {LINKS.map((l, i) => (
            <li key={l.to} data-menu-item>
              <NavLink to={l.to} end={l.to === '/'} className="mobile-menu__link" onClick={close}>
                <span className="mobile-menu__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span>{l.label}</span>
              </NavLink>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mobile-menu__foot" data-menu-item>
        <div className="mobile-menu__actions">
          <a className="k-btn k-btn--wa k-btn--lg" href={wa('general')} target="_blank" rel="noopener" onClick={close}>
            <Icon name="whatsapp" className="k-ico" /> WhatsApp
          </a>
          <a className="k-btn k-btn--ghost-dark k-btn--lg" href={`tel:+${waNumber(c.phone)}`} onClick={close}>
            <Icon name="phone" className="k-ico" /> Call
          </a>
        </div>
        <dl className="mobile-menu__hours">
          {hoursRows(c.hours).map(h => (
            <div key={h.days}><dt>{h.days}</dt><dd>{h.time}</dd></div>
          ))}
        </dl>
        <p className="mobile-menu__note">Pakistan time</p>
      </div>
    </div>
  )
}
