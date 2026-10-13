/* 404 for unknown URLs and unknown /team/:slug cards. The SPA still answers
   200, so the page says noindex and points canonical at itself (never at the
   home page) to keep it out of search as a soft 404. Paper page, three ways on. */
import { Link, useLocation } from 'react-router-dom'
import { useDocumentHead } from '../lib/useDocumentHead.js'
import { useWaLink } from '../lib/whatsapp.js'
import { BRAND, SITE_URL } from '../lib/brand.js'

export default function NotFound() {
  const { pathname } = useLocation()
  const wa = useWaLink()

  useDocumentHead({
    title: `Page not found | ${BRAND}`,
    description: 'This page does not exist. See our Umrah packages or message us on WhatsApp.',
    canonical: `${SITE_URL}${pathname}`,
    ogImage: '/og/home.jpg',
    noindex: true,
  })

  return (
    <section className="k-section notfound" data-surface="ivory" data-page-header aria-labelledby="notfound-title">
      <div className="k-container notfound__inner">
        <h1 className="pheader__title" id="notfound-title">Page not found</h1>
        <p className="pheader__lead">The link may be old or mistyped. Here are the best places to go next.</p>
        <div className="notfound__actions">
          <Link className="k-btn k-btn--primary" to="/">Home</Link>
          <Link className="k-btn k-btn--ghost" to="/packages">Umrah packages</Link>
          <a className="k-btn k-btn--wa" href={wa('general')} target="_blank" rel="noopener">WhatsApp us</a>
        </div>
        <p className="notfound__contact"><Link className="k-link" to="/contact">Other ways to contact us <span aria-hidden="true">→</span></Link></p>
      </div>
    </section>
  )
}
