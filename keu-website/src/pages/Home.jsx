import { Link } from 'react-router-dom'
import VideoHero            from '../components/VideoHero.jsx'
import Seam                 from '../components/Seam.jsx'
import StatsSection         from '../components/StatsSection.jsx'
import PackagesGrid         from '../components/PackagesGrid.jsx'
import BookingSteps         from '../components/BookingSteps.jsx'
import ServicesStrip        from '../components/ServicesStrip.jsx'
import SanctuaryChapter     from '../components/SanctuaryChapter.jsx'
import WhyChooseUs          from '../components/WhyChooseUs.jsx'
import TestimonialsSection  from '../components/TestimonialsSection.jsx'
import FAQSection           from '../components/FAQSection.jsx'
import CTABanner            from '../components/CTABanner.jsx'
import SectionHeading       from '../components/SectionHeading.jsx'
import JsonLd               from '../components/JsonLd.jsx'

import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'
import { SITE_URL }          from '../lib/brand.js'
import { useSite }           from '../lib/SiteContext.jsx'
import { organizationSchema, websiteSchema, speakableSchema } from '../lib/schemas.js'

/* Home (DESIGN-LANGUAGE §5.1): the film, the seam, then the letter.
   Running-head numbers: 03 ledger · 04 packages · 05 steps · 06 services ·
   07 Makkah/Madinah · 08 why · 09 voices · 10 questions · 11 closing letter. */
export default function Home() {
  const { site, packages } = useSite()
  // "Prices per person" only when a card actually shows a price (not while
  // the neutral "On request" placeholders are up, or every package is on request).
  const anyPriced = packages.some(p => /\d/.test(String(p.priceLabel || '')))

  useDocumentHead({
    title: 'Karwan e Usmania International — Umrah packages from Lahore since 2005',
    description: 'Karwan e Usmania International · Travel & Tours offers Umrah packages from Lahore, Pakistan. 21+ years of experience, every cost explained in writing, visa handled by our team. Book on WhatsApp.',
    keywords: 'Umrah packages Lahore, Umrah package price Pakistan, Umrah package without air ticket, Karwan e Usmania International, Qafila e Shoq',
    canonical: `${SITE_URL}/`,
    ogImage: '/og/home.jpg',
  })
  useGsapAnimations(['home'])

  return (
    <>
      <JsonLd data={[organizationSchema(site, packages), websiteSchema(), speakableSchema()]} />

      <VideoHero />
      <Seam />

      <div className="home-pair" data-surface="paper">
        <StatsSection className="home-pair__ledger" />
        <section id="packages-preview" className="k-section home-pair__packages" aria-labelledby="packages-title">
          <div className="k-container">
            <SectionHeading
              num="04"
              eyebrow="Choose your karwan"
              id="packages-title"
              title="Packages Crafted for Every Family"
              lead="From simple and affordable to premium comfort. Every Umrah package is built around the Haram experience."
            />
            <PackagesGrid showFilters={false} featured limit={3} />
            <p className="home-pair__trust">{anyPriced ? 'Prices per person · every cost' : 'Every cost'} explained in writing before you commit</p>
            <Link className="k-link" to="/packages">All packages and Qafila e Shoq <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </div>

      <BookingSteps />
      <ServicesStrip />
      <SanctuaryChapter />
      <WhyChooseUs />
      <TestimonialsSection />
      <FAQSection />
      <CTABanner />
    </>
  )
}
