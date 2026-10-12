/* Background sound (owner request, 2026-10-11). The track is uploaded in
   /admin/sound and saved as `site.ambience`.

   - Never plays on its own: the visitor presses this button (browsers block
     sound before a tap, and WCAG 1.4.2 asks for a visible control). Nothing is
     downloaded until then.
   - If a visitor switched it on before, the choice is remembered and the sound
     resumes on their first tap or key press of the next visit.
   - Fades in and out over ~1.2 s and loops: short clips (like the 16 s
     Talbiyah) repeat seamlessly with no gap (lib/loopPlayer.js). Pauses while
     the tab is hidden or another sound plays (a video review fires
     'keu:media-play'), and resumes where it stopped.
   - It lives in the nav, so it keeps playing across page changes. */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { createLoopPlayer } from '../../lib/loopPlayer.js'

const PREF = 'keuSound'

function readPref() {
  try { return localStorage.getItem(PREF) === 'on' } catch { return false }
}
function writePref(on) {
  try { localStorage.setItem(PREF, on ? 'on' : 'off') } catch { /* private mode */ }
}

export default function SoundToggle({ className = '' }) {
  const { site } = useSite()
  const a = site.ambience || {}
  const active = Boolean(a.enabled && a.src)
  const target = Math.min(0.8, Math.max(0.05, Number(a.volume) || 0.35))
  const player = useRef(null)
  const [on, setOn] = useState(false)
  // On a slow connection the track can take a few seconds to start: show that
  // the press was received instead of looking unresponsive.
  const [loading, setLoading] = useState(false)
  const wanted = useRef(false)       // what the visitor chose (survives tab hides)
  const duration = Number(a.duration) || 0

  const play = useCallback(() => {
    if (!player.current) player.current = createLoopPlayer(a.src, { volume: target, duration })
    const p = player.current
    setLoading(true)
    p.start()
      .then(() => {
        if (!wanted.current) { p.stop(); return }   // pressed again while loading
        setOn(true)
      })
      .catch(() => setOn(false))
      .finally(() => setLoading(false))
  }, [a.src, target, duration])

  const pause = useCallback(() => {
    setOn(false)
    player.current?.stop()
  }, [])

  const toggle = () => {
    if (on || loading) { wanted.current = false; writePref(false); pause() }
    else { wanted.current = true; writePref(true); play() }
  }

  // A track replaced in the admin: drop the old player.
  useEffect(() => () => { player.current?.destroy(); player.current = null }, [a.src])

  // Remembered "on": resume at the visitor's first interaction of this visit.
  useEffect(() => {
    if (!active || !readPref()) return
    const go = () => { wanted.current = true; play() }
    const opts = { once: true, capture: true }
    window.addEventListener('pointerdown', go, opts)
    window.addEventListener('keydown', go, opts)
    return () => {
      window.removeEventListener('pointerdown', go, opts)
      window.removeEventListener('keydown', go, opts)
    }
  }, [active, play])

  // Hidden tab or another sound: pause; come back only if the visitor wanted it.
  useEffect(() => {
    if (!active) return
    const onVis = () => {
      if (document.hidden) pause()
      else if (wanted.current) play()
    }
    const onMedia = () => pause()
    const onMediaEnd = () => { if (wanted.current && !document.hidden) play() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('keu:media-play', onMedia)
    window.addEventListener('keu:media-end', onMediaEnd)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('keu:media-play', onMedia)
      window.removeEventListener('keu:media-end', onMediaEnd)
    }
  }, [active, play, pause])

  if (!active) return null

  const label = on ? 'Pause background sound' : 'Play background sound'
  return (
    <button
      type="button"
      className={`sound-toggle${on ? ' is-on' : ''}${loading ? ' is-loading' : ''} ${className}`.trim()}
      aria-pressed={on || loading}
      aria-busy={loading || undefined}
      aria-label={a.title ? `${label}: ${a.title}` : label}
      title={a.credit || a.title || undefined}
      onClick={toggle}
    >
      <span className="sound-toggle__bars" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="sound-toggle__text" aria-hidden="true">{loading ? 'Loading…' : on ? 'Sound on' : 'Sound off'}</span>
    </button>
  )
}
