import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'

export default function ServicesStrip() {
  const { site } = useSite()
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="services-strip">
          {site.services.map(s => (
            <div key={s.label} className="service-card">
              <div className="service-card__icon" aria-hidden="true"><Icon name={s.icon} /></div>
              <div className="service-card__label">{s.label}</div>
              <div className="service-card__sublabel" dangerouslySetInnerHTML={{ __html: s.sublabel }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
