/* Site footer, laid out like the letterhead (DESIGN-LANGUAGE §4 Footer).

   1. Contact row on paper, with green dividers, as at the foot of the letterhead:
      address · phones · email and website · hours.
   2. The letterhead sweep and champagne ribbon into the green band.
   3. On the band: the lockup with a solid gold wordmark, links, live packages,
      socials and the credit line. No motto here (it appears once, in the Home seam). */
import { Link } from 'react-router-dom'
import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'
import { useWaLink, waNumber } from '../lib/whatsapp.js'
import { hoursRows } from '../lib/hours.js'
import Lockup from './brand/Lockup.jsx'
import { formatPk, DEFAULT_LANDLINE } from '../lib/phone.js'

const SITE_HOST = 'usmania.vercel.app'

export default function Footer() {
  const { site, packages } = useSite()
  const c = site.company
  const wa = useWaLink()
  const year = new Date().getFullYear()
  const landline = c.landline || DEFAULT_LANDLINE
  const street = [c.address?.street, c.address?.city, c.address?.country].filter(Boolean).join(', ')

  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-footer__contact">
        <ul className="site-footer__row" role="list">
          <li>
            <Icon name="pin" className="k-ico" />
            <span>{street}</span>
          </li>
          <li>
            <Icon name="phone" className="k-ico" />
            <span>
              <a href={`tel:+${waNumber(landline)}`}>{formatPk(landline)}</a>
              <a href={wa('general')} target="_blank" rel="noopener">{formatPk(c.whatsapp || c.phone)} <span className="site-footer__tag">WhatsApp</span></a>
            </span>
          </li>
          <li>
            <Icon name="mail" className="k-ico" />
            <span>
              <a href={`mailto:${c.email}`}>{c.email}</a>
              <a href={`https://${SITE_HOST}`}>{SITE_HOST}</a>
            </span>
          </li>
          <li>
            <Icon name="clock" className="k-ico" />
            <dl className="site-footer__hours">
              {hoursRows(c.hours).map(h => (
                <div key={h.days}><dt>{h.days}</dt><dd>{h.time}</dd></div>
              ))}
            </dl>
          </li>
        </ul>
      </div>

      <div className="site-footer__band">
        <svg className="site-footer__sweep" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0H1440V90C1200 60 1000 140 760 120S260 150 0 40Z" className="site-footer__sweep-paper" />
          <path d="M0 38C260 148 520 98 760 118S1200 58 1440 88" className="site-footer__ribbon" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <Lockup tone="dark" markSize={80} />
            <p lang="ar" dir="rtl" className="site-footer__arabic">خدمات ضيوف الرحمن</p>
          </div>

          <nav className="site-footer__col" aria-label="Footer">
            <h2 className="site-footer__title">Explore</h2>
            <ul role="list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/packages">Packages</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>

          <div className="site-footer__col">
            <h2 className="site-footer__title">Packages</h2>
            {/* From the live package data, so renamed packages never leave a dead link. */}
            <ul role="list">
              {packages.slice(0, 5).map(p => (
                <li key={p.id}><Link to={`/packages#${encodeURIComponent(p.id)}`}>{p.name}</Link></li>
              ))}
              <li><Link to="/packages#qafila">Qafila e Shoq</Link></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h2 className="site-footer__title">Follow</h2>
            <ul className="site-footer__socials" role="list">
              {(c.socials || []).map(s => (
                <li key={s.name}>
                  <a href={s.url} target="_blank" rel="noopener" aria-label={s.name}><Icon name={s.icon} className="k-ico" /></a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-footer__credit">
          <p>© {year} Karwan e Usmania International · Travel &amp; Tours</p>
        </div>
      </div>
    </footer>
  )
}
