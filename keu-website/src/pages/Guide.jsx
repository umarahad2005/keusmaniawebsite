import { Link, useParams } from 'react-router-dom'
import PageHeader            from '../components/PageHeader.jsx'
import CTABanner             from '../components/CTABanner.jsx'
import JsonLd                from '../components/JsonLd.jsx'
import NotFound              from './NotFound.jsx'

import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'
import { BRAND, SITE_URL }   from '../lib/brand.js'
import { useSite }           from '../lib/SiteContext.jsx'
import { useWaLink }         from '../lib/whatsapp.js'
import { hoursRows }         from '../lib/hours.js'
import { packageAnchor, packageLength } from '../lib/team.js'
import { useGuides }         from '../lib/guides.js'
import { breadcrumbSchema, guideSchema, organizationSchema } from '../lib/schemas.js'
import { Icon }              from '../icons.jsx'

/* /guides/<slug> (copy in src/data.js GUIDES, awaiting owner review; loaded
   through src/lib/guides.js so it stays out of the main bundle).
   Answer first: the 2–3 sentence summary sits right under the header with its
   date ("Updated", or "Last reviewed … by" once the owner has approved the
   guide: `approved` in GUIDES), then one H2 per section, then the way on (packages,
   WhatsApp) and the closing letter. Live blocks read the admin content, so
   prices, sold-out packages and office hours never go stale in the copy. */

const reviewedLabel = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/* "86000" → "PKR 86,000"; labels that already read "PKR 78,500" or "On request" pass through. */
const priceText = (label) => {
  const t = String(label || '').trim()
  return /^\d[\d,]*$/.test(t) ? `PKR ${Number(t.replace(/,/g, '')).toLocaleString('en-US')}` : (t || 'On request')
}

/* Air ticket, from what the package itself says: "without air ticket" in its
   text, an air ticket/flight inclusion, or neither (then we do not guess). */
function airTicket(p) {
  const text = [p.subtitle, p.summary].join(' ')
  if (/without (an )?air ?ticket|excluding (the )?air(line)? ?ticket/i.test(text)) return 'Not included'
  if ((p.inclusions || []).some(i => /air ?ticket|flight/i.test(String(i)))) return 'Included'
  return 'Ask us'
}

function PackagesTable() {
  const { packages } = useSite()
  // Available first, sold-out ones kept and marked, as on /packages.
  const list = [...packages.filter(p => !p.soldOut), ...packages.filter(p => p.soldOut)]
  if (!list.length) return null
  return (
    <div className="guide__table-wrap">
      <table className="guide__table">
        <thead>
          <tr><th scope="col">Package</th><th scope="col">Length</th><th scope="col">Price per person</th><th scope="col">Air ticket</th><th scope="col">Status</th></tr>
        </thead>
        <tbody>
          {list.map(p => (
            <tr key={p.id} className={p.soldOut ? 'is-sold-out' : undefined}>
              <th scope="row"><Link to={`/packages#${packageAnchor(p)}`}>{String(p.name || '').trim()}</Link></th>
              <td>{packageLength(p)?.label || 'Ask us'}</td>
              <td>{priceText(p.priceLabel)}</td>
              <td>{airTicket(p)}</td>
              <td>{p.soldOut ? 'Sold out' : 'Available'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Office() {
  const { site } = useSite()
  const c = site.company
  const street = [c.address?.street, c.address?.city, c.address?.country].filter(Boolean).join(', ')
  return (
    <dl className="guide__office">
      <div><dt>Address</dt><dd>{street}</dd></div>
      {hoursRows(c.hours).map(h => <div key={h.days}><dt>{h.days}</dt><dd>{h.time}</dd></div>)}
    </dl>
  )
}

const BLOCKS = { 'packages-table': PackagesTable, office: Office }

/** Empty paper page while the guide copy loads (src/lib/guides.js): only
    when arriving from another page; pre-rendered guide pages have it at once. */
export const GuideLoading = () => <section className="k-section guide-loading" data-surface="paper" data-page-header aria-busy="true" />

/* Unknown slugs get the 404 page (noindex), like unknown team cards. */
export default function Guide() {
  const { slug } = useParams()
  const { guides, error } = useGuides()
  if (!guides && !error) return <GuideLoading />
  const guide = (guides || []).find(g => g.slug === slug)
  return guide ? <GuidePage guide={guide} /> : <NotFound />
}

function GuidePage({ guide }) {
  const { site, packages } = useSite()
  const wa = useWaLink()

  useDocumentHead({
    title: guide.metaTitle || guide.title,
    description: guide.description,
    canonical: `${SITE_URL}/guides/${guide.slug}`,
    ogImage: `/og/${guide.og || 'packages'}.jpg`,
    ogType: 'article',
  })
  useGsapAnimations([guide.slug])

  return (
    <>
      <JsonLd data={[
        organizationSchema(site, packages),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
          { name: guide.title, url: `/guides/${guide.slug}` },
        ]),
        guideSchema(guide),
      ]} />

      <PageHeader
        eyebrow="Umrah guide"
        crumb={guide.title}
        parent={{ to: '/guides', label: 'Guides' }}
        title={guide.title}
        image={guide.image}
        imageAlt={guide.imageAlt}
      />

      <article className="k-section guide" data-surface="paper" aria-labelledby="guide-answer-title">
        <div className="k-container"><div className="guide__inner">
          <div className="guide__answer">
            <h2 className="sr-only" id="guide-answer-title">The short answer</h2>
            <p>{guide.answer}</p>
            <p className="guide__reviewed">
              {guide.approved
                ? <>Last reviewed <time dateTime={guide.reviewed}>{reviewedLabel(guide.reviewed)}</time> by {BRAND}</>
                : <>Updated <time dateTime={guide.reviewed}>{reviewedLabel(guide.reviewed)}</time></>}
            </p>
          </div>

          {guide.sections.map((s, i) => {
            const Block = s.block && BLOCKS[s.block]
            return (
              <section key={i} className="guide__section" aria-labelledby={`guide-s${i}`}>
                <h2 className="guide__h" id={`guide-s${i}`}>{s.h}</h2>
                {(s.p || []).map((t, j) => <p key={j}>{t}</p>)}
                {s.list && <ul className="guide__list">{s.list.map((t, j) => <li key={j}>{t}</li>)}</ul>}
                {Block && <Block />}
                {s.link && <p><Link className="k-link" to={s.link.to}>{s.link.label} <span aria-hidden="true">→</span></Link></p>}
              </section>
            )
          })}

          <div className="guide__next">
            <Link className="k-btn k-btn--primary" to="/packages">See current packages</Link>
            <a className="k-btn k-btn--wa" href={wa('general', `Assalamu Alaikum! I read your guide "${guide.title}" and have a question.`)} target="_blank" rel="noopener">
              <Icon name="whatsapp" className="k-ico" /> Ask on WhatsApp
            </a>
          </div>
          <p className="guide__more"><Link className="k-link" to="/guides">More Umrah guides</Link> · <Link className="k-link" to="/faq">All questions and answers</Link></p>
        </div></div>
      </article>

      <CTABanner num="" />
    </>
  )
}
