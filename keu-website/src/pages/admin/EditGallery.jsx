import { useEffect, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { api } from '../../lib/api.js'
import CloudinaryUpload from '../../components/admin/CloudinaryUpload.jsx'

export default function EditGallery() {
  const { site, reload } = useSite()
  const [list, setList] = useState(site.gallery || [])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => { setList(site.gallery || []) }, [site.gallery])

  const save = async () => {
    setBusy(true); setMsg(null)
    try {
      await api.put('/api/content', { type: 'site', data: { ...site, gallery: list } })
      setMsg('Saved'); await reload()
      setTimeout(() => setMsg(null), 2000)
    } catch (e) { setMsg('Failed: ' + e.message) } finally { setBusy(false) }
  }

  const onUpload = (url) => setList(prev => [...prev, { src: url, alt: '', size: '' }])
  const update = (i, key) => (e) => setList(prev => prev.map((g, idx) => idx === i ? { ...g, [key]: e.target.value } : g))

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Gallery</h1>
        <div className="cluster">
          <CloudinaryUpload folder="keu/gallery" label="+ Upload image" onUpload={onUpload} />
          <button className="btn btn--primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      </header>
      {msg && <p className="muted">{msg}</p>}

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        {list.map((g, i) => (
          <article key={i} className="card" style={{ padding: 'var(--space-3)' }}>
            <img src={g.src} alt={g.alt} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
            <label className="field mt-2">
              <span className="field__label">Alt / caption</span>
              <input className="field__input" value={g.alt} onChange={update(i, 'alt')} />
            </label>
            <label className="field">
              <span className="field__label">Size hint (tall / wide / blank)</span>
              <select className="field__select" value={g.size || ''} onChange={update(i, 'size')}>
                <option value="">Default</option>
                <option value="tall">Tall</option>
                <option value="wide">Wide</option>
              </select>
            </label>
            <button
              className="btn btn--ghost btn--sm mt-2"
              style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
              onClick={() => setList(list.filter((_, idx) => idx !== i))}
            >Remove</button>
          </article>
        ))}
      </div>
    </div>
  )
}
