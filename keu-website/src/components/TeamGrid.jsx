/* Meet the Karwan (DESIGN-LANGUAGE §5.2 About). The chairman (or founder) gets
   a large 4:5 frame; everyone else sits 3-up. A missing photo shows an initials
   plate in Cormorant caps, never a stock silhouette. Keeps .team-card for the
   reveal registry and the admin preview.
   Each member is a button that opens their digital card (TeamCardDialog). */
import { useCallback, useState } from 'react'
import { useSite } from '../lib/SiteContext.jsx'
import Img from './Img.jsx'
import TeamCardDialog from './TeamCardDialog.jsx'

const initials = (name = '') =>
  String(name).trim().split(/\s+/).filter(w => /^[A-Za-z]/.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('')

function Portrait({ m, large }) {
  return (
    <div className="team__photo">
      {m.photo
        ? <Img src={m.photo} alt="" widths={large ? [480, 720, 960] : [320, 480, 640]} sizes={large ? '(max-width: 767px) 100vw, 40vw' : '(max-width: 767px) 50vw, 20vw'} loading="lazy" decoding="async" />
        : <span className="team__initials" aria-hidden="true">{initials(m.name)}</span>}
    </div>
  )
}

export default function TeamGrid() {
  const { site } = useSite()
  const team = (site.team || []).filter(m => m && m.name)
  if (!team.length) return null
  let lead = team.findIndex(m => /chair|founder/i.test(m.role || ''))
  if (lead < 0) lead = 0
  const head = team[lead]
  const rest = team.filter((_, i) => i !== lead)
  return <TeamLayout head={head} rest={rest} />
}

function TeamLayout({ head, rest }) {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const opener = (m, large) => (
    <button type="button" className="team__open" onClick={() => setOpen(m)} aria-haspopup="dialog" aria-label={`${m.name}${m.role ? `, ${m.role}` : ''}: open digital card`}>
      <Portrait m={m} large={large} />
      <span className="team__hint" aria-hidden="true">View card</span>
    </button>
  )

  return (
    <div className="team">
      <article className="team__lead team-card">
        {opener(head, true)}
        <div className="team__lead-text">
          <h3 className="team__name">{head.name}</h3>
          <p className="team__role">{head.role}</p>
        </div>
      </article>
      {rest.length > 0 && (
        <ul className="team__grid" role="list">
          {rest.map(m => (
            <li key={m.name} className="team-card team__member">
              {opener(m)}
              <h3 className="team__name">{m.name}</h3>
              <p className="team__role">{m.role}</p>
            </li>
          ))}
        </ul>
      )}
      {open && <TeamCardDialog member={open} onClose={close} />}
    </div>
  )
}
