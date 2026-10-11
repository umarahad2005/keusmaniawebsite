/* Questions (DESIGN-LANGUAGE §4 FAQ). A sticky heading beside native <details>
   rows (first one open). The FAQPage microdata and JSON-LD stay. Opening is
   animated with ::details-content where the browser supports it, and instant
   elsewhere and under reduced motion. Keeps #faq and .faq-item__q. */
import { useSite } from '../lib/SiteContext.jsx'
import { useWaLink } from '../lib/whatsapp.js'
import SectionHeading from './SectionHeading.jsx'
import JsonLd from './JsonLd.jsx'

export default function FAQSection({ num = '10', surface = 'paper' }) {
  const { site } = useSite()
  const wa = useWaLink()
  const faqs = (site.faqs || []).filter(f => f && f.q && f.a)
  if (!faqs.length) return null

  // FAQPage structured data — the single biggest AEO signal.
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <section id="faq" className="k-section faq" data-surface={surface} aria-labelledby="faq-title">
      <div className="k-container faq__grid">
        <div className="faq__head">
          <SectionHeading num={num} eyebrow="Questions" id="faq-title" title="Frequently Asked Questions" lead="Everything pilgrims ask before they book." />
          <a className="k-link" href={wa('general')} target="_blank" rel="noopener">Ask on WhatsApp <span aria-hidden="true">→</span></a>
        </div>
        <div className="faq__list" itemScope itemType="https://schema.org/FAQPage">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="faq-item"
              open={i === 0}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <summary className="faq-item__q" itemProp="name">
                <span>{f.q}</span>
                <span className="faq-item__icon" aria-hidden="true" />
              </summary>
              <div className="faq-item__a" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
      <JsonLd data={faqLd} />
    </section>
  )
}
