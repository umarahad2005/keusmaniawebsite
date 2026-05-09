import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'
import { useWaLink } from '../lib/whatsapp.js'

export default function ContactInfo() {
  const { site } = useSite()
  const c = site.company
  const wa = useWaLink()
  const telHref = `tel:${c.phone.replace(/[^+\d]/g,'')}`
  const waDisplay = `+${c.whatsapp.slice(0,2)} ${c.whatsapp.slice(2,5)} ${c.whatsapp.slice(5)}`

  return (
    <div className="stack">
      <div className="card contact-card">
        <div className="contact-card__icon"><Icon name="pin" /></div>
        <div>
          <h3 className="contact-card__title">Visit Our Office</h3>
          <p className="muted">{c.address.street}<br />{c.address.city}, {c.address.country} {c.address.postalCode}</p>
        </div>
      </div>
      <div className="card contact-card">
        <div className="contact-card__icon"><Icon name="whatsapp" /></div>
        <div>
          <h3 className="contact-card__title">WhatsApp</h3>
          <p className="muted"><a href={wa('general')} target="_blank" rel="noopener">{waDisplay}</a> — fastest response</p>
        </div>
      </div>
      <div className="card contact-card">
        <div className="contact-card__icon"><Icon name="phone" /></div>
        <div>
          <h3 className="contact-card__title">Phone</h3>
          <p className="muted"><a href={telHref}>{c.phone}</a></p>
        </div>
      </div>
      <div className="card contact-card">
        <div className="contact-card__icon"><Icon name="mail" /></div>
        <div>
          <h3 className="contact-card__title">Email</h3>
          <p className="muted"><a href={`mailto:${c.email}`}>{c.email}</a></p>
        </div>
      </div>
      <div className="card contact-card">
        <div className="contact-card__icon"><Icon name="clock" /></div>
        <div>
          <h3 className="contact-card__title">Office Hours</h3>
          <ul className="muted" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {c.hours.map(h => <li key={h.days}><strong>{h.days}:</strong> {h.time}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
