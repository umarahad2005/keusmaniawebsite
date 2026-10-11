/* Admin: video reviews from pilgrims.
   Videos upload straight to Cloudinary (folder keu/reviews); the list is saved
   into the site content as `videoReviews`, like the written testimonials.
   A review is only shown on the website when "Show on website" is on AND the
   pilgrim's consent is recorded. */
import { useEffect, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { api } from '../../lib/api.js'
import CloudinaryUpload from '../../components/admin/CloudinaryUpload.jsx'
import { reviewPosterUrl, formatDuration } from '../../lib/videos.js'

const LANGS = [
  { value: 'ur', label: 'Urdu' },
  { value: 'pa', label: 'Punjabi' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'other', label: 'Other' },
]

const fromUpload = (url, data) => ({
  id: data.public_id,
  publicId: data.public_id,
  src: url,
  duration: data.duration || 0,
  width: data.width || 0,
  height: data.height || 0,
  name: '',
  location: '',
  trip: '',
  caption: '',
  language: 'ur',
  consent: false,
  show: false,
  uploadedAt: new Date().toISOString(),
})

export default function EditVideoReviews() {
  const { site, reload } = useSite()
  const [list, setList] = useState(site.videoReviews || [])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => { setList(site.videoReviews || []) }, [site.videoReviews])

  const save = async () => {
    setBusy(true); setMsg(null)
    try {
      // A review without consent is never shown, whatever the switch says.
      const clean = list.map(v => ({ ...v, show: Boolean(v.show && v.consent) }))
      await api.put('/api/content', { type: 'site', data: { ...site, videoReviews: clean } })
      setMsg('Saved'); await reload()
      setTimeout(() => setMsg(null), 2000)
    } catch (e) { setMsg('Failed: ' + e.message) } finally { setBusy(false) }
  }

  const set = (i, key) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setList(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: v } : r))
  }
  const move = (i, d) => setList(prev => {
    const j = i + d
    if (j < 0 || j >= prev.length) return prev
    const next = [...prev]
    ;[next[i], next[j]] = [next[j], next[i]]
    return next
  })
  const remove = (i) => setList(prev => prev.filter((_, idx) => idx !== i))
  const onUpload = (url, data) => setList(prev => [fromUpload(url, data), ...prev])

  const shown = list.filter(v => v.show && v.consent).length

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Video reviews</h1>
        <div className="cluster">
          <CloudinaryUpload resourceType="video" folder="keu/reviews" label="+ Upload video" onUpload={onUpload} />
          <button className="btn btn--primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      </header>
      <p className="muted" style={{ maxWidth: '70ch' }}>
        Upload phone videos of pilgrims sharing their experience. Only upload a video when the pilgrim has agreed
        to it being shown on the website. After uploading, add their name and a short caption, tick consent and
        switch on "Show on website", then save. Cloudinary prepares a smaller copy in the background, so a new
        video can take a minute or two before it plays smoothly. {list.length} uploaded · {shown} shown.
      </p>
      {msg && <p className="muted" role="status">{msg}</p>}

      <div className="stack">
        {list.length === 0 && <p className="muted">No video reviews yet. Use “Upload video” to add the first one.</p>}
        {list.map((v, i) => (
          <article key={v.id || i} className="card" style={{ padding: 'var(--space-6)', display: 'grid', gridTemplateColumns: 'minmax(0, 240px) minmax(0, 1fr)', gap: 'var(--space-6)' }}>
            <div>
              <video
                src={v.src}
                poster={reviewPosterUrl(v.publicId)}
                controls
                preload="metadata"
                playsInline
                style={{ width: '100%', borderRadius: 4, background: '#000', aspectRatio: v.width && v.height ? `${v.width} / ${v.height}` : '9 / 16', maxHeight: 360 }}
              />
              <p className="muted" style={{ fontSize: 'var(--text-xs)', marginTop: 6 }}>
                {formatDuration(v.duration)}{v.width ? ` · ${v.width}×${v.height}` : ''}
              </p>
            </div>
            <div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                <Field label="Pilgrim's name" value={v.name} onChange={set(i, 'name')} />
                <Field label="City" value={v.location} onChange={set(i, 'location')} />
                <Field label="Trip (e.g. Premium Umrah · 2026)" value={v.trip} onChange={set(i, 'trip')} />
                <label className="field">
                  <span className="field__label">Spoken language</span>
                  <select className="field__input" value={v.language || 'ur'} onChange={set(i, 'language')}>
                    {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </label>
              </div>
              <Field label="Short caption shown under the video (one sentence, in English)" textarea value={v.caption} onChange={set(i, 'caption')} />
              <div className="cluster" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                <div className="cluster" style={{ gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                    <input type="checkbox" checked={Boolean(v.consent)} onChange={set(i, 'consent')} />
                    <span>The pilgrim agreed to this video being shown</span>
                  </label>
                  <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center', opacity: v.consent ? 1 : 0.5 }}>
                    <input type="checkbox" checked={Boolean(v.show && v.consent)} disabled={!v.consent} onChange={set(i, 'show')} />
                    <span>Show on website</span>
                  </label>
                </div>
                <div className="cluster" style={{ gap: 'var(--space-2)' }}>
                  <button className="btn btn--ghost btn--sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                  <button className="btn btn--ghost btn--sm" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Move down">↓</button>
                  <button className="btn btn--ghost btn--sm"
                          style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                          onClick={() => remove(i)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, textarea }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {textarea
        ? <textarea className="field__textarea" rows={2} value={value ?? ''} onChange={onChange} />
        : <input className="field__input" type="text" value={value ?? ''} onChange={onChange} />}
    </label>
  )
}
