import { Link } from 'react-router-dom'
import PageHeader            from '../components/PageHeader.jsx'
import SectionHeading        from '../components/SectionHeading.jsx'
import CTABanner             from '../components/CTABanner.jsx'
import JsonLd                from '../components/JsonLd.jsx'
import { FaqItem }           from '../components/FAQSection.jsx'

import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'
import { SITE_URL }          from '../lib/brand.js'
import { useSite }           from '../lib/SiteContext.jsx'
import { useWaLink }         from '../lib/whatsapp.js'
import { groupFaqs }         from '../lib/faqTopics.js'
import { breadcrumbSchema, faqPageSchema, organizationSchema } from '../lib/schemas.js'

/* /faq: every owner-approved question (admin → FAQs), grouped by topic
   (src/lib/faqTopics.js), with a jump list under the header. This is the one
   URL that carries the FAQPage JSON-LD; Home and Packages show subsets that
   link here. Each group reuses the Home FAQ layout (sticky heading beside the
   rows), alternating paper and ivory. */
export default function Faq() {
  const { site, packages } = useSite()
  const wa = useWaLink()
  const groups = groupFaqs(site.faqs)
  const faqs = groups.flatMap(g => g.faqs)

  useDocumentHead({
    title: 'Umrah Questions and Answers | Karwan e Usmania International',
    description: 'Answers to the questions pilgrims ask before Umrah from Pakistan: booking and payment, packages and hotels, visa and documents, transport in Saudi Arabia, our office in Lahore and Qafila e Shoq.',
    keywords: 'Umrah FAQ Pakistan, Umrah visa documents, Umrah package questions, Umrah booking Lahore, Karwan e Usmania International',
    canonical: `${SITE_URL}/faq`,
    ogImage: '/og/packages.jpg',
  })
  useGsapAnimations(['faq'])

  return (
    <>
      <JsonLd data={[
        organizationSchema(site, packages),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Questions', url: '/faq' },
        ]),
        ...(faqs.length ? [faqPageSchema(faqs)] : []),
      ]} />

      <PageHeader
        eyebrow="Questions"
        crumb="Questions"
        title="Umrah questions, answered."
        lead={`${faqs.length} questions pilgrims ask before they book, by topic. Anything else, ask us on WhatsApp.`}
        image="keu/madinah/masjid-nabawi-exterior"
        imageAlt="Prophet's Mosque courtyard with umbrellas"
      />

      {groups.length > 1 && (
        <nav className="faq-topics" data-surface="paper" aria-label="Topics">
          <ul className="k-container" role="list">
            {groups.map(g => (
              <li key={g.key}><a className="filter-chip" href={`#faq-${g.key}`}>{g.label} <span className="faq-topics__n">{g.faqs.length}</span></a></li>
            ))}
          </ul>
        </nav>
      )}

      {groups.map((g, gi) => (
        <section key={g.key} id={`faq-${g.key}`} className="k-section faq faq--topic" data-surface={gi % 2 ? 'ivory' : 'paper'} aria-labelledby={`faq-${g.key}-title`}>
          <div className="k-container faq__grid">
            <div className="faq__head">
              <SectionHeading num={String(gi + 1).padStart(2, '0')} eyebrow={g.label} id={`faq-${g.key}-title`} title={g.title} />
              {g.key === 'packages' && <Link className="k-link" to="/packages">See current packages <span aria-hidden="true">→</span></Link>}
              {g.key !== 'packages' && <a className="k-link" href={wa(g.key === 'qafila' ? 'qafila' : 'general')} target="_blank" rel="noopener">Ask on WhatsApp <span aria-hidden="true">→</span></a>}
            </div>
            <div className="faq__list">
              {g.faqs.map((f, i) => <FaqItem key={i} f={f} open={gi === 0 && i === 0} />)}
            </div>
          </div>
        </section>
      ))}

      <section className="k-section faq-guides" data-surface={groups.length % 2 ? 'ivory' : 'paper'} aria-labelledby="faq-guides-title">
        <div className="k-container">
          <h2 className="faq-guides__title" id="faq-guides-title">Planning in more depth?</h2>
          <p><Link className="k-link" to="/guides">Read our Umrah guides <span aria-hidden="true">→</span></Link></p>
        </div>
      </section>

      <CTABanner num={String(groups.length + 1).padStart(2, '0')} />
    </>
  )
}
