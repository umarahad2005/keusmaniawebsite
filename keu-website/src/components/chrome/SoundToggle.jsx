/* Background sound (owner request, 2026-10-11). The track is uploaded in
   /admin/sound and saved as `site.ambience`.

   - On by default (owner, 2026-10-23): browsers block sound until the visitor
     interacts, so it starts at the first tap, click or key press anywhere on
     the page — or at once where the browser already allows sound. Nothing is
     downloaded before that.
   - "Sound off" is remembered: a visitor who turned it off is never played to
     again until they press the button. The button is the visible control
     WCAG 1.4.2 asks for.
   - Fades in and out over ~1.2 s and loops: short clips (like the 16 s
     Talbiyah) repeat seamlessly with no gap (lib/loopPlayer.js). Pauses while
     the tab is hidden or another sound plays (a video review fires
     'keu:media-play'), and resumes where it stopped.
   - It lives in the nav, so it keeps playing across page changes. */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSite } from '../../lib/SiteContext.jsx'
import { createLoopPlayer } from '../../lib/loopPlayer.js'

const PREF = 'keuSound'

// On unless this visitor turned it off before.
function readPref() {
  try { return localStorage.getItem(PREF) !== 'off' } catch { return true }
}

// Firefox (and newer Chromium) can say up front whether sound may start
// without a gesture; elsewhere wait for one.
function canAutoplay() {
  try { return navigator.getAutoplayPolicy?.('audiocontext') === 'allowed' } catch { return false }
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

  // Default on: start at once if allowed, else at the first interaction of
  // this visit. A scroll or a touch-down does not count as permission on
  // phones, so keep listening until the sound is actually playing. A press on
  // this button is left to toggle(), so clicking "Sound off" turns it on
  // instead of on-then-off.
  const playing = useRef(false)
  useEffect(() => { playing.current = on }, [on])
  useEffect(() => {
    if (!active || !readPref()) return
    if (canAutoplay()) { wanted.current = true; play() }
    const events = ['pointerdown', 'keydown', 'touchend', 'click']
    const opts = { capture: true }
    const done = () => events.forEach(ev => window.removeEventListener(ev, go, opts))
    function go(e) {
      if (playing.current || !readPref()) { done(); return }
      if (e.type === 'pointerdown' && e.pointerType !== 'mouse') return
      if (e.target?.closest?.('.sound-toggle')) return
      // Where the browser can tell, only try inside a real activation, so a
      // scroll never leaves the button stuck on "Loading…".
      if (navigator.userActivation && !navigator.userActivation.isActive) return
      wanted.current = true
      play()
    }
    events.forEach(ev => window.addEventListener(ev, go, opts))
    return done
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
