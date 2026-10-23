import { useEffect, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { api } from '../../lib/api.js'
import { teamFooterNumbers } from '../../lib/footerNumbers.js'
import { DEFAULT_LANDLINE } from '../../lib/phone.js'

export default function EditCompany() {
  const { site, reload } = useSite()
  const [c, setC] = useState(site.company)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => { setC(site.company) }, [site.company])

  const set = (path) => (e) => {
    const value = e.target.value
    setC(prev => {
      const next = { ...prev }
      const keys = path.split('.')
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] }
        cur = cur[keys[i]]
      }
      cur[keys[keys.length - 1]] = value
      return next
    })
  }

  const setSocial = (i, field) => (e) => {
    const value = e.target.value
    setC(prev => {
      const socials = prev.socials.map((s, idx) => idx === i ? { ...s, [field]: value } : s)
      return { ...prev, socials }
    })
  }

  /* Footer contact numbers: until saved, the footer builds them from the team
     list, so the editor starts from that same list. */
  const numbers = Array.isArray(c.footerNumbers) ? c.footerNumbers : teamFooterNumbers({ ...site, company: c })
  const setNumbers = (next) => setC(prev => ({ ...prev, footerNumbers: next }))
  const setNumber = (i, field) => (e) => setNumbers(numbers.map((n, idx) => idx === i ? { ...n, [field]: e.target.value } : n))
  const moveNumber = (i, to) => {
    if (to < 0 || to >= numbers.length) return
    const next = [...numbers]; const [n] = next.splice(i, 1); next.splice(to, 0, n); setNumbers(next)
  }

  const save = async () => {
    setBusy(true)
    setMsg(null)
    try {
      await api.put('/api/content', { type: 'site', data: { ...site, company: c } })
      setMsg('Saved')
      await reload()
      setTimeout(() => setMsg(null), 2000)
    } catch (e) {
      setMsg('Failed: ' + e.message)
    } finally { setBusy(false) }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Company</h1>
        <button className="btn btn--primary" onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </header>
      {msg && <p className="muted">{msg}</p>}

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <Input label="Company name"     value={c.name}     onChange={set('name')} />
        <Input label="Tagline"          value={c.tagline}  onChange={set('tagline')} />
        <Input label="Phone"            value={c.phone}    onChange={set('phone')} />
        <Input label="Office landline (footer)" value={c.landline ?? DEFAULT_LANDLINE} onChange={set('landline')} />
        <Input label="WhatsApp (digits, e.g. 923314950665)" value={c.whatsapp} onChange={set('whatsapp')} />
        <Input label="Email"            value={c.email}    onChange={set('email')} />
        <Input label="Founded year"     type="number"      value={c.founded}  onChange={set('founded')} />
      </div>

      <h3 className="mt-12">Address</h3>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <Input label="Street"      value={c.address.street}     onChange={set('address.street')} />
        <Input label="City"        value={c.address.city}       onChange={set('address.city')} />
        <Input label="Country"     value={c.address.country}    onChange={set('address.country')} />
        <Input label="Postal code" value={c.address.postalCode} onChange={set('address.postalCode')} />
      </div>

      <h3 className="mt-12">Footer contact numbers</h3>
      <p className="muted" style={{ fontSize: 'var(--text-sm)' }}>
        Shown in the footer under the landline and the WhatsApp number above, in this order. Each opens WhatsApp.
        Use a phone number with the country code, e.g. +92 331 4950665; the name is optional.
        {!Array.isArray(c.footerNumbers) && ' These come from the team list until you save them here.'}
      </p>
      <div className="stack" style={{ '--stack-gap': '0.5rem' }}>
        {numbers.map((n, i) => (
          <div key={i} className="grid" style={{ gridTemplateColumns: 'minmax(160px, 1fr) minmax(120px, 1fr) auto', gap: 'var(--space-3)', alignItems: 'end' }}>
            <Input label="Number" value={n.number} onChange={setNumber(i, 'number')} />
            <Input label="Name"   value={n.name}   onChange={setNumber(i, 'name')} />
            <div className="cluster" style={{ gap: 'var(--space-1)' }}>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => moveNumber(i, i - 1)} disabled={i === 0} aria-label="Move up" title="Move up">↑</button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => moveNumber(i, i + 1)} disabled={i === numbers.length - 1} aria-label="Move down" title="Move down">↓</button>
              <button type="button" className="btn btn--ghost btn--sm" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                      onClick={() => setNumbers(numbers.filter((_, idx) => idx !== i))} aria-label="Remove" title="Remove">×</button>
            </div>
          </div>
        ))}
        <div className="cluster">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setNumbers([...numbers, { number: '', name: '' }])}>+ Add number</button>
          {Array.isArray(c.footerNumbers) && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setNumbers(teamFooterNumbers({ ...site, company: c }))}>Reset to the team list</button>
          )}
        </div>
        <p className="field__hint">Click <strong>Save changes</strong> at the top to publish.</p>
      </div>

      <h3 className="mt-12">Socials</h3>
      <div className="stack">
        {c.socials.map((s, i) => (
          <div key={i} className="grid" style={{ gridTemplateColumns: '120px 1fr 1fr', gap: 'var(--space-3)' }}>
            <Input label="Name"     value={s.name} onChange={setSocial(i, 'name')} />
            <Input label="URL"      value={s.url}  onChange={setSocial(i, 'url')} />
            <Input label="Icon key" value={s.icon} onChange={setSocial(i, 'icon')} />
          </div>
        ))}
      </div>
    </div>
  )
}

function Input({ label, type = 'text', value, onChange }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input className="field__input" type={type} value={value ?? ''} onChange={onChange} />
    </label>
  )
}
