import { Link } from 'react-router-dom'
import { useWaLink } from '../lib/whatsapp.js'

export default function CTABanner() {
  const wa = useWaLink()
  return (
    <section id="cta" className="section cta-section" data-theme="dark">
      <div className="cta-section__bg" aria-hidden="true">
        <img src="/images/madinah/prophets-mosque.jpg" alt="" loading="lazy" decoding="async" className="parallax-img" />
        <div className="cta-section__overlay" />
      </div>
      <div className="container">
        <div className="cta-banner text-center">
          <span className="eyebrow gold-text">Ready to begin?</span>
          <h2 className="section-heading__title mt-4">Let us plan your sacred journey.</h2>
          <p className="section-heading__subtext mt-4">
            Speak with our advisors on WhatsApp — most travellers receive a quote within an hour.
          </p>
          <div className="cluster mt-8" style={{ justifyContent: 'center' }}>
            <a className="btn btn--whatsapp btn--lg" href={wa('general')} target="_blank" rel="noopener">
              Chat on WhatsApp
            </a>
            <Link className="btn btn--ghost-light btn--lg" to="/contact">Visit our office</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
