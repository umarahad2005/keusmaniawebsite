/* How booking works (DESIGN-LANGUAGE §4 BookingSteps; copy approved 2026-10-10).
   Four orbit-ring numerals joined by one hairline that draws; a vertical rail on
   phones. The step texts restate the karwan's own copy. */
import { useWaLink } from '../lib/whatsapp.js'
import { Icon } from '../icons.jsx'
import SectionHeading from './SectionHeading.jsx'

const STEPS = [
  { title: 'Message us on WhatsApp', body: 'Tell us your dates and who is travelling. WhatsApp us anytime, even from the Haram itself.' },
  { title: 'Choose your package', body: 'Every cost is explained upfront, in writing, before you commit.' },
  { title: 'Visa and documents', body: 'Visa processing is handled by our team.' },
  { title: 'Travel with support', body: 'Our trusted partners in Makkah and Madinah handle hotels, transport and ziyarah.' },
]

function OrbitNumeral({ n }) {
  return (
    <span className="steps__num" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="steps__ring">
        <circle cx="50" cy="50" r="47" pathLength="360" strokeDasharray="44 21 272 23" strokeDashoffset="-13" transform="rotate(-90 50 50)" />
      </svg>
      <span>{n}</span>
    </span>
  )
}

export default function BookingSteps() {
  const wa = useWaLink()
  return (
    <section id="booking-steps" className="k-section steps" data-surface="ivory" aria-labelledby="steps-title">
      <div className="k-container">
        <SectionHeading num="05" eyebrow="Booking steps" id="steps-title" title="From your first call to your safe return." />
        <div className="steps__wrap">
          <span className="steps__rail" data-reveal="t0" aria-hidden="true" />
          <ol className="steps__list" role="list">
            {STEPS.map((s, i) => (
              <li key={s.title} className="steps__item" data-reveal="t2">
                <OrbitNumeral n={i + 1} />
                <h3 className="steps__title">{s.title}</h3>
                <p className="steps__body">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <a className="k-btn k-btn--wa steps__cta" href={wa('umrah')} target="_blank" rel="noopener" data-reveal="t1">
          <Icon name="whatsapp" className="k-ico" /> Start step 1 on WhatsApp
        </a>
      </div>
    </section>
  )
}
