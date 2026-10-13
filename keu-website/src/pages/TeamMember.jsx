/* Shareable digital card: /team/:slug (e.g. sent on WhatsApp or as a QR code).
   Paper page, the card centred, a way back to the whole team.
   An unknown slug is a 404 only once /api/content has answered successfully: a
   member added in the admin is not in the bundled defaults, so it must not flash
   404 while loading, nor get a noindex 404 while the API is down (the card URL
   is in the sitemap). Until then the page stays neutral: self canonical, no
   noindex. */
import { Link, useParams } from 'react-router-dom'
import TeamDigitalCard from '../components/TeamDigitalCard.jsx'
import JsonLd from '../components/JsonLd.jsx'
import { useDocumentHead } from '../lib/useDocumentHead.js'
import { useSite } from '../lib/SiteContext.jsx'
import { findMember, memberUrl } from '../lib/team.js'
import { BRAND, SITE_URL } from '../lib/brand.js'
import NotFound from './NotFound.jsx'

export default function TeamMember() {
  const { slug } = useParams()
  const { site, loaded, error } = useSite()
  const m = findMember(site.team, slug)
  if (!m && loaded && !error) return <NotFound />
  return <MemberCard m={m} slug={slug} />
}

/* m is null while content is loading (or the API failed): an empty paper page. */
function MemberCard({ m, slug }) {
  useDocumentHead({
    title: m ? `${m.name}${m.role ? ` — ${m.role}` : ''} | ${BRAND}` : `Team | ${BRAND}`,
    description: m ? `${m.name}${m.role ? `, ${m.role}` : ''} at ${BRAND}, Lahore. Save the contact or message on WhatsApp.` : `Meet the team at ${BRAND}.`,
    canonical: m ? memberUrl(m) : `${SITE_URL}/team/${encodeURIComponent(slug)}`,
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
        ) : null}
        <p className="dcard-page__back"><Link className="k-link" to="/about#team">Meet the whole Karwan <span aria-hidden="true">→</span></Link></p>
      </div>
    </section>
  )
}
