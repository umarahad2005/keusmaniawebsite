import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'
import { Icon } from '../../icons.jsx'
import { useWaLink } from '../../lib/whatsapp.js'

const STATUSES = ['unread', 'read', 'replied', 'archived']

export default function AdminInbox() {
  const [filter, setFilter] = useState('all')
  const [data,   setData]   = useState({ inquiries: [], counts: {} })
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const wa = useWaLink()

  const reload = async () => {
    setLoading(true)
    const q = filter === 'all' ? '' : `?status=${filter}`
    try {
      const r = await api.get('/api/inquiries' + q)
      setData(r)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { reload() }, [filter])

  const setStatus = async (id, status) => {
    await api.patch(`/api/inquiries/${id}`, { status })
    reload()
    if (selected?._id === id) setSelected({ ...selected, status })
  }

  const remove = async (id) => {
    if (!confirm('Delete this inquiry permanently?')) return
    await api.del(`/api/inquiries/${id}`)
    setSelected(null)
    reload()
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Inbox</h1>
        <div className="cluster">
          {['all', ...STATUSES].map(s => (
            <button
              key={s}
              className="chip"
              data-active={filter === s ? 'true' : 'false'}
              onClick={() => setFilter(s)}
            >
              {s} {s !== 'all' && data.counts[s] != null ? `(${data.counts[s]})` : ''}
            </button>
          ))}
        </div>
      </header>

      <div className="inbox-grid">
        <div className="inbox-list">
          {loading && <div className="muted">Loading…</div>}
          {!loading && data.inquiries.length === 0 && (
            <div className="muted" style={{ padding: '2rem 0' }}>No inquiries yet.</div>
          )}
          {data.inquiries.map(i => (
            <button
              key={i._id}
              className={'inbox-row' + (selected?._id === i._id ? ' is-active' : '') + (i.status === 'unread' ? ' is-unread' : '')}
              onClick={() => { setSelected(i); if (i.status === 'unread') setStatus(i._id, 'read') }}
            >
              <div className="inbox-row__top">
                <strong>{i.name}</strong>
                <span className="inbox-row__time">{new Date(i.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="inbox-row__sub">{i.package || 'general'} · {i.phone}</div>
              <div className="inbox-row__preview">{i.message.slice(0, 80)}…</div>
            </button>
          ))}
        </div>

        <div className="inbox-detail">
          {!selected && <div className="muted">Select an inquiry to view details.</div>}
          {selected && (
            <article className="card" style={{ padding: 'var(--space-8)' }}>
              <div className="cluster" style={{ justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ marginBottom: 4 }}>{selected.name}</h2>
                  <div className="muted" style={{ fontSize: 'var(--text-sm)' }}>
                    {new Date(selected.createdAt).toLocaleString()} · status: <strong>{selected.status}</strong>
                  </div>
                </div>
                <div className="cluster">
                  {STATUSES.filter(s => s !== selected.status).map(s => (
                    <button key={s} className="btn btn--ghost btn--sm" onClick={() => setStatus(selected._id, s)}>
                      Mark {s}
                    </button>
                  ))}
                  <button className="btn btn--ghost btn--sm" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }} onClick={() => remove(selected._id)}>
                    Delete
                  </button>
                </div>
              </div>

              <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: 'var(--space-6) 0' }} />

              <div className="grid" style={{ gridTemplateColumns: '120px 1fr', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                <div className="muted">Phone</div>     <div><a href={`tel:${selected.phone}`}>{selected.phone}</a></div>
                {selected.email   && <><div className="muted">Email</div>   <div><a href={`mailto:${selected.email}`}>{selected.email}</a></div></>}
                {selected.package && <><div className="muted">Package</div> <div>{selected.package}</div></>}
                <div className="muted">Prefers</div>   <div>{selected.prefer}</div>
              </div>

              <h3 className="mt-8" style={{ fontSize: 'var(--text-base)' }}>Message</h3>
              <p style={{ whiteSpace: 'pre-wrap', marginTop: 'var(--space-2)' }}>{selected.message}</p>

              <div className="cluster mt-8">
                <a className="btn btn--whatsapp" target="_blank" rel="noopener" href={wa('general', `Assalamu Alaikum ${selected.name}, regarding your inquiry —`)}>
                  <Icon name="whatsapp" style={{ width: 16, height: 16 }} /> Reply on WhatsApp
                </a>
                {selected.email && (
                  <a className="btn btn--ghost" href={`mailto:${selected.email}?subject=Re: Your inquiry`}>
                    <Icon name="mail" style={{ width: 16, height: 16 }} /> Reply by email
                  </a>
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  )
}
