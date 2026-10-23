import { useEffect, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { api } from '../../lib/api.js'
import PackageCard from '../../components/PackageCard.jsx'

const blank = () => ({
  id: '',
  name: '',
  category: 'umrah',
  tier: 'premium',
  icon: '🕋',
  price: 0,
  priceLabel: '',
  perPerson: true,
  nights: 14,
  subtitle: '',
  summary: '',
  badge: '',
  featured: false,
  soldOut: false,
  inclusions: [''],
  waMessage: '',
})

export default function EditPackages() {
  const { packages, reload } = useSite()
  const [list, setList] = useState(packages)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => { setList(packages) }, [packages])

  const save = async () => {
    setBusy(true); setMsg(null)
    try {
      await api.put('/api/content', { type: 'packages', data: list })
      setMsg('Saved')
      await reload()
      setTimeout(() => setMsg(null), 2000)
    } catch (e) {
      setMsg('Failed: ' + e.message)
    } finally { setBusy(false) }
  }

  const upsert = (pkg) => {
    setList(prev => {
      const idx = prev.findIndex(p => p.id === pkg.id)
      if (idx === -1) return [...prev, pkg]
      return prev.map((p, i) => i === idx ? pkg : p)
    })
    setEditing(null)
  }

  /* Sold out keeps the package on /packages with a stamp and takes it off the
     home page. Like Edit and Delete, it goes live on "Save changes". */
  const toggleSoldOut = (id) => {
    const pkg = list.find(p => p.id === id)
    setList(prev => prev.map(p => p.id === id ? { ...p, soldOut: !p.soldOut } : p))
    setMsg(`${pkg?.name || 'Package'} marked ${pkg?.soldOut ? 'available' : 'sold out'} — click Save changes to publish`)
  }

  const remove = (id) => {
    if (!confirm('Delete this package?')) return
    setList(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Packages</h1>
        <div className="cluster">
          <button className="btn btn--ghost" onClick={() => setEditing(blank())}>+ Add package</button>
          <button className="btn btn--primary" onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>
      {msg && <p className="muted">{msg}</p>}

      <div className="stack">
        {list.map(p => (
          <article key={p.id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-4)', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)' }}>{p.name}</div>
              <div className="muted" style={{ fontSize: 'var(--text-sm)' }}>
                {p.category} · {p.tier} · {p.priceLabel}
                {p.badge && ` · ${p.badge}`}
                {p.featured && !p.soldOut && ' · ★ featured on home'}
                {p.soldOut && <strong style={{ color: 'var(--error)' }}> · Sold out{p.featured ? ' (hidden from home)' : ''}</strong>}
              </div>
            </div>
            <div className="cluster">
              <button className="btn btn--ghost btn--sm" onClick={() => setEditing({ ...p })}>Edit</button>
              <button className="btn btn--ghost btn--sm" aria-pressed={!!p.soldOut} onClick={() => toggleSoldOut(p.id)}>
                {p.soldOut ? 'Mark available' : 'Mark sold out'}
              </button>
              <button className="btn btn--ghost btn--sm" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }} onClick={() => remove(p.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      {editing && <PackageEditor pkg={editing} onSave={upsert} onCancel={() => setEditing(null)} />}
    </div>
  )
}

function PackageEditor({ pkg, onSave, onCancel }) {
  const [p, setP] = useState(pkg)

  /* Lock the page behind the dialog and wire up Escape — without this the admin
     list scrolls under the modal whenever the form pane runs out of scroll. */
  useEffect(() => {
    document.body.classList.add('no-scroll')
    const onKey = (e) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      document.removeEventListener('keydown', onKey)
    }
  }, [onCancel])

  const set = (k) => (e) => setP({ ...p, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value })
  const setIncl = (i) => (e) => setP({ ...p, inclusions: p.inclusions.map((x, idx) => idx === i ? e.target.value : x) })
  const addIncl = () => setP({ ...p, inclusions: [...p.inclusions, ''] })
  const removeIncl = (i) => setP({ ...p, inclusions: p.inclusions.filter((_, idx) => idx !== i) })

  /* Placeholders keep the preview card readable while fields are still empty,
     so a new package never renders as a blank box. */
  const previewPkg = {
    ...p,
    name:       p.name       || 'Package name',
    subtitle:   p.subtitle   || 'Package subtitle',
    priceLabel: p.priceLabel || 'PKR —',
    summary:    p.summary    || 'A short summary of what this package covers appears here.',
    inclusions: p.inclusions.filter(Boolean).length ? p.inclusions : ['Add your inclusions'],
  }

  return (
    <div className="modal-overlay" data-open="true">
      <div className="modal pkg-editor">
        <button className="modal__close" type="button" onClick={onCancel}>×</button>
        <h2 className="pkg-editor__title">{pkg.id ? 'Edit package' : 'New package'}</h2>

        <div className="pkg-editor__body">
          <div className="pkg-editor__form">
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
              <Field label="ID (slug)" value={p.id} onChange={set('id')} hint="e.g. premium-umrah" />
              <Field label="Name"      value={p.name}      onChange={set('name')} />
              <Field label="Subtitle"  value={p.subtitle}  onChange={set('subtitle')} />
              <Field label="Price label" value={p.priceLabel} onChange={set('priceLabel')} hint="e.g. PKR 285,000" />
              <Field label="Price (number)" type="number" value={p.price ?? ''} onChange={set('price')} />
              <Field label="Nights"   type="number" value={p.nights ?? ''} onChange={set('nights')} />
              <Field label="Badge"    value={p.badge ?? ''} onChange={set('badge')} hint="empty for none" />
              <Select label="Category" value={p.category} onChange={set('category')} options={['umrah','hajj','ramadan_umrah','family']} />
              <Select label="Tier"     value={p.tier}     onChange={set('tier')}     options={['economy','premium','vip']} />
            </div>

            <Field label="Summary" value={p.summary} onChange={set('summary')} textarea
                   hint="Shown as the paragraph on the card — keep it to 2–3 lines." />

            <label className="cluster" style={{ gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!p.featured}
                onChange={(e) => setP({ ...p, featured: e.target.checked })}
              />
              <span>
                <strong>Feature on the home page</strong>
                <span className="field__hint" style={{ display: 'block' }}>
                  Home shows up to 3 featured packages. If none are ticked it falls back to the first 3.
                </span>
              </span>
            </label>

            <label className="cluster" style={{ gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!p.soldOut}
                onChange={(e) => setP({ ...p, soldOut: e.target.checked })}
              />
              <span>
                <strong>Sold out</strong>
                <span className="field__hint" style={{ display: 'block' }}>
                  Stays on the Packages page with a Sold out stamp and is left off the home page.
                </span>
              </span>
            </label>

            <h3 className="mt-8">Inclusions</h3>
            <div className="stack" style={{ '--stack-gap': '0.5rem' }}>
              {p.inclusions.map((line, i) => (
                <div key={i} className="cluster">
                  <input className="field__input" value={line} onChange={setIncl(i)} style={{ flex: 1 }} />
                  <button className="btn btn--ghost btn--sm" onClick={() => removeIncl(i)}>×</button>
                </div>
              ))}
              <button className="btn btn--ghost btn--sm" onClick={addIncl}>+ Add line</button>
            </div>

            <Field label="WhatsApp pre-filled message" value={p.waMessage} onChange={set('waMessage')} textarea />
          </div>

          {/* Live preview — the same PackageCard the public site renders, so what
              you see here is exactly what visitors get. */}
          <aside className="pkg-editor__preview">
            <span className="field__label">Live preview</span>
            <div className="pkg-editor__preview-stage">
              <PackageCard pkg={previewPkg} />
            </div>
            <p className="field__hint">Updates as you type. Card width matches the live site.</p>
          </aside>
        </div>

        <div className="pkg-editor__footer">
          <button className="btn btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn--primary" onClick={() => onSave(p)} disabled={!p.id || !p.name}>Save</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, hint, type = 'text', textarea = false }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {textarea
        ? <textarea className="field__textarea" rows={3} value={value ?? ''} onChange={onChange} />
        : <input className="field__input" type={type} value={value ?? ''} onChange={onChange} />}
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <select className="field__select" value={value} onChange={onChange}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}
