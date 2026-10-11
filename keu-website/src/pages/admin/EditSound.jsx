/* Admin: background sound. One track, uploaded to Cloudinary (folder
   keu/sound) and saved into the site content as `ambience`. On the website it
   never plays by itself: visitors switch it on with the sound button in the
   menu bar (browsers block sound until a visitor taps, and a visible on/off
   control is an accessibility requirement). */
import { useEffect, useRef, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { api } from '../../lib/api.js'
import CloudinaryUpload from '../../components/admin/CloudinaryUpload.jsx'

const EMPTY = { enabled: false, src: '', publicId: '', title: '', credit: '', volume: 0.35, duration: 0 }

export default function EditSound() {
  const { site, reload } = useSite()
  const [a, setA] = useState({ ...EMPTY, ...(site.ambience || {}) })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const preview = useRef(null)

  useEffect(() => { setA({ ...EMPTY, ...(site.ambience || {}) }) }, [site.ambience])
  useEffect(() => { if (preview.current) preview.current.volume = Number(a.volume) || 0.35 }, [a.volume, a.src])

  const set = (key) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'range' ? Number(e.target.value) : e.target.value
    setA(prev => ({ ...prev, [key]: v }))
  }

  const onUpload = (url, data) => setA(prev => ({
    ...prev,
    src: url,
    publicId: data.public_id,
    duration: data.duration || 0,
    title: prev.title || (data.original_filename || '').replace(/[-_]+/g, ' '),
  }))

  const save = async () => {
    setBusy(true); setMsg(null)
    try {
      const ambience = { ...a, enabled: Boolean(a.enabled && a.src) }
      await api.put('/api/content', { type: 'site', data: { ...site, ambience } })
      setMsg('Saved'); await reload()
      setTimeout(() => setMsg(null), 2000)
    } catch (e) { setMsg('Failed: ' + e.message) } finally { setBusy(false) }
  }

  const removeTrack = () => setA(prev => ({ ...prev, src: '', publicId: '', duration: 0, enabled: false }))

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Background sound</h1>
        <div className="cluster">
          <CloudinaryUpload resourceType="audio" folder="keu/sound" label={a.src ? 'Replace sound' : '+ Upload sound'} onUpload={onUpload} />
          <button className="btn btn--primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      </header>
      <p className="muted" style={{ maxWidth: '70ch' }}>
        Upload one calm track (MP3, ideally 2–5 minutes and under 5 MB; it loops). Visitors hear it only after they
        press the sound button in the menu bar, and it pauses on its own while a video review is playing or the tab is
        hidden. Use only audio you have the right to publish. For a pilgrimage audience, an instrument-free nasheed or
        a recording of the Haram's ambience is the safest choice.
      </p>
      {msg && <p className="muted" role="status">{msg}</p>}

      <article className="card" style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)', maxWidth: 720 }}>
        {a.src
          ? <audio ref={preview} src={a.src} controls preload="metadata" style={{ width: '100%' }} />
          : <p className="muted">No sound uploaded yet.</p>}
        <label className="field">
          <span className="field__label">Track title (shown to visitors on the sound button)</span>
          <input className="field__input" type="text" value={a.title} onChange={set('title')} />
        </label>
        <label className="field">
          <span className="field__label">Credit or licence (optional, shown as a tooltip)</span>
          <input className="field__input" type="text" value={a.credit} onChange={set('credit')} placeholder="e.g. Recorded at Masjid al-Haram by …" />
        </label>
        <label className="field">
          <span className="field__label">Volume on the website: {Math.round((Number(a.volume) || 0) * 100)}%</span>
          <input type="range" min="0.1" max="0.8" step="0.05" value={a.volume} onChange={set('volume')} />
        </label>
        <div className="cluster" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center', opacity: a.src ? 1 : 0.5 }}>
            <input type="checkbox" checked={Boolean(a.enabled && a.src)} disabled={!a.src} onChange={set('enabled')} />
            <span>Show the sound button on the website</span>
          </label>
          {a.src && (
            <button className="btn btn--ghost btn--sm" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }} onClick={removeTrack}>
              Remove sound
            </button>
          )}
        </div>
      </article>
    </div>
  )
}
