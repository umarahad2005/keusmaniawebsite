import { useState } from 'react'
import { api } from '../lib/api.js'
import { useWaLink } from '../lib/whatsapp.js'

const PACKAGE_OPTIONS = [
  { value: '',         label: 'Select a package' },
  { value: 'economy',  label: 'Economy Umrah' },
  { value: 'premium',  label: 'Premium Umrah' },
  { value: 'vip',      label: 'VIP Umrah' },
  { value: 'ramadan',  label: 'Ramadan Umrah' },
  { value: 'hajj',     label: 'Hajj 2025–2027' },
  { value: 'family',   label: 'Family Package' },
]

const initial = { name: '', phone: '', email: '', package: '', prefer: 'whatsapp', message: '', website: '' }

export default function ContactForm() {
  const [form,    setForm]    = useState(initial)
  const [errors,  setErrors]  = useState({})
  const [status,  setStatus]  = useState('idle')   // idle | sending | sent | error
  const [errMsg,  setErrMsg]  = useState(null)
  const wa = useWaLink()

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim())    errs.name    = true
    if (!form.phone.trim())   errs.phone   = true
    if (!form.message.trim()) errs.message = true
    setErrors(errs)
    if (Object.keys(errs).length) return

    setStatus('sending')
    setErrMsg(null)

    // Send to backend (saves to Mongo + emails admin). On failure we still
    // open WhatsApp so the user is never stuck.
    try {
      await api.post('/api/contact', form)
      setStatus('sent')
    } catch (err) {
      console.warn('[contact] backend send failed:', err.message)
      setStatus('error')
      setErrMsg(err.message)
    }

    // Always open WhatsApp with the composed message (the brand's primary channel)
    const text = [
      'Assalamu Alaikum,',
      '',
      `My name is ${form.name}.`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      form.package ? `Interested in: ${form.package}` : null,
      `Preferred contact: ${form.prefer}`,
      '',
      form.message,
    ].filter(Boolean).join('\n')

    window.open(wa('general', text), '_blank', 'noopener')

    if (status !== 'error') setForm(initial)
  }

  return (
    <form className="stack" noValidate onSubmit={onSubmit}>
      {/* Honeypot — bots fill this; real users won't see it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={update('website')}
        style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, opacity: 0 }}
      />

      <div className={`field ${errors.name ? 'field--error' : ''}`}>
        <label className="field__label" htmlFor="c-name">Full Name</label>
        <input className="field__input" id="c-name" name="name" type="text" required autoComplete="name"
               value={form.name} onChange={update('name')} />
      </div>
      <div className={`field ${errors.phone ? 'field--error' : ''}`}>
        <label className="field__label" htmlFor="c-phone">Phone</label>
        <input className="field__input" id="c-phone" name="phone" type="tel" required autoComplete="tel"
               value={form.phone} onChange={update('phone')} />
      </div>
      <div className="field">
        <label className="field__label" htmlFor="c-email">Email</label>
        <input className="field__input" id="c-email" name="email" type="email" autoComplete="email"
               value={form.email} onChange={update('email')} />
      </div>
      <div className="field">
        <label className="field__label" htmlFor="c-package">Package Interest</label>
        <select className="field__select" id="c-package" name="package" value={form.package} onChange={update('package')}>
          {PACKAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="field">
        <label className="field__label" htmlFor="c-prefer">Preferred Contact</label>
        <select className="field__select" id="c-prefer" name="prefer" value={form.prefer} onChange={update('prefer')}>
          <option value="whatsapp">WhatsApp</option>
          <option value="call">Phone Call</option>
          <option value="email">Email</option>
        </select>
      </div>
      <div className={`field ${errors.message ? 'field--error' : ''}`}>
        <label className="field__label" htmlFor="c-message">Message</label>
        <textarea className="field__textarea" id="c-message" name="message" rows={5} required
                  value={form.message} onChange={update('message')} />
      </div>

      <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send via WhatsApp'}
      </button>

      {status === 'sent' && (
        <p className="muted" style={{ color: 'var(--color-green)', fontSize: 'var(--text-sm)' }}>
          ✓ Sent — we have your message. WhatsApp will open in a new tab to continue the conversation.
        </p>
      )}
      {status === 'error' && (
        <p className="muted" style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
          We couldn't save the message right now ({errMsg}) — but WhatsApp is opening with your details so you can still reach us.
        </p>
      )}
      <p className="muted" style={{ fontSize: 'var(--text-xs)' }}>
        Submitting saves your message to our inbox and opens WhatsApp with it pre-filled.
      </p>
    </form>
  )
}
