import { useEffect, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { api } from '../../lib/api.js'
import CloudinaryUpload from '../../components/admin/CloudinaryUpload.jsx'
import Img from '../../components/Img.jsx'

const blank = () => ({ name: '', role: '', photo: '' })

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

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        {list.map((m, i) => (
          <article key={i} className="card">
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
