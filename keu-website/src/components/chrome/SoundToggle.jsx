/* Background sound (owner request, 2026-10-11). The track is uploaded in
   /admin/sound and saved as `site.ambience`.

   - Never plays on its own: the visitor presses this button (browsers block
     sound before a tap, and WCAG 1.4.2 asks for a visible control). Nothing is
     downloaded until then.
   - If a visitor switched it on before, the choice is remembered and the sound
     resumes on their first tap or key press of the next visit.
   - Fades in and out over ~1.2 s, loops, and pauses while the tab is hidden or
     another sound plays (a video review fires 'keu:media-play').
   - It lives in the nav, so it keeps playing across page changes. */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'

const PREF = 'keuSound'
const FADE_MS = 1200

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
  const audio = useRef(null)
  const fade = useRef(0)
  const [on, setOn] = useState(false)
  const wanted = useRef(false)       // what the visitor chose (survives tab hides)

  const ramp = useCallback((to, done) => {
    const el = audio.current
    if (!el) return
    cancelAnimationFrame(fade.current)
    const from = el.volume, t0 = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - t0) / FADE_MS)
      el.volume = from + (to - from) * p
      if (p < 1) fade.current = requestAnimationFrame(step)
      else done?.()
    }
    fade.current = requestAnimationFrame(step)
  }, [])

  const play = useCallback(() => {
    if (!audio.current) {
      const el = new Audio()
      el.src = a.src
      el.loop = true
      el.preload = 'auto'
      el.volume = 0
      audio.current = el
    }
    const el = audio.current
    el.play().then(() => { setOn(true); ramp(target) }).catch(() => setOn(false))
  }, [a.src, target, ramp])

  const pause = useCallback(() => {
    const el = audio.current
    if (!el || el.paused) { setOn(false); return }
    setOn(false)
    ramp(0, () => el.pause())
  }, [ramp])

  const toggle = () => {
    if (on) { wanted.current = false; writePref(false); pause() }
    else { wanted.current = true; writePref(true); play() }
  }

  // A track replaced in the admin: drop the old element.
  useEffect(() => () => { audio.current?.pause(); audio.current = null }, [a.src])

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
      className={`sound-toggle${on ? ' is-on' : ''} ${className}`.trim()}
      aria-pressed={on}
      aria-label={a.title ? `${label}: ${a.title}` : label}
      title={a.credit || a.title || undefined}
      onClick={toggle}
    >
      <span className="sound-toggle__bars" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="sound-toggle__text" aria-hidden="true">{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  )
}
