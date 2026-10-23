/* Site navigation (DESIGN-LANGUAGE §3.6, §4 Nav).

   States
     film     Home at the top, 768 px and up: transparent over the hero film,
              reversed mark, on-dark text (the hero's nav band gives it ≥ .72 scrim).
     paper    after 80 px of scroll and on every inner page: paper at .96 with a
              gold hairline edge, full-colour mark, green text. Shrinks 80 → 64 px.
     solid    Home under 768 px: a solid green-950 bar above the poster plate.
   It never hides, so WhatsApp stays one tap away. */
import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Icon } from '../icons.jsx'
import { useWaLink } from '../lib/whatsapp.js'
import { useDisplayLocation, useMenu } from './chrome/ChromeContext.jsx'
import BrandMark from './brand/BrandMark.jsx'
import Wordmark from './brand/Wordmark.jsx'
import MobileMenu from './MobileMenu.jsx'
import SoundToggle from './chrome/SoundToggle.jsx'

export const NAV_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/packages', label: 'Packages' },
  { to: '/about',    label: 'About' },
  { to: '/gallery',  label: 'Gallery' },
  { to: '/updates',  label: 'Updates' },
  { to: '/contact',  label: 'Contact' },
]

function useScrolled(threshold = 80) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

function useIsPhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setPhone(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return phone
}

export default function Nav() {
  const display = useDisplayLocation()
  const scrolled = useScrolled()
  const phone = useIsPhone()
  const { menuOpen, setMenuOpen } = useMenu()
  const wa = useWaLink()
  const menuButton = useRef(null)

  const onHome = display?.pathname === '/'
  const state = onHome && phone ? 'solid' : onHome && !scrolled ? 'film' : 'paper'
  const onDark = state === 'film' || state === 'solid'

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className={`site-nav site-nav--${state}${scrolled ? ' site-nav--compact' : ''}`} aria-label="Primary">
        <div className="site-nav__inner">
          <Link to="/" className="site-nav__brand" aria-label="Karwan e Usmania International, home">
            {/* .nav__logo-img is the preloader's FLIP target (Phase 3). */}
            <BrandMark variant={onDark ? 'reversed' : 'color'} size={phone ? 32 : 40} className="nav__logo-img" />
            <Wordmark variant="line" className="site-nav__wordmark" />
          </Link>

          <ul className="site-nav__links" role="list">
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'} className="site-nav__link">{l.label}</NavLink>
              </li>
            ))}
          </ul>

          <div className="site-nav__actions">
            <SoundToggle />
            <a className="k-btn k-btn--wa k-btn--sm site-nav__book" href={wa('general')} target="_blank" rel="noopener" aria-label="Book on WhatsApp">
              <Icon name="whatsapp" className="k-ico" />
              <span className="site-nav__book-label">
                <span lang="ur" dir="rtl" className="ar-face"><bdi>بک کریں</bdi></span>
                <span aria-hidden="true"> · </span>Book
              </span>
            </a>
            <button
              ref={menuButton}
              className="site-nav__menu"
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>
            </button>
          </div>
        </div>
      </nav>
      <MobileMenu returnFocusTo={menuButton} />
    </>
  )
}
