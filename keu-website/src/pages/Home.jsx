import { Link } from 'react-router-dom'
import Hero                 from '../components/Hero.jsx'
import ServicesStrip        from '../components/ServicesStrip.jsx'
import SanctuariesSection   from '../components/SanctuariesSection.jsx'
import WhyChooseUs          from '../components/WhyChooseUs.jsx'
import PackagesGrid         from '../components/PackagesGrid.jsx'
import StatsSection         from '../components/StatsSection.jsx'
import TestimonialsSection  from '../components/TestimonialsSection.jsx'
import CTABanner            from '../components/CTABanner.jsx'
import SectionHeading       from '../components/SectionHeading.jsx'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'

export default function Home() {
  useDocumentHead({
    title: 'Karwan-e-Usmania — Premium Hajj & Umrah from Lahore',
    description: 'Karwan-e-Usmania offers premium Hajj and Umrah packages from Lahore, Pakistan. 18+ years experience, 25,000+ pilgrims served. Book on WhatsApp.',
    canonical: 'https://keusmania.vercel.app/',
  })
  useGsapAnimations(['home'])

  return (
    <>
      <Hero />
      <ServicesStrip />
      <SanctuariesSection />
      <WhyChooseUs />
      <section id="packages-preview" className="section">
        <div className="container">
          <SectionHeading
            bismillah="اَلْحَمْدُ لِلَّهِ"
            title="Packages Crafted for Every Family"
            subtext="Economy comfort to VIP indulgence — every package is built around the Haram experience."
          />
          <PackagesGrid showFilters={false} ids={['premium-umrah', 'vip-umrah', 'ramadan-umrah']} />
          <div className="text-center mt-12">
            <Link to="/packages" className="btn btn--secondary">See all packages</Link>
          </div>
        </div>
      </section>
      <StatsSection />
      <TestimonialsSection />
      <CTABanner />
    </>
  )
}
