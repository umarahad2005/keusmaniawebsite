import { useEffect, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { api } from '../../lib/api.js'

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
              </div>
            </div>
            <div className="cluster">
              <button className="btn btn--ghost btn--sm" onClick={() => setEditing({ ...p })}>Edit</button>
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
  const set = (k) => (e) => setP({ ...p, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value })
  const setIncl = (i) => (e) => setP({ ...p, inclusions: p.inclusions.map((x, idx) => idx === i ? e.target.value : x) })
  const addIncl = () => setP({ ...p, inclusions: [...p.inclusions, ''] })
  const removeIncl = (i) => setP({ ...p, inclusions: p.inclusions.filter((_, idx) => idx !== i) })

  return (
    <div className="modal-overlay" data-open="true">
      <div className="modal" style={{ maxWidth: 720, maxHeight: '92vh', overflow: 'auto' }}>
        <button className="modal__close" type="button" onClick={onCancel}>×</button>
        <h2>{pkg.id ? 'Edit package' : 'New package'}</h2>

        <div className="grid mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          <Field label="ID (slug)" value={p.id} onChange={set('id')} hint="e.g. premium-umrah" />
          <Field label="Name"      value={p.name}      onChange={set('name')} />
          <Field label="Subtitle"  value={p.subtitle}  onChange={set('subtitle')} />
          <Field label="Summary"   value={p.summary}   onChange={set('summary')} />
          <Field label="Price label" value={p.priceLabel} onChange={set('priceLabel')} hint="e.g. PKR 285,000" />
          <Field label="Price (number)" type="number" value={p.price ?? ''} onChange={set('price')} />
          <Field label="Nights"   type="number" value={p.nights ?? ''} onChange={set('nights')} />
          <Field label="Badge"    value={p.badge ?? ''} onChange={set('badge')} hint="empty for none" />
          <Select label="Category" value={p.category} onChange={set('category')} options={['umrah','hajj','ramadan_umrah','family']} />
          <Select label="Tier"     value={p.tier}     onChange={set('tier')}     options={['economy','premium','vip']} />
        </div>

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

        <div className="cluster mt-8" style={{ justifyContent: 'flex-end' }}>
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
