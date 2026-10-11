/* Closing letter (DESIGN-LANGUAGE §4 CTA band). On paper between double
   hairlines: topic chips that open WhatsApp with the right message, the
   WhatsApp button, a Call button and the office hours. The phone thumb bar hides
   over this band because it carries the same buttons. */
import { useWaLink, waNumber } from '../lib/whatsapp.js'
import { useSite } from '../lib/SiteContext.jsx'
import { hoursRows } from '../lib/hours.js'
import { Icon } from '../icons.jsx'

const CHIPS = [
  { key: 'umrah', label: 'Umrah' },
  { key: 'qafila', label: 'Qafila e Shoq' },
  { key: 'general', label: 'Something else' },
]

export default function CTABanner({ num = '11' }) {
  const wa = useWaLink()
  const { site } = useSite()
  const c = site.company
  return (
    <section id="cta" className="k-section cta" data-surface="paper" data-thumbbar-hide aria-labelledby="cta-title">
      <div className="k-container">
        <div className="cta__letter" data-reveal="block">
          <p className="runhead runhead--center">
            {num && <span className="runhead__num">{num}</span>}
            <span className="runhead__rule" aria-hidden="true" />
            <span className="runhead__label">Ready to begin?</span>
          </p>
          <h2 className="cta__title section-heading__title" id="cta-title">Let us plan your sacred journey.</h2>
          <p className="cta__lead">Choose a topic and we will reply on WhatsApp.</p>
          <ul className="cta__chips" role="list">
            {CHIPS.map(ch => (
              <li key={ch.key}><a className="filter-chip" href={wa(ch.key)} target="_blank" rel="noopener">{ch.label}</a></li>
            ))}
          </ul>
          <div className="cta__actions">
            <a className="k-btn k-btn--wa k-btn--lg" href={wa('general')} target="_blank" rel="noopener">
              <Icon name="whatsapp" className="k-ico" /> Chat on WhatsApp
            </a>
            <a className="k-btn k-btn--ghost k-btn--lg" href={`tel:+${waNumber(c.phone)}`}>
              <Icon name="phone" className="k-ico" /> Call us
            </a>
          </div>
          <p className="cta__hours">
            {hoursRows(c.hours).map(h => `${h.days} ${h.time}`).join(' · ')} <span>(Pakistan time)</span>
          </p>
        </div>
      </div>
    </section>
  )
}
