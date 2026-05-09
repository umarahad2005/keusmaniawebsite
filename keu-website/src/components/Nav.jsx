import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Icon } from '../icons.jsx'
import { useWaLink } from '../lib/whatsapp.js'

const LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/packages', label: 'Packages' },
  { to: '/about',    label: 'About' },
  { to: '/gallery',  label: 'Gallery' },
  { to: '/contact',  label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const wa = useWaLink()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open)
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const navClass = `nav ${scrolled ? 'nav--solid' : 'nav--transparent'}`

  return (
    <>
      <nav className={navClass} aria-label="Primary">
        <Link to="/" className="nav__logo">
          <img className="nav__logo-img" src="/logo.png" alt="Karwan-e-Usmania" width="48" height="48" />
          <span className="nav__logo-text">Karwan-e-Usmania</span>
        </Link>

        <ul className="nav__menu" role="list">
          {LINKS.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => 'nav__link' + (isActive ? ' is-active' : '')}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="cluster">
          <a className="btn btn--whatsapp btn--sm nav__cta" href={wa('general')} target="_blank" rel="noopener">
            <Icon name="whatsapp" style={{ width: 16, height: 16 }} />
            <span>WhatsApp بک کریں</span>
          </a>
          <button
            className="nav__burger"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="nav-drawer"
            onClick={() => setOpen(true)}
          >
            <span className="nav__burger-icon" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div
        className="nav-drawer-overlay"
        data-open={open ? 'true' : 'false'}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside className="nav-drawer" id="nav-drawer" data-open={open ? 'true' : 'false'} aria-hidden={!open}>
        <button className="nav-drawer__close" type="button" aria-label="Close menu" onClick={() => setOpen(false)}>×</button>
        {LINKS.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} className="nav-drawer__link" onClick={() => setOpen(false)}>
            {l.label}
          </NavLink>
        ))}
        <a className="btn btn--whatsapp btn--lg btn--full mt-4" href={wa('general')} target="_blank" rel="noopener" onClick={() => setOpen(false)}>
          Chat on WhatsApp
        </a>
      </aside>
    </>
  )
}
