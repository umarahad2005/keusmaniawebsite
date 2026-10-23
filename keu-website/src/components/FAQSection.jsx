/* Questions (DESIGN-LANGUAGE §4 FAQ). A sticky heading beside native <details>
   rows (first one open). Opening is animated with ::details-content where the
   browser supports it, and instant elsewhere and under reduced motion. Keeps
   #faq and .faq-item__q.

   The full owner-approved list (39 questions, 2026-10-12) lives on /faq,
   grouped by topic, and that page alone carries the FAQPage JSON-LD (one
   canonical FAQ URL for search and answer engines). Here a page shows a
   subset: Home the first `limit` questions, Packages its own topic
   (`topics`), each with a link to the full page. */
import { Link } from 'react-router-dom'
import { useSite } from '../lib/SiteContext.jsx'
import { useWaLink } from '../lib/whatsapp.js'
import { faqTopic, usableFaqs } from '../lib/faqTopics.js'
import SectionHeading from './SectionHeading.jsx'

/** One question row; shared with the /faq page. */
export function FaqItem({ f, open = false }) {
  return (
    <details className="faq-item" open={open}>
      <summary className="faq-item__q">
        <span>{f.q}</span>
        <span className="faq-item__icon" aria-hidden="true" />
      </summary>
      <div className="faq-item__a">
        <p>{f.a}</p>
      </div>
    </details>
  )
}

export default function FAQSection({ num = '10', surface = 'paper', limit = 8, topics = null, lead = 'Everything pilgrims ask before they book.' }) {
  const { site } = useSite()
  const wa = useWaLink()
  const all = usableFaqs(site.faqs)
  const faqs = (topics ? all.filter(f => topics.includes(faqTopic(f))) : all).slice(0, limit || undefined)
  if (!faqs.length) return null

  return (
    <section id="faq" className="k-section faq" data-surface={surface} aria-labelledby="faq-title">
      <div className="k-container faq__grid">
        <div className="faq__head">
          <SectionHeading num={num} eyebrow="Questions" id="faq-title" title="Frequently Asked Questions" lead={lead} />
          <a className="k-link" href={wa('general')} target="_blank" rel="noopener">Ask on WhatsApp <span aria-hidden="true">→</span></a>
        </div>
        <div className="faq__list">
          {faqs.map((f, i) => <FaqItem key={i} f={f} open={i === 0} />)}
          {all.length > faqs.length && (
            <Link className="k-link faq__more" to="/faq">All {all.length} questions, by topic <span aria-hidden="true">→</span></Link>
          )}
        </div>
      </div>
    </section>
  )
}
