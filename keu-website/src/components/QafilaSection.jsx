import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'
import { useWaLink } from '../lib/whatsapp.js'

export default function QafilaSection() {
  const { site } = useSite()
  const wa = useWaLink()
  const q = site.qafila
  if (!q) return null

  return (
    <section id="qafila" className="section qafila-section">
      <div className="container">
        <div className="qafila-card">
          <div className="qafila-card__head">
            <img className="qafila-card__logo" src={q.logo} alt={q.name} loading="lazy" decoding="async" />
            <span className="qafila-card__urdu">{q.urduTagline}</span>
            <h2 className="qafila-card__title">{q.name}</h2>
            <span className="badge badge--gold">{q.tagline}</span>
          </div>

          <div className="qafila-card__body">
            <p className="qafila-card__leader">
              <strong>{q.leader}</strong>
              <span className="muted"> · {q.leaderTitle}</span>
            </p>
            <p className="lead">{q.intro}</p>
            <p className="muted">{q.body}</p>
          </div>

          <div className="qafila-pillars">
            {q.pillars.map(p => (
              <article key={p.title} className="qafila-pillar">
                <div className="qafila-pillar__icon" aria-hidden="true"><Icon name={p.icon} /></div>
                <span className="qafila-pillar__urdu">{p.urdu}</span>
                <h3 className="qafila-pillar__title">{p.title}</h3>
                <p className="muted">{p.body}</p>
              </article>
            ))}
          </div>

          <div className="qafila-card__footer">
            <a className="btn btn--whatsapp btn--lg" href={wa('general', q.waMessage)} target="_blank" rel="noopener">
              Enquire on WhatsApp
            </a>
            <p className="muted" style={{ fontSize: 'var(--text-sm)' }}>
              Limited seats · By application only
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
