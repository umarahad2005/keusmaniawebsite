import { useState } from 'react'
import { useSite } from '../lib/SiteContext.jsx'
import SectionHeading from './SectionHeading.jsx'
import JsonLd from './JsonLd.jsx'

export default function FAQSection() {
  const { site } = useSite()
  const faqs = site.faqs || []
  const [openIdx, setOpenIdx] = useState(0)

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
    <section id="faq" className="section section--cream">
      <div className="container">
        <SectionHeading
          bismillah="سَوَالاَت"
          title="Frequently Asked Questions"
          subtext="Everything pilgrims ask before they book. If your question isn't here, message us on WhatsApp — we usually reply within an hour."
        />
        <div className="faq-list" itemScope itemType="https://schema.org/FAQPage">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="faq-item"
              open={openIdx === i}
              onToggle={(e) => { if (e.target.open) setOpenIdx(i) }}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <summary className="faq-item__q" itemProp="name">
                <span>{f.q}</span>
                <span className="faq-item__chev" aria-hidden="true">+</span>
              </summary>
              <div
                className="faq-item__a"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
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
