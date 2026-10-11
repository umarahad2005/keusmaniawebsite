/* Contact details as the letterhead footer, enlarged (DESIGN-LANGUAGE §5.2
   Contact): the full lockup, then green-divided columns for the address,
   phones, email and hours. Below it, one WhatsApp row per topic. */
import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'
import { useWaLink } from '../lib/whatsapp.js'
import { hoursRows } from '../lib/hours.js'
import { formatPk, telHref, DEFAULT_LANDLINE } from '../lib/phone.js'
import Lockup from './brand/Lockup.jsx'

const TOPICS = [
  { key: 'umrah', label: 'Umrah', sub: 'Packages, dates and prices' },
  { key: 'qafila', label: 'Qafila e Shoq', sub: 'The spiritual journey programme' },
  { key: 'general', label: 'Something else', sub: 'Visas, documents or any question' },
]

export function ContactLetterhead() {
  const { site } = useSite()
  const c = site.company
  const wa = useWaLink()
  const landline = c.landline || DEFAULT_LANDLINE
  const mobile = c.whatsapp || c.phone
  const a = c.address || {}

  return (
    <div className="cletter">
      <Lockup tone="paper" markSize={88} className="cletter__lockup" />
      <ul className="cletter__cols" role="list">
        <li className="cletter__col">
          <h2 className="cletter__label"><Icon name="pin" className="k-ico" /> Office</h2>
          <address className="cletter__text">
            {a.street}<br />{[a.city, a.country].filter(Boolean).join(', ')}{a.postalCode ? ` ${a.postalCode}` : ''}
          </address>
        </li>
        <li className="cletter__col">
          <h2 className="cletter__label"><Icon name="phone" className="k-ico" /> Phone</h2>
          <p className="cletter__text">
            <a href={telHref(landline)}>{formatPk(landline)}</a><br />
            <a href={wa('general')} target="_blank" rel="noopener">{formatPk(mobile)}</a> <span className="cletter__tag">WhatsApp</span>
          </p>
        </li>
        <li className="cletter__col">
          <h2 className="cletter__label"><Icon name="mail" className="k-ico" /> Email</h2>
          <p className="cletter__text"><a href={`mailto:${c.email}`}>{c.email}</a></p>
        </li>
        <li className="cletter__col">
          <h2 className="cletter__label"><Icon name="clock" className="k-ico" /> Hours</h2>
          <dl className="cletter__hours">
            {hoursRows(c.hours).map(h => <div key={h.days}><dt>{h.days}</dt><dd>{h.time}</dd></div>)}
          </dl>
          <p className="cletter__note">Pakistan time</p>
        </li>
      </ul>
    </div>
  )
}

export function WhatsAppRows() {
  const wa = useWaLink()
  return (
    <div className="warows">
      <h2 className="warows__title">Message us on WhatsApp</h2>
      <ul className="warows__list" role="list">
        {TOPICS.map(t => (
          <li key={t.key}>
            <a className="warows__row" href={wa(t.key)} target="_blank" rel="noopener">
              <span className="warows__icon" aria-hidden="true"><Icon name="whatsapp" className="k-ico" /></span>
              <span className="warows__text">
                <span className="warows__label">{t.label}</span>
                <span className="warows__sub">{t.sub}</span>
              </span>
              <span className="warows__arrow" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ContactInfo() {
  return (
    <>
      <ContactLetterhead />
      <WhatsAppRows />
    </>
  )
}
