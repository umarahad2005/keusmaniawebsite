import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'
import SectionHeading from './SectionHeading.jsx'

export function WhyCard({ icon, title, body }) {
  return (
    <article className="card why-card">
      <div className="why-card__icon" aria-hidden="true"><Icon name={icon} /></div>
      <h3 className="why-card__title">{title}</h3>
      <p className="muted">{body}</p>
    </article>
  )
}

export default function WhyChooseUs({ wrapped = true }) {
  const { site } = useSite()
  const cards = (
    <div className="grid grid-2">
      {site.whyChooseUs.map(w => <WhyCard key={w.title} {...w} />)}
    </div>
  )
  if (!wrapped) return cards
  return (
    <section id="why" className="section section--cream section--pattern">
      <div className="container">
        <SectionHeading
          bismillah="اَلسَّلَامُ عَلَيْكُمْ"
          title="Why Pilgrims Choose Us"
          subtext="18 years, 25,000+ pilgrims, one mission — to serve every guest of Allah with care."
        />
        {cards}
      </div>
    </section>
  )
}
