import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'

export default function StatsSection() {
  const { site } = useSite()
  return (
    <section id="stats" className="section section--dark" data-theme="dark">
      <div className="container">
        <div className="grid grid-4">
          {site.stats.map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card__icon" aria-hidden="true"><Icon name={s.icon} /></div>
              <span className="stat-card__value" data-count={s.value} data-suffix={s.suffix}>0{s.suffix}</span>
              <span className="stat-card__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
