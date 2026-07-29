import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

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
     Go through Lenis when it's running, and fall back to native scrolling when
     it isn't (reduced-motion users, and the admin area). */
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
 */
export function useScrollRestoration() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      /* getElementById, not querySelector: package ids come from the admin and
         may start with a digit ("21-days"), which is an invalid CSS selector. */
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        jumpTo(el, NAV_OFFSET)
        return
      }
      // Unknown anchor — better to land at the top than wherever we were.
    }

    jumpTo(0)
  }, [pathname, hash])
}
