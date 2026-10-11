/* Shared state for the public chrome: the location currently on screen (which
   lags the URL while a route transition is covered) and the mobile menu. */
import { createContext, useContext, useEffect, useState } from 'react'

export const DisplayLocationContext = createContext(null)
const MenuContext = createContext({ menuOpen: false, setMenuOpen: () => {} })

/** The location whose page is on screen. Falls back to the router location. */
export function useDisplayLocation() {
  return useContext(DisplayLocationContext)
}

export function MenuProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return <MenuContext.Provider value={{ menuOpen, setMenuOpen }}>{children}</MenuContext.Provider>
}

export function useMenu() {
  return useContext(MenuContext)
}

/* The element whose departure from the viewport reveals the floating WhatsApp
   button (desktop) and the thumb bar (phones): the hero buttons on Home, the
   page header elsewhere. */
const SENTINEL = '[data-hero-ctas], .hero__ctas, [data-page-header], .page-header'

/** True once the hero call-to-action buttons (or the page header) have scrolled away. */
export function useHeroGone(routeKey) {
  const [gone, setGone] = useState(false)

  useEffect(() => {
    setGone(false)
    let io
    const raf = requestAnimationFrame(() => {
      const el = document.querySelector(SENTINEL)
      if (!el) {
        const onScroll = () => setGone(window.scrollY > 320)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        io = { disconnect: () => window.removeEventListener('scroll', onScroll) }
        return
      }
      io = new IntersectionObserver(([entry]) => {
        setGone(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      }, { rootMargin: '-72px 0px 0px 0px' })
      io.observe(el)
    })
    return () => { cancelAnimationFrame(raf); io?.disconnect() }
  }, [routeKey])

  return gone
}
