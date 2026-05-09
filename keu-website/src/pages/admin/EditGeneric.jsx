/* Generic JSON editor for content types we don't have a dedicated form for yet
   (sanctuaries, whyChooseUs). Lets you edit the raw JSON safely with parse-check. */
import { useEffect, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { api } from '../../lib/api.js'

export default function EditGeneric({ type, title }) {
  const { site, reload } = useSite()
  const [json, setJson] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    setJson(JSON.stringify(site[type] ?? null, null, 2))
  }, [site, type])

  const save = async () => {
    let parsed
    try { parsed = JSON.parse(json) }
    catch (e) { setMsg('Invalid JSON: ' + e.message); return }

    setBusy(true); setMsg(null)
    try {
      await api.put('/api/content', { type: 'site', data: { ...site, [type]: parsed } })
      setMsg('Saved'); await reload()
      setTimeout(() => setMsg(null), 2000)
    } catch (e) { setMsg('Failed: ' + e.message) } finally { setBusy(false) }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>{title}</h1>
        <button className="btn btn--primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </header>
      <p className="muted">Edit the JSON below, then save. Keep the structure intact.</p>
      {msg && <p className="muted">{msg}</p>}
      <textarea
        className="field__textarea"
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={26}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6 }}
      />
    </div>
  )
}
