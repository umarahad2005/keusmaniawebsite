import { Link } from 'react-router-dom'
import PageHeader            from '../components/PageHeader.jsx'
import CTABanner             from '../components/CTABanner.jsx'
import JsonLd                from '../components/JsonLd.jsx'

import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'
import { SITE_URL }          from '../lib/brand.js'
import { useSite }           from '../lib/SiteContext.jsx'
import { useGuides }         from '../lib/guides.js'
import { GuideLoading }      from './Guide.jsx'
import NotFound              from './NotFound.jsx'
import { breadcrumbSchema, guidesIndexSchema, organizationSchema } from '../lib/schemas.js'

/* /guides: the index of the Umrah guides (src/data.js GUIDES, loaded through
   src/lib/guides.js). One ruled row
   per guide: its question as the link, then the short answer it opens with. */
export default function Guides() {
  const { guides, error } = useGuides()
  if (error) return <NotFound />
  return guides ? <GuidesIndex guides={guides} /> : <GuideLoading />
}

function GuidesIndex({ guides }) {
  const { site, packages } = useSite()

  useDocumentHead({
    title: 'Umrah Guides for Pilgrims from Pakistan | Karwan e Usmania International',
    description: 'Short, practical Umrah guides from a Lahore Umrah operator: how to compare packages, what a package includes, how to choose an agency, and how transport works in Saudi Arabia.',
    keywords: 'Umrah guide Pakistan, compare Umrah packages, Umrah package includes, Umrah agency Lahore, private transport Umrah',
    canonical: `${SITE_URL}/guides`,
    ogImage: '/og/packages.jpg',
  })
  useGsapAnimations(['guides'])

  return (
    <>
      <JsonLd data={[
        organizationSchema(site, packages),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
        ]),
        guidesIndexSchema(guides),
      ]} />

      <PageHeader
        eyebrow="Umrah guides"
        crumb="Guides"
        title="Plan your Umrah with confidence."
        lead="Short answers to the questions pilgrims ask before they choose a package."
        image="keu/makkah/haram-exterior"
        imageAlt="Masjid al-Haram exterior at night"
      />

      <section className="k-section guides" data-surface="paper" aria-labelledby="guides-title">
        <div className="k-container">
          <h2 className="sr-only" id="guides-title">All guides</h2>
          <ul className="guides__list" role="list">
            {guides.map(g => (
              <li key={g.slug} className="guides__item">
                <h3 className="guides__title"><Link to={`/guides/${g.slug}`}>{g.title}</Link></h3>
                <p className="guides__answer">{g.answer}</p>
              </li>
            ))}
          </ul>
          <p className="guides__faq"><Link className="k-link" to="/faq">All questions and answers <span aria-hidden="true">→</span></Link></p>
        </div>
      </section>

      <CTABanner num="" />
    </>
  )
}
