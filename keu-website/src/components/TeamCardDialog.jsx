/* The digital card as a popup over the About page. Portalled to <body> so the
   page behind is inert; Esc, the close button or a click on the backdrop
   closes it; focus starts on the member's name and returns to the photo that
   opened it. "Open card page" leads to the shareable /team/:slug page. */
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { memberPath } from '../lib/team.js'
import { Icon } from '../icons.jsx'
import TeamDigitalCard from './TeamDigitalCard.jsx'

export default function TeamCardDialog({ member, onClose }) {
  const box = useRef(null)
  const heading = useRef(null)

  useEffect(() => {
    const prev = document.activeElement
    heading.current?.focus()
    const outside = [document.getElementById('main-content'), document.getElementById('site-footer'), document.querySelector('.site-nav')].filter(Boolean)
    outside.forEach(el => { el.inert = true })
    window.__lenis?.stop()
    document.documentElement.classList.add('no-scroll')
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const items = box.current.querySelectorAll('a[href], button, [tabindex="-1"]')
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      outside.forEach(el => { el.inert = false })
      window.__lenis?.start()
      document.documentElement.classList.remove('no-scroll')
      prev?.focus?.()
    }
  }, [onClose])

  return createPortal(
    <div className="dcard-dialog" role="dialog" aria-modal="true" aria-labelledby="dcard-name" ref={box}
         onClick={(e) => { if (e.target === box.current) onClose() }}>
      <div className="dcard-dialog__inner">
        <button className="dcard-dialog__close" type="button" onClick={onClose} aria-label="Close card">
          <Icon name="close" className="k-ico" />
        </button>
        <TeamDigitalCard member={member} headingId="dcard-name" headingRef={heading} />
        <p className="dcard-dialog__page">
          <Link className="k-link" to={memberPath(member)} onClick={onClose}>Open card page <span aria-hidden="true">→</span></Link>
        </p>
      </div>
    </div>,
    document.body,
  )
}
