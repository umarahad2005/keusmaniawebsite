import { useSite } from '../lib/SiteContext.jsx'
import SectionHeading from './SectionHeading.jsx'

export default function TestimonialsSection() {
  const { site } = useSite()
  return (
    <section id="testimonials" className="section section--cream">
      <div className="container">
        <SectionHeading bismillah="جَزَاكَ اللهُ خَيْرًا" title="Voices from Our Pilgrims" />
        <div className="grid grid-3">
          {site.testimonials.map((t, i) => (
            <article key={i} className="testimonial-card">
              <span className="testimonial-card__quote-mark" aria-hidden="true">"</span>
              <div className="testimonial-card__stars" aria-label={`${t.rating} star rating`}>{'★'.repeat(t.rating)}</div>
              <p className="testimonial-card__quote">{t.quote}</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar avatar-initials">{t.initials}</div>
                <div>
                  <div className="testimonial-card__name">{t.name}</div>
                  <div className="testimonial-card__location">{t.location} · {t.trip}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
