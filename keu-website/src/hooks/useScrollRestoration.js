import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from '../lib/motion.js'
import { useSite } from '../lib/SiteContext.jsx'

const NAV_OFFSET = -64   // fixed header height, matches useLenis's anchor handler

/* The browser restores the previous scroll offset on back/forward, which lands
   you mid-page on a route that has just re-rendered from the top. We drive the
   position ourselves instead. */
if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

function jumpTo(target, offset = 0) {
  const lenis = window.__lenis

  /* Lenis keeps its own internal scroll position and rewrites the native one on
     the next rAF tick — so a bare window.scrollTo gets snapped straight back.
     Go through Lenis when it's running (force: true works while it is stopped
     under the route curtain), and fall back to native scrolling when it isn't
     (reduced-motion users). */
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate: true, force: true })
    return
  }

  if (target === 0) {
    // 'instant' is explicit: html { scroll-behavior: smooth } turns 'auto' into a glide.
    window.scrollTo({ top: 0, behavior: 'instant' })
  } else {
    target.scrollIntoView({ behavior: 'instant', block: 'start' })
    window.scrollBy({ top: offset, behavior: 'instant' })
  }
}

/**
 * Sends every navigation to the top of the page, except when the URL carries a
 * hash — then it scrolls to that element (e.g. /packages#economy-umrah).
 *
 * Pass the displayed location (TransitionRoutes) so the jump happens while the
 * route curtain is closed. It runs as a layout effect, i.e. in the same commit
 * as the page swap, before anything is painted.
 */
export function useScrollRestoration(displayLocation) {
  const routerLocation = useLocation()
  const { pathname, hash, key } = displayLocation || routerLocation
  const { packages } = useSite()
  const pending = useRef(null)   // an anchor that wasn't on the page yet

  useLayoutEffect(() => {
    pending.current = null
    if (hash) {
      /* getElementById, not querySelector: package ids come from the admin and
         may start with a digit or contain spaces, which are invalid CSS selectors. */
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        jumpTo(el, NAV_OFFSET)
        ScrollTrigger.update()
        return
      }
      // Unknown anchor — better to land at the top than wherever we were. It may
      // be a package card that only exists once live content arrives, so retry then.
      pending.current = hash
    }

    jumpTo(0)
    ScrollTrigger.update()
  }, [pathname, hash, key])

  /* A fresh load of /packages#<card> renders the default cards first; jump
     once the live packages (and their anchors) are on the page. */
  useEffect(() => {
    if (!pending.current) return
    const el = document.getElementById(decodeURIComponent(pending.current.slice(1)))
    if (!el) return
    pending.current = null
    jumpTo(el, NAV_OFFSET)
    ScrollTrigger.update()
  }, [packages])
}
