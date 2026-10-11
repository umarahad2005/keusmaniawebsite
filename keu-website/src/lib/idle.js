/* Run non-critical work once the page has loaded and the main thread is idle,
   so motion set-up never competes with the first render (Phase 6: Lighthouse
   on the live site measured ~2.2 s of blocking from motion start-up).
   Returns a cancel function for effect clean-up. */
export function afterIdle(fn, { timeout = 2500 } = {}) {
  if (typeof window === 'undefined') return () => {}
  let cancelled = false
  let idleId = 0
  let timer = 0
  const run = () => { if (!cancelled) fn() }
  const schedule = () => {
    if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(run, { timeout })
    else timer = setTimeout(run, 250)
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
  return () => {
    cancelled = true
    window.removeEventListener('load', schedule)
    if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
    clearTimeout(timer)
  }
}
