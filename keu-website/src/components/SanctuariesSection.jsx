import { useSite } from '../lib/SiteContext.jsx'
import SectionHeading from './SectionHeading.jsx'

export default function SanctuariesSection() {
  const { site } = useSite()
  return (
    <section id="sanctuaries" className="section">
      <div className="container">
        <SectionHeading
          bismillah="اَلْحَرَمَيْنِ الشَّرِيفَيْنِ"
          title="Two Sanctuaries, One Journey"
          subtext="Every package we craft moves around the same two centres — the House of Allah, and the resting place of His Beloved ﷺ."
        />
        <div className="grid grid-2">
          {site.sanctuaries.map(s => (
            <article key={s.title} className="sanctuary-card">
              <div className="sanctuary-card__media">
                <img src={s.image} alt={s.alt} loading="lazy" decoding="async" />
              </div>
              <div className="sanctuary-card__body">
                <h3 className="sanctuary-card__title">{s.title}</h3>
                <p className="sanctuary-card__subtitle">{s.subtitle}</p>
                <p className="muted mt-4">{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
