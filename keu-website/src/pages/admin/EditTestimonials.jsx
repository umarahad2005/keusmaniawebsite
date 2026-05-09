import { useEffect, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { api } from '../../lib/api.js'

const blank = () => ({ quote: '', name: '', location: '', trip: '', rating: 5, initials: '' })

export default function EditTestimonials() {
  const { site, reload } = useSite()
  const [list, setList] = useState(site.testimonials)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => { setList(site.testimonials) }, [site.testimonials])

  const save = async () => {
    setBusy(true); setMsg(null)
    try {
      await api.put('/api/content', { type: 'site', data: { ...site, testimonials: list } })
      setMsg('Saved'); await reload()
      setTimeout(() => setMsg(null), 2000)
    } catch (e) { setMsg('Failed: ' + e.message) } finally { setBusy(false) }
  }

  const update = (i, key) => (e) => {
    const v = key === 'rating' ? Number(e.target.value) : e.target.value
    setList(prev => prev.map((t, idx) => idx === i ? { ...t, [key]: v } : t))
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Testimonials</h1>
        <div className="cluster">
          <button className="btn btn--ghost" onClick={() => setList([...list, blank()])}>+ Add</button>
          <button className="btn btn--primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      </header>
      {msg && <p className="muted">{msg}</p>}

      <div className="stack">
        {list.map((t, i) => (
          <article key={i} className="card" style={{ padding: 'var(--space-6)' }}>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
              <Field label="Name"     value={t.name}     onChange={update(i, 'name')} />
              <Field label="Initials (e.g. MH)" value={t.initials} onChange={update(i, 'initials')} />
              <Field label="Location" value={t.location} onChange={update(i, 'location')} />
              <Field label="Trip"     value={t.trip}     onChange={update(i, 'trip')} />
              <Field label="Rating (1-5)" type="number" value={t.rating} onChange={update(i, 'rating')} />
            </div>
            <Field label="Quote" textarea value={t.quote} onChange={update(i, 'quote')} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn--ghost btn--sm"
                      style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                      onClick={() => setList(list.filter((_, idx) => idx !== i))}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', textarea }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {textarea
        ? <textarea className="field__textarea" rows={3} value={value ?? ''} onChange={onChange} />
        : <input className="field__input" type={type} value={value ?? ''} onChange={onChange} />}
    </label>
  )
}
