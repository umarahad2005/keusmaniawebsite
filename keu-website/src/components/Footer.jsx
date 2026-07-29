import { Link } from 'react-router-dom'
import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'
import { useWaLink } from '../lib/whatsapp.js'

export default function Footer() {
  const { site, packages } = useSite()
  const c = site.company
  const wa = useWaLink()
  const year = new Date().getFullYear()
  const telHref = `tel:${c.phone.replace(/[^+\d]/g,'')}`

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <div className="footer__brand-logo">
              <img src="/logo.png" alt="Karwan-e-Usmania" width="56" height="56" />
              <span>Karwan-e-Usmania</span>
            </div>
            <p className="footer__bismillah" lang="ar">اللّٰهُمَّ اجْعَلْ هَذَا الْبَيْتَ حَجًّا مَبْرُوراً</p>
            <p>Your trusted partner for Hajj &amp; Umrah from Lahore, Pakistan since 2005. Mehmaan-e-Khuda is our trust.</p>
            <div className="footer__socials" role="list" aria-label="Social media">
              {c.socials.map(s => (
                <a key={s.name} className="footer__social" href={s.url} target="_blank" rel="noopener" aria-label={s.name}>
                  <Icon name={s.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__title">Explore</h4>
            <ul className="footer__list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/packages">Packages</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__title">Packages</h4>
            {/* Derived from live package data — hardcoded ids here went stale
                the moment a package was renamed or removed in the admin. */}
            <ul className="footer__list">
              {packages.slice(0, 5).map(p => (
                <li key={p.id}><Link to={`/packages#${p.id}`}>{p.name}</Link></li>
              ))}
              {packages.length > 5 && (
                <li><Link to="/packages">See all packages</Link></li>
              )}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__title">Get in Touch</h4>
            <ul className="footer__list">
              <li className="footer__contact-line"><Icon name="pin" /><span>{c.address.city}, {c.address.country}</span></li>
              <li className="footer__contact-line"><Icon name="phone" /><a href={telHref}>{c.phone}</a></li>
              <li className="footer__contact-line"><Icon name="whatsapp" /><a href={wa('general')} target="_blank" rel="noopener">WhatsApp</a></li>
              <li className="footer__contact-line"><Icon name="mail" /><a href={`mailto:${c.email}`}>{c.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {year} Karwan-e-Usmania. All rights reserved.</p>
          <p>Mehmaan-e-Khuda · Lahore, Pakistan</p>
        </div>
      </div>
    </footer>
  )
}
