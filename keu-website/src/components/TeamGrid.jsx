import { useSite } from '../lib/SiteContext.jsx'
import Img from './Img.jsx'

export default function TeamGrid() {
  const { site } = useSite()
  return (
    <div className="grid grid-4">
      {site.team.map(m => (
        <article key={m.name} className="team-card">
          <div className="team-card__photo">
            <Img src={m.photo} alt={m.name} widths={[300, 480, 640]} sizes="(max-width: 640px) 50vw, 25vw" loading="lazy" decoding="async" />
          </div>
          <div className="team-card__name">{m.name}</div>
          <div className="team-card__role">{m.role}</div>
        </article>
      ))}
    </div>
  )
}
