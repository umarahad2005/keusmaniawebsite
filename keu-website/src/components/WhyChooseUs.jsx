/* Why pilgrims choose us (DESIGN-LANGUAGE §4 WhyUs bento): a 2×2 hairline
   lattice with the karwan's own copy, verbatim. One row of four on About. */
import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'
import SectionHeading from './SectionHeading.jsx'

export function WhyCard({ icon, title, body }) {
  return (
    <article className="why__cell why-card" data-reveal="block">
      <span className="why__icon" aria-hidden="true"><Icon name={icon} className="k-ico" /></span>
      <h3 className="why__title">{title}</h3>
      <p className="why__body">{body}</p>
    </article>
  )
}

export default function WhyChooseUs({ wrapped = true, row = false, surface = 'paper' }) {
  const { site } = useSite()
  const cells = (
    <div className={`why__lattice${row ? ' why__lattice--row' : ''}`}>
      {(site.whyChooseUs || []).map(w => <WhyCard key={w.title} {...w} />)}
    </div>
  )
  if (!wrapped) return cells
  return (
    <section id="why" className="k-section why" data-surface={surface} aria-labelledby="why-title">
      <div className="k-container">
        <SectionHeading num="08" eyebrow="Why pilgrims choose us" id="why-title" title="Why Pilgrims Choose Us" />
        {cells}
      </div>
    </section>
  )
}
