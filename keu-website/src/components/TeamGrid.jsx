import { useSite } from '../lib/SiteContext.jsx'

export default function TeamGrid() {
  const { site } = useSite()
  return (
    <div className="grid grid-4">
      {site.team.map(m => (
        <article key={m.name} className="team-card">
          <div className="team-card__photo">
            <img src={m.photo} alt={m.name} loading="lazy" decoding="async" />
          </div>
          <div className="team-card__name">{m.name}</div>
          <div className="team-card__role">{m.role}</div>
        </article>
      ))}
    </div>
  )
}
