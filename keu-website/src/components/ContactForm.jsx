/* Enquiry form (DESIGN-LANGUAGE §4 Contact form). Same fields and the same
   /api/contact endpoint as before. Labels are always visible, inputs are 52 px
   with a text-muted border (≥3:1) and a 2 px green focus ring. Errors are
   inline, linked with aria-describedby and aria-invalid, and focus moves to the
   first invalid field. Package options come from the live packages.
   Success: the orbit ring draws, focus moves to the success heading, and a
   WhatsApp button carries the message on. No reply time is promised. */
import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api.js'
import { useWaLink } from '../lib/whatsapp.js'
import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'

const initial = { name: '', phone: '', email: '', package: '', prefer: 'whatsapp', message: '', website: '' }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(f) {
  const e = {}
  if (!f.name.trim()) e.name = 'Please enter your name.'
  if (!f.phone.trim()) e.phone = 'Please enter a phone number we can reach you on.'
  else if (f.phone.replace(/\D/g, '').length < 7) e.phone = 'This phone number looks too short.'
  if (f.email.trim() && !EMAIL.test(f.email.trim())) e.email = 'Please check the email address.'
  if (!f.message.trim()) e.message = 'Please write a short message.'
  return e
}

function composeText(f) {
  return [
    'Assalamu Alaikum,',
    '',
    `My name is ${f.name}.`,
    `Phone: ${f.phone}`,
    f.email ? `Email: ${f.email}` : null,
    f.package ? `Interested in: ${f.package}` : null,
    `Preferred contact: ${f.prefer}`,
    '',
    f.message,
  ].filter(Boolean).join('\n')
}

function Field({ id, label, hint, error, children }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div className={`kfield${error ? ' kfield--error' : ''}`}>
      <label className="kfield__label" htmlFor={id}>{label}</label>
      {children({ 'aria-describedby': describedBy, 'aria-invalid': error ? 'true' : undefined })}
      {hint && <p className="kfield__hint" id={`${id}-hint`}>{hint}</p>}
      {error && (
        <p className="kfield__error" id={`${id}-error`}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 4.5v4.2M8 11v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default function ContactForm() {
  const { packages } = useSite()
  const wa = useWaLink()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')   // idle | sending | sent | error
  const [sentText, setSentText] = useState('')
  const formRef = useRef(null)
  const successRef = useRef(null)

  const options = [
    ...(packages || []).filter(p => p && p.name).map(p => String(p.name).trim()),
    'Qafila e Shoq',
    'General enquiry',
  ]

  const update = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(({ [field]: _, ...rest }) => rest)
  }

  useEffect(() => {
    if (status === 'sent') successRef.current?.focus()
  }, [status])

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus()
      return
    }
    setStatus('sending')
    const text = composeText(form)
    try {
      await api.post('/api/contact', form)
      setSentText(text)
      setStatus('sent')
      setForm(initial)
    } catch (err) {
      console.warn('[contact] backend send failed:', err.message)
      setSentText(text)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="kform kform--done" role="status">
        <svg className="kform__ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="47" pathLength="360" strokeDasharray="44 21 272 23" strokeDashoffset="-13" transform="rotate(-90 50 50)" />
          <path d="M33 51l11 11 23-25" />
        </svg>
        <h2 className="kform__done-title" tabIndex={-1} ref={successRef}>JazakAllah Khair.</h2>
        <p className="kform__done-text">Our Lahore office will reply on your preferred channel.</p>
        <div className="kform__done-actions">
          <a className="k-btn k-btn--wa" href={wa('general', sentText)} target="_blank" rel="noopener">
            <Icon name="whatsapp" className="k-ico" /> Continue on WhatsApp
          </a>
          <button className="k-link" type="button" onClick={() => setStatus('idle')}>Send another message</button>
        </div>
      </div>
    )
  }

  return (
    <form className="kform" noValidate onSubmit={onSubmit} ref={formRef} aria-labelledby="kform-title">
      <h2 className="kform__title" id="kform-title">Send us a message</h2>
      <p className="kform__lead">Fields marked * are required.</p>

      {/* Honeypot: bots fill this; people never see it. */}
      <input className="kform__hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={update('website')} />

      <div className="kform__row">
        <Field id="c-name" label="Full name *" error={errors.name}>
          {(a) => <input className="kfield__input" id="c-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={update('name')} {...a} />}
        </Field>
        <Field id="c-phone" label="Phone *" hint="Include country code if outside Pakistan, e.g. +971…" error={errors.phone}>
          {(a) => <input className="kfield__input" id="c-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={form.phone} onChange={update('phone')} {...a} />}
        </Field>
      </div>
      <div className="kform__row">
        <Field id="c-email" label="Email" error={errors.email}>
          {(a) => <input className="kfield__input" id="c-email" name="email" type="email" autoComplete="email" value={form.email} onChange={update('email')} {...a} />}
        </Field>
        <Field id="c-prefer" label="Preferred contact">
          {(a) => (
            <select className="kfield__input kfield__select" id="c-prefer" name="prefer" value={form.prefer} onChange={update('prefer')} {...a}>
              <option value="whatsapp">WhatsApp</option>
              <option value="call">Phone call</option>
              <option value="email">Email</option>
            </select>
          )}
        </Field>
      </div>
      <Field id="c-package" label="Package interest">
        {(a) => (
          <select className="kfield__input kfield__select" id="c-package" name="package" value={form.package} onChange={update('package')} {...a}>
            <option value="">Select a package</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
      </Field>
      <Field id="c-message" label="Message *" error={errors.message}>
        {(a) => <textarea className="kfield__input kfield__textarea" id="c-message" name="message" rows={5} required value={form.message} onChange={update('message')} {...a} />}
      </Field>

      <button type="submit" className="k-btn k-btn--primary k-btn--lg kform__submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>

      <div aria-live="polite">
        {status === 'error' && (
          <div className="kform__fail">
            <p>We could not save your message just now. Please send it on WhatsApp instead; your details are already filled in.</p>
            <a className="k-btn k-btn--wa" href={wa('general', sentText)} target="_blank" rel="noopener">
              <Icon name="whatsapp" className="k-ico" /> Send on WhatsApp
            </a>
          </div>
        )}
      </div>
      <p className="kform__fine">Your message goes to our office inbox. We use your details only to reply to you.</p>
    </form>
  )
}
