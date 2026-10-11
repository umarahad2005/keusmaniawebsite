import { Link, useParams } from 'react-router-dom'
import TeamDigitalCard from '../components/TeamDigitalCard.jsx'
import JsonLd from '../components/JsonLd.jsx'
import { useDocumentHead } from '../lib/useDocumentHead.js'
import { useSite } from '../lib/SiteContext.jsx'
import { findMember, memberUrl } from '../lib/team.js'
import { BRAND, SITE_URL } from '../lib/brand.js'

/* Shareable digital card: /team/:slug (e.g. sent on WhatsApp or as a QR code).
   Paper page, the card centred, a way back to the whole team. */
export default function TeamMember() {
  const { slug } = useParams()
  const { site } = useSite()
  const m = findMember(site.team, slug)

  useDocumentHead({
    title: m ? `${m.name}${m.role ? ` — ${m.role}` : ''} | ${BRAND}` : `Team | ${BRAND}`,
    description: m ? `${m.name}${m.role ? `, ${m.role}` : ''} at ${BRAND}, Lahore. Save the contact or message on WhatsApp.` : `Meet the team at ${BRAND}.`,
    canonical: m ? memberUrl(m) : `${SITE_URL}/about`,
    ogImage: '/og/about.jpg',
  })

  return (
    <section className="k-section dcard-page" data-surface="ivory" data-page-header aria-label={m ? `${m.name}, digital card` : 'Team member'}>
      <div className="k-container dcard-page__inner">
        {m ? (
          <>
            <JsonLd data={{
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: m.name,
              jobTitle: m.role || undefined,
              email: m.email || undefined,
              telephone: m.phone || undefined,
              url: memberUrl(m),
              worksFor: { '@id': `${SITE_URL}/#organization` },
            }} />
            <TeamDigitalCard member={m} headingId="dcard-page-name" level="h1" />
          </>
        ) : (
          <div className="dcard-page__missing">
            <h1 className="pheader__title">This card is not available.</h1>
            <p className="pheader__lead">The team member may have changed. Here is the whole team.</p>
          </div>
        )}
        <p className="dcard-page__back"><Link className="k-link" to="/about#team">Meet the whole Karwan <span aria-hidden="true">→</span></Link></p>
      </div>
    </section>
  )
}
