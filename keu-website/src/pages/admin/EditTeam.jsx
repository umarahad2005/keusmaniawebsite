import { useEffect, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { api } from '../../lib/api.js'
import CloudinaryUpload from '../../components/admin/CloudinaryUpload.jsx'
import Img from '../../components/Img.jsx'
import { memberPath } from '../../lib/team.js'

const blank = () => ({ name: '', role: '', photo: '', nameAr: '', roleAr: '', phone: '', whatsapp: '', email: '', bio: '', slug: '', linkedin: '', facebook: '', instagram: '' })

/* Digital card fields (all optional). Empty fields are hidden on the card. */
const CARD_FIELDS = [
  ['nameAr', 'Name in Urdu/Arabic (as on the printed card)', 'text'],
  ['roleAr', 'Designation in Arabic (as on the printed card)', 'text'],
  ['phone', 'Mobile (e.g. +92 300 1234567)', 'tel'],
  ['whatsapp', 'WhatsApp, if different from mobile', 'tel'],
  ['email', 'Email', 'email'],
  ['linkedin', 'LinkedIn link', 'url'],
  ['facebook', 'Facebook link', 'url'],
  ['instagram', 'Instagram link', 'url'],
  ['slug', 'Card address (optional, e.g. burhan-usmani)', 'text'],
]

export default function EditTeam() {
  const { site, reload } = useSite()
  const [list, setList] = useState(site.team || [])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => { setList(site.team || []) }, [site.team])

  const save = async () => {
    setBusy(true); setMsg(null)
    try {
      await api.put('/api/content', { type: 'site', data: { ...site, team: list } })
      setMsg('Saved'); await reload()
      setTimeout(() => setMsg(null), 2000)
    } catch (e) { setMsg('Failed: ' + e.message) } finally { setBusy(false) }
  }

  const update = (i, key) => (e) => setList(prev => prev.map((m, idx) => idx === i ? { ...m, [key]: e.target.value } : m))
  const setPhoto = (i) => (url) => setList(prev => prev.map((m, idx) => idx === i ? { ...m, photo: url } : m))

  /* Display order is just array order — TeamGrid renders site.team as-is — so
     moving a member is a splice-out / splice-in rather than a stored rank. */
  const moveTo = (from, to) => {
    if (to < 0 || to >= list.length || to === from) return
    setList(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Team</h1>
        <div className="cluster">
          <button className="btn btn--ghost" onClick={() => setList([...list, blank()])}>+ Add member</button>
          <button className="btn btn--primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      </header>
      {msg && <p className="muted">{msg}</p>}
      <p className="muted">
        Position 1 appears first on the About page. Change a member’s position and
        the others shuffle around them — then hit Save changes. Visitors who click a
        member see their digital card: fill in the card details under each member
        (anything left empty is simply not shown).
      </p>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        {list.map((m, i) => (
          <article key={i} className="card">
            <div className="admin-order">
              <label className="admin-order__pick">
                <span className="field__label">Position</span>
                <select
                  className="field__select"
                  value={i}
                  onChange={(e) => moveTo(i, Number(e.target.value))}
                  aria-label={`Position of ${m.name || 'this member'}`}
                >
                  {list.map((_, idx) => <option key={idx} value={idx}>{idx + 1}</option>)}
                </select>
              </label>
              <div className="cluster" style={{ gap: 'var(--space-1)' }}>
                <button
                  className="btn btn--ghost btn--sm" type="button"
                  onClick={() => moveTo(i, i - 1)} disabled={i === 0}
                  aria-label="Move earlier" title="Move earlier"
                >↑</button>
                <button
                  className="btn btn--ghost btn--sm" type="button"
                  onClick={() => moveTo(i, i + 1)} disabled={i === list.length - 1}
                  aria-label="Move later" title="Move later"
                >↓</button>
              </div>
            </div>

            <div className="team-card__photo" style={{ marginBottom: 'var(--space-3)' }}>
              {m.photo
                ? <Img src={m.photo} alt={m.name} w={200} h={200} />
                : <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--color-text-muted)' }}>No photo</div>}
            </div>
            <CloudinaryUpload folder="keu/team" label={m.photo ? 'Replace photo' : 'Upload photo'} onUpload={setPhoto(i)} />
            <label className="field mt-4">
              <span className="field__label">Name</span>
              <input className="field__input" value={m.name} onChange={update(i, 'name')} />
            </label>
            <label className="field">
              <span className="field__label">Role</span>
              <input className="field__input" value={m.role} onChange={update(i, 'role')} />
            </label>
            <details className="mt-2">
              <summary className="field__label" style={{ cursor: 'pointer' }}>Digital card details</summary>
              {CARD_FIELDS.map(([key, label, type]) => (
                <label className="field" key={key}>
                  <span className="field__label">{label}</span>
                  <input className="field__input" type={type} value={m[key] || ''} onChange={update(i, key)} />
                </label>
              ))}
              <label className="field">
                <span className="field__label">Short bio (one or two sentences)</span>
                <textarea className="field__textarea" rows={3} value={m.bio || ''} onChange={update(i, 'bio')} />
              </label>
              {m.name && <p className="muted" style={{ fontSize: 'var(--text-xs)' }}>Card page: <a href={memberPath(m)} target="_blank" rel="noopener">{memberPath(m)}</a> (after saving)</p>}
            </details>
            <button
              className="btn btn--ghost btn--sm mt-2"
              style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
              onClick={() => setList(list.filter((_, idx) => idx !== i))}
            >Delete</button>
          </article>
        ))}
      </div>
    </div>
  )
}
