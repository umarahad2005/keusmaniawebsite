/* Admin: the social feed on /updates (api/social).

   Top: the Instagram connection (connected or not, when the token runs out,
   the last sync and its error), a box to paste a new token with short steps,
   Sync now and Disconnect. Then "+ Add post" for a post made by hand (images
   through CloudinaryUpload into keu/social, the text, the day it appears).
   Then every post: hide, pin, alt text per image, delete. Each change is saved
   at once and the site rebuilds in a minute or two (alt text waits for the
   daily sync, api/social/[id].js). */
import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'
import CloudinaryUpload from '../../components/admin/CloudinaryUpload.jsx'
import Img from '../../components/Img.jsx'

const fmt = (d) => d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
const daysLeft = (d) => d ? Math.round((new Date(d) - Date.now()) / 86400000) : null
/* Date → the value a datetime-local input expects, in this browser's time zone. */
const toLocalInput = (d) => {
  const x = new Date(d)
  return new Date(x.getTime() - x.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}
const BLANK = () => ({ images: [], text: '', permalink: '', publishAt: toLocalInput(new Date()) })

export default function EditSocial() {
  const [status, setStatus] = useState(null)
  const [posts, setPosts] = useState([])
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState(null)
  const [token, setToken] = useState('')
  const [draft, setDraft] = useState(null)

  const load = async () => {
    const r = await api.getFresh('/api/social?action=admin')
    setStatus(r.status); setPosts(r.posts || [])
  }
  useEffect(() => { load().catch(e => setMsg('Failed to load: ' + e.message)) }, [])

  const run = async (label, fn, done) => {
    setBusy(label); setMsg(null)
    try {
      const r = await fn()
      if (r?.status) setStatus(r.status)
      await load()
      setMsg(typeof done === 'function' ? done(r) : done)
    } catch (e) { setMsg('Failed: ' + e.message) } finally { setBusy('') }
  }

  const saveToken = (e) => {
    e.preventDefault()
    run('token', () => api.post('/api/social?action=token', { token }), r => { setToken(''); return `Connected to @${r.status.username || 'Instagram'}. Press Sync now to bring in the posts.` })
  }
  const sync = () => run('sync', () => api.post('/api/social?action=sync', {}), r =>
    r.status?.lastError ? `Sync stopped: ${r.status.lastError}`
      : `Sync done: ${r.added} new post${r.added === 1 ? '' : 's'}${r.remaining ? `, ${r.remaining} more waiting (press Sync now again)` : ''}.`)
  const disconnect = () => {
    if (!confirm('Disconnect Instagram? The posts already on the site stay; new ones stop arriving until you paste a new token.')) return
    run('disconnect', () => api.post('/api/social?action=disconnect', {}), 'Disconnected.')
  }

  const patch = (id, data, done = 'Saved') => run(id, () => api.patch(`/api/social/${id}`, data), done)
  const remove = (p) => {
    if (!confirm('Delete this post from the website? (It stays on Instagram.)')) return
    run(p._id, () => api.del(`/api/social/${p._id}`), 'Deleted')
  }
  const setAlt = (id, i) => (e) => setPosts(prev => prev.map(p => p._id === id
    ? { ...p, images: p.images.map((img, n) => n === i ? { ...img, alt: e.target.value } : img) } : p))

  const addPost = (e) => {
    e.preventDefault()
    run('add', () => api.post('/api/social', { ...draft, publishAt: new Date(draft.publishAt).toISOString() }), () => { setDraft(null); return 'Post added' })
  }

  const left = daysLeft(status?.expiresAt)

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Social feed</h1>
        <div className="cluster">
          <a className="btn btn--ghost btn--sm" href="/updates" target="_blank" rel="noopener">View /updates</a>
          <button className="btn btn--primary" onClick={() => setDraft(draft ? null : BLANK())}>{draft ? 'Close' : '+ Add post'}</button>
        </div>
      </header>
      <p className="muted" style={{ maxWidth: '70ch' }}>
        The Updates page shows your Instagram posts, brought in once a day (or when you press Sync now), and any post
        you add here. Contact lines and hashtags are left out of the text on the website. Images are copied to the
        site's own storage, so they keep working if a post is removed from Instagram.
      </p>
      {msg && <p className="muted" role="status">{msg}</p>}

      <article className="card" style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-3)', maxWidth: 820 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Instagram</h2>
        {!status ? <p className="muted">Loading…</p> : (
          <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: 'var(--space-2) var(--space-4)', margin: 0 }}>
            <dt className="muted">Status</dt>
            <dd style={{ margin: 0 }}>{status.connected ? <span className="badge badge--green">Connected{status.username ? ` · @${status.username}` : ''}</span> : <span className="badge badge--outline">Not connected</span>}</dd>
            {status.connected && <>
              <dt className="muted">Token runs out</dt>
              <dd style={{ margin: 0 }}>{fmt(status.expiresAt)}{left != null && ` (about ${left} days)`}. It is renewed by the daily sync.</dd>
            </>}
            <dt className="muted">Last sync</dt>
            <dd style={{ margin: 0 }}>{fmt(status.lastSyncAt)}{status.lastSyncAt && ` · ${status.lastSyncAdded} new`}</dd>
            {status.lastError && <>
              <dt className="muted">Last error</dt>
              <dd style={{ margin: 0, color: 'var(--color-error)' }}>{status.lastError} ({fmt(status.lastErrorAt)})</dd>
            </>}
            {!status.cronSecretSet && <>
              <dt className="muted">Daily sync</dt>
              <dd style={{ margin: 0 }}>Off: CRON_SECRET is not set in Vercel. Sync now still works.</dd>
            </>}
            {!status.deployHookSet && <>
              <dt className="muted">Rebuild</dt>
              <dd style={{ margin: 0 }}>VERCEL_DEPLOY_HOOK_URL is not set, so search engines see new posts only after the next deploy.</dd>
            </>}
          </dl>
        )}
        <div className="cluster">
          <button className="btn btn--primary btn--sm" onClick={sync} disabled={!!busy}>{busy === 'sync' ? 'Syncing…' : 'Sync now'}</button>
          {status?.connected && <button className="btn btn--ghost btn--sm" onClick={disconnect} disabled={!!busy}>Disconnect</button>}
        </div>

        <form onSubmit={saveToken} style={{ display: 'grid', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <label className="field" style={{ margin: 0 }}>
            <span className="field__label">{status?.connected ? 'Replace the access token' : 'Paste the access token'}</span>
            <input className="field__input" type="password" autoComplete="off" spellCheck="false" value={token} onChange={e => setToken(e.target.value)} placeholder="IGAA…" />
          </label>
          <details>
            <summary className="muted" style={{ cursor: 'pointer' }}>Where do I get the token?</summary>
            <ol className="muted" style={{ margin: 'var(--space-2) 0 0', paddingLeft: '1.25em', lineHeight: 1.6 }}>
              <li>Open developers.facebook.com → My Apps → your app (type Business) → Instagram → API setup with Instagram login.</li>
              <li>Under "Generate access tokens", press Add account and sign in as keusmania_international (a Business or Creator account).</li>
              <li>Press Generate token next to the account, allow the permissions, and copy the whole token.</li>
              <li>Paste it here and press Save token. It lasts 60 days; the daily sync renews it.</li>
            </ol>
            <p className="muted" style={{ margin: 'var(--space-2) 0 0' }}>Full steps: docs/SOCIAL-FEED.md in the website code.</p>
          </details>
          <div><button className="btn btn--ghost btn--sm" type="submit" disabled={!!busy || !token.trim()}>{busy === 'token' ? 'Checking…' : 'Save token'}</button></div>
        </form>
      </article>

      {draft && (
        <form className="card mt-4" onSubmit={addPost} style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-3)', maxWidth: 820 }}>
          <h2 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Add a post</h2>
          <div className="cluster">
            {draft.images.map((img, i) => (
              <div key={img.src} style={{ display: 'grid', gap: 'var(--space-1)', width: 160 }}>
                <Img src={img.src} alt="" w={320} h={400} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <input className="field__input" placeholder="Alt text" value={img.alt} onChange={e => setDraft(d => ({ ...d, images: d.images.map((x, n) => n === i ? { ...x, alt: e.target.value } : x) }))} />
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setDraft(d => ({ ...d, images: d.images.filter((_, n) => n !== i) }))}>Remove</button>
              </div>
            ))}
            <CloudinaryUpload folder="keu/social" label={draft.images.length ? '+ Another image' : '+ Upload image'}
              onUpload={(url, data) => setDraft(d => ({ ...d, images: [...d.images, { src: url, alt: '', width: data?.width, height: data?.height }] }))} />
          </div>
          <label className="field" style={{ margin: 0 }}>
            <span className="field__label">Text (Arabic, Urdu and English paragraphs are each set in their own script; leave a blank line between them)</span>
            <textarea className="field__textarea" rows={8} value={draft.text} onChange={e => setDraft(d => ({ ...d, text: e.target.value }))} />
          </label>
          <label className="field" style={{ margin: 0 }}>
            <span className="field__label">Appears on the website from</span>
            <input className="field__input" type="datetime-local" required value={draft.publishAt} onChange={e => setDraft(d => ({ ...d, publishAt: e.target.value }))} />
          </label>
          <label className="field" style={{ margin: 0 }}>
            <span className="field__label">Link to the post on Instagram or Facebook (optional)</span>
            <input className="field__input" type="url" value={draft.permalink} onChange={e => setDraft(d => ({ ...d, permalink: e.target.value }))} placeholder="https://www.instagram.com/p/…" />
          </label>
          <div><button className="btn btn--primary" type="submit" disabled={!!busy || !draft.images.length}>{busy === 'add' ? 'Adding…' : 'Add post'}</button></div>
        </form>
      )}

      <h2 className="mt-8" style={{ fontSize: 'var(--text-lg)' }}>Posts ({posts.length})</h2>
      {!posts.length && status && <p className="muted">No posts yet. Connect Instagram and press Sync now, or add a post.</p>}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        {posts.map(p => {
          const future = new Date(p.publishAt) > new Date()
          return (
            <article key={p._id} className="card" style={{ padding: 'var(--space-3)', opacity: p.hidden ? 0.6 : 1 }}>
              {p.images[0] && <Img src={p.images[0].src} alt="" w={400} h={500} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />}
              <div className="cluster mt-2" style={{ gap: 'var(--space-2)' }}>
                <span className="badge badge--outline">{p.source === 'instagram' ? 'Instagram' : 'Added here'}</span>
                {p.images.length > 1 && <span className="badge badge--outline">{p.images.length} images</span>}
                {p.pinned && <span className="badge badge--gold">Pinned</span>}
                {p.hidden && <span className="badge badge--outline">Hidden</span>}
                {future && !p.hidden && <span className="badge badge--soft">From {fmt(p.publishAt)}</span>}
              </div>
              <p className="muted" style={{ fontSize: 'var(--text-xs)', margin: 'var(--space-2) 0' }}>{fmt(p.publishAt)}{p.permalink && <> · <a href={p.permalink} target="_blank" rel="noopener">open</a></>}</p>
              <p style={{ fontSize: 'var(--text-sm)', margin: 0, whiteSpace: 'pre-line', maxHeight: '7.5em', overflow: 'hidden' }} dir="auto">{p.text || <span className="muted">(no text)</span>}</p>
              {p.images.map((img, i) => (
                <label key={i} className="field mt-2" style={{ margin: 'var(--space-2) 0 0' }}>
                  <span className="field__label">Alt text{p.images.length > 1 ? ` · image ${i + 1}` : ''}</span>
                  <input className="field__input" value={img.alt || ''} onChange={setAlt(p._id, i)} />
                </label>
              ))}
              <div className="cluster mt-2" style={{ gap: 'var(--space-2)' }}>
                {p.images.length > 0 && <button className="btn btn--ghost btn--sm" disabled={!!busy} onClick={() => patch(p._id, { alts: p.images.map(img => img.alt || '') }, 'Alt text saved. The site picks it up with the next daily sync.')}>Save alt text</button>}
                <button className="btn btn--ghost btn--sm" disabled={!!busy} onClick={() => patch(p._id, { hidden: !p.hidden }, p.hidden ? 'Shown on the site' : 'Hidden from the site')}>{p.hidden ? 'Show' : 'Hide'}</button>
                <button className="btn btn--ghost btn--sm" disabled={!!busy} onClick={() => patch(p._id, { pinned: !p.pinned }, p.pinned ? 'Unpinned' : 'Pinned to the top')}>{p.pinned ? 'Unpin' : 'Pin'}</button>
                <button className="btn btn--ghost btn--sm" disabled={!!busy} style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }} onClick={() => remove(p)}>Delete</button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
