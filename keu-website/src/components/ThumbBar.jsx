/* Thumb bar, phones under 768 px (DESIGN-LANGUAGE §4 ThumbBar).
   WhatsApp (two thirds) and Call (one third) under the thumb, sliding in once
   the hero buttons have scrolled away. Hidden while the menu is open, while a
   form field has focus (the keyboard is up), and over the CTA band, which has
   the same buttons. */
import { useEffect, useState } from 'react'
import { useWaLink, waNumber } from '../lib/whatsapp.js'
import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'
import { useDisplayLocation, useHeroGone, useMenu } from './chrome/ChromeContext.jsx'

function useFieldFocus() {
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    const isField = (el) => el && el.matches?.('input, textarea, select, [contenteditable="true"]')
    const onIn = (e) => setFocused(isField(e.target))
    const onOut = () => setFocused(isField(document.activeElement))
    document.addEventListener('focusin', onIn)
    document.addEventListener('focusout', onOut)
    return () => { document.removeEventListener('focusin', onIn); document.removeEventListener('focusout', onOut) }
  }, [])
  return focused
}

function useOverCtaBand(routeKey) {
  const [over, setOver] = useState(false)
  useEffect(() => {
    setOver(false)
    const els = document.querySelectorAll('[data-thumbbar-hide], .cta-banner')
    if (!els.length) return
    const seen = new Set()
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)))
      setOver(seen.size > 0)
    }, { threshold: 0.25 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [routeKey])
  return over
}

export default function ThumbBar() {
  const display = useDisplayLocation()
  const { menuOpen } = useMenu()
  const { site } = useSite()
  const wa = useWaLink()
  const gone = useHeroGone(display?.key)
  const field = useFieldFocus()
  const overBand = useOverCtaBand(display?.key)

  const visible = gone && !menuOpen && !field && !overBand

  return (
    <div className={`thumb-bar${visible ? ' is-visible' : ''}`} aria-hidden={!visible} inert={!visible ? '' : undefined}>
      <a className="k-btn k-btn--wa k-btn--lg" href={wa('general')} target="_blank" rel="noopener">
        <Icon name="whatsapp" className="k-ico" /> WhatsApp
      </a>
      <a className="k-btn k-btn--ghost k-btn--lg" href={`tel:+${waNumber(site.company.phone)}`}>
        <Icon name="phone" className="k-ico" /> Call
      </a>
    </div>
  )
}
