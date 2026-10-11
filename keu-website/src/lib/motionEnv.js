/* =========================================================
   Motion environment detection (DESIGN-LANGUAGE §3.7).

   Every motion module reads this once at creation time and builds either the
   full or the degraded version. Unknown APIs (deviceMemory, hardwareConcurrency
   and navigator.connection are missing in Safari and Firefox) count as
   "not low-end, not Save-Data".

   Emulate in dev with a query string: ?motion=reduce | lowend | savedata | full
   ========================================================= */

const isBrowser = typeof window !== 'undefined'

function override() {
  if (!isBrowser) return null
  try { return new URLSearchParams(window.location.search).get('motion') } catch { return null }
}

function read() {
  if (!isBrowser) {
    return { reduce: false, saveData: false, slowNet: false, lowEnd: false, coarse: false, small: false, tablet: false, finePointer: true }
  }
  const mm = q => window.matchMedia(q).matches
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null
  const forced = override()

  const reduce = forced === 'reduce' || (forced !== 'full' && mm('(prefers-reduced-motion: reduce)'))
  const saveData = forced === 'savedata' || (forced !== 'full' && conn?.saveData === true)
  const slowNet = forced === 'savedata' || (forced !== 'full' && /(^|-)2g$|^3g$/.test(conn?.effectiveType || ''))
  const memory = navigator.deviceMemory
  const cores = navigator.hardwareConcurrency
  const lowEnd = forced === 'lowend' ||
    (forced !== 'full' && ((typeof memory === 'number' && memory <= 4) || (typeof cores === 'number' && cores <= 4)))

  return {
    reduce,                              // prefers-reduced-motion
    saveData,                            // Save-Data header / data saver
    slowNet,                             // 2g / 3g effective connection
    lowEnd,                              // ≤ 4 GB memory or ≤ 4 cores
    coarse: mm('(pointer: coarse)'),
    finePointer: mm('(pointer: fine)'),
    small: mm('(max-width: 767px)'),     // phones: poster-only hero, thumb bar
    tablet: mm('(min-width: 768px) and (max-width: 1023px)'),
  }
}

let env = read()
const listeners = new Set()

if (isBrowser) {
  const update = () => {
    env = read()
    listeners.forEach(fn => fn(env))
  }
  ;['(prefers-reduced-motion: reduce)', '(max-width: 767px)', '(min-width: 768px) and (max-width: 1023px)', '(pointer: coarse)']
    .forEach(q => window.matchMedia(q).addEventListener?.('change', update))
  navigator.connection?.addEventListener?.('change', update)
}

/** Current environment snapshot. */
export function motionEnv() { return env }

/** True when non-essential motion should be skipped entirely. */
export function motionOff() { return env.reduce }

/** True when heavy media (video, big images) should not load. */
export function mediaLite() { return env.reduce || env.saveData || env.slowNet || env.lowEnd }

/** Subscribe to live changes (reduced-motion toggles, rotation, connection). Returns an unsubscribe. */
export function onMotionEnvChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
