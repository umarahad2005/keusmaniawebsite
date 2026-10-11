/* Route transitions for the public site (DESIGN-LANGUAGE §3.5).

   The URL changes immediately, but the page on screen ("display location")
   only changes while the curtain is closed:
     cover → lenis.stop → swap the page (flushSync) → scroll reset (layout
     effect in useScrollRestoration) → ScrollTrigger.refresh → focus #main-content
     and announce the page → lenis.start → reveal.
   Same-page changes (hash or query only) skip the curtain. A navigation that
   arrives mid-transition is queued and only the latest one runs. /admin is never
   wrapped: these routes only render inside the public shell. */
import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Routes, useLocation, useNavigationType } from 'react-router-dom'
import { ScrollTrigger } from '../../lib/motion.js'
import { motionEnv } from '../../lib/motionEnv.js'
import { DisplayLocationContext } from '../chrome/ChromeContext.jsx'
import { useScrollRestoration } from '../../hooks/useScrollRestoration.js'
import PageCurtain from './PageCurtain.jsx'

const CAPTIONS = { '/': 'Home', '/packages': 'Packages', '/about': 'About', '/gallery': 'Gallery', '/contact': 'Contact' }
const MIN_HOLD_MS = 120

const frames = (n = 2) => new Promise(resolve => {
  const step = (k) => (k <= 0 ? resolve() : requestAnimationFrame(() => step(k - 1)))
  step(n)
})
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function pickMode(navType) {
  const env = motionEnv()
  if (env.saveData || env.slowNet) return 'instant'
  if (env.reduce) return 'fade-reduce'
  if (env.lowEnd) return 'fade'
  return navType === 'POP' ? 'pop' : 'bands'
}

function setInert(on) {
  ;['main-content', 'site-footer'].forEach(id => {
    const el = document.getElementById(id)
    if (el) el.inert = on
  })
}

export default function TransitionRoutes({ children, shell = (page) => page }) {
  const location = useLocation()
  const navType = useNavigationType()
  const [display, setDisplay] = useState(location)
  const curtain = useRef(null)
  const busy = useRef(false)
  const latest = useRef(location)
  const displayRef = useRef(display)
  const announcer = useRef(null)

  latest.current = location
  displayRef.current = display

  useScrollRestoration(display)

  useEffect(() => {
    const current = displayRef.current
    if (location.key === current.key) return
    if (location.pathname === current.pathname) {
      setDisplay(location)             // hash or query only: no curtain
      return
    }
    run(location, navType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  async function run(target, type) {
    if (busy.current) return            // the latest location is picked up when the current run ends
    busy.current = true
    const mode = pickMode(type)
    const lenis = window.__lenis

    await curtain.current.cover(mode, CAPTIONS[target.pathname] || '')
    const coveredAt = performance.now()
    setInert(true)
    lenis?.stop()

    flushSync(() => setDisplay(target)) // page swap + scroll reset happen under cover
    await frames(2)                     // let page effects (titles, reveals) run
    ScrollTrigger.refresh()
    const held = performance.now() - coveredAt
    if (held < MIN_HOLD_MS && mode !== 'instant') await wait(MIN_HOLD_MS - held)

    setInert(false)
    lenis?.start()
    const main = document.getElementById('main-content')
    main?.focus({ preventScroll: true })
    if (announcer.current) announcer.current.textContent = document.title

    await curtain.current.reveal(mode)
    busy.current = false

    // A navigation that arrived mid-transition runs now.
    const next = latest.current
    if (next.key !== target.key && next.pathname !== target.pathname) run(next, 'PUSH')
    else if (next.key !== target.key) setDisplay(next)
  }

  return (
    <DisplayLocationContext.Provider value={display}>
      {shell(<Routes location={display}>{children}</Routes>)}
      <PageCurtain ref={curtain} />
      <p className="sr-only" aria-live="polite" ref={announcer} />
    </DisplayLocationContext.Provider>
  )
}
