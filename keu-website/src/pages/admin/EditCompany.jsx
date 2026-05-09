import { useEffect, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { api } from '../../lib/api.js'

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
        <Input label="WhatsApp (digits, e.g. 923334883578)" value={c.whatsapp} onChange={set('whatsapp')} />
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
