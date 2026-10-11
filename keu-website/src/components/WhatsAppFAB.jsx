/* Floating WhatsApp button, 768 px and up (DESIGN-LANGUAGE §4 WhatsApp FAB).
   A 56 px disc that appears once the hero buttons (or the page header) have
   scrolled away. It opens a short list of WhatsApp topics; nothing is hover-only.
   Sits above the route curtain (z 110), so it stays usable mid-transition.
   Hidden on /contact and while the mobile menu is open. No pulse, no greeting. */
import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/motion.js'
import { motionEnv } from '../lib/motionEnv.js'
import { useWaLink } from '../lib/whatsapp.js'
import { Icon } from '../icons.jsx'
import { useDisplayLocation, useHeroGone, useMenu } from './chrome/ChromeContext.jsx'

const TOPICS = [
  { key: 'umrah',   label: 'Umrah packages' },
  { key: 'qafila',  label: 'Qafila e Shoq' },
  { key: 'general', label: 'General question' },
]

export default function WhatsAppFAB() {
  const display = useDisplayLocation()
  const { menuOpen } = useMenu()
  const gone = useHeroGone(display?.key)
  const wa = useWaLink()
  const [open, setOpen] = useState(false)
  const button = useRef(null)
  const list = useRef(null)
  const wrap = useRef(null)

  const hidden = display?.pathname === '/contact' || menuOpen
  const visible = gone && !hidden

  // Close the list when the button hides or the route changes.
  useEffect(() => { if (!visible) setOpen(false) }, [visible])
  useEffect(() => { setOpen(false) }, [display?.key])

  // Focus the first topic on open; Esc closes and returns focus.
  useEffect(() => {
    if (!open) return
    list.current?.querySelector('a')?.focus()
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus() } }
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown) }
  }, [open])

  // Gentle magnetic pull on precise pointers only (±12 px, no elastic return).
  useEffect(() => {
    const el = button.current
    const env = motionEnv()
    if (!el || env.reduce || env.lowEnd || !env.finePointer) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      xTo(Math.max(-12, Math.min(12, dx * 0.3)))
      yTo(Math.max(-12, Math.min(12, dy * 0.3)))
    }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [])

  return (
    <div className={`wa-fab${visible ? ' is-visible' : ''}`} ref={wrap} aria-hidden={!visible} inert={!visible ? '' : undefined}>
      {open && (
        <ul className="wa-fab__list" id="wa-fab-list" ref={list} role="list">
          {TOPICS.map(t => (
            <li key={t.key}>
              <a href={wa(t.key)} target="_blank" rel="noopener" onClick={() => setOpen(false)}>{t.label}</a>
            </li>
          ))}
        </ul>
      )}
      <button
        ref={button}
        className="wa-fab__button"
        type="button"
        aria-expanded={open}
        aria-controls="wa-fab-list"
        aria-label="Chat on WhatsApp"
        onClick={() => setOpen(o => !o)}
      >
        <Icon name="whatsapp" className="k-ico" />
      </button>
    </div>
  )
}
