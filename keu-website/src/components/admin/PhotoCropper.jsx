/* Photo editor shown before an image upload (team photos). Drag to move, wheel
   or pinch to zoom, rotate 90° or straighten by a few degrees, flip, reset.
   Saves a JPEG at `output` size, so every team photo arrives the same shape.

   The image can never leave a gap in the frame: the minimum zoom is worked out
   for the current angle, and the pan is clamped in the image's own (rotated)
   axes. `guides` draws the centre square and circle that the team grid and the
   digital card crop to, so the admin sees all three framings at once.

   Kept light so it never hangs the admin (owner report, 2026-10-24):
   - rendered into <body> through a portal, so a transformed ancestor (the
     team card lifts on hover) cannot trap the fixed overlay inside the card;
   - big phone photos are scaled down once on load (longest side MAX_SRC), so
     each redraw paints ~2 MP instead of 12+ MP;
   - drags redraw at most once per frame, and the page scroll lock is set once
     for the dialog's lifetime instead of on every zoom or move. */
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MAX_ZOOM = 5
const MAX_SRC = 2400

/* A copy of a large image no bigger than MAX_SRC on its longest side. */
function downscale(im) {
  const w = im.naturalWidth, h = im.naturalHeight
  const k = MAX_SRC / Math.max(w, h)
  if (k >= 1) return { src: im, w, h }
  const c = document.createElement('canvas')
  c.width = Math.round(w * k); c.height = Math.round(h * k)
  const ctx = c.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(im, 0, 0, c.width, c.height)
  return { src: c, w: c.width, h: c.height }
}

export default function PhotoCropper({ src, aspect = 4 / 5, output = 1080, guides = true, onCancel, onDone }) {
  const OW = output
  const OH = Math.round(output / aspect)
  const canvas = useRef(null)
  const [img, setImg] = useState(null)
  const [error, setError] = useState(null)
  const [quarter, setQuarter] = useState(0)     // 90° steps
  const [fine, setFine] = useState(0)           // straighten, −45…45
  const [flip, setFlip] = useState(false)
  const [zoom, setZoom] = useState(1)           // 1 = just covers the frame
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const pointers = useRef(new Map())
  const pinch = useRef(null)
  const pending = useRef({ x: 0, y: 0, raf: 0 })

  useEffect(() => {
    const im = new Image()
    im.crossOrigin = 'anonymous'
    im.onload = () => setImg(downscale(im))
    im.onerror = () => setError('This photo could not be opened. Try another file (JPG or PNG).')
    im.src = src
  }, [src])

  const theta = ((quarter * 90 + fine) * Math.PI) / 180

  // Smallest scale at which the rotated image still covers the whole frame.
  const coverScale = useCallback((t) => {
    if (!img) return 1
    const c = Math.abs(Math.cos(t)), s = Math.abs(Math.sin(t))
    return Math.max((OW * c + OH * s) / img.w, (OW * s + OH * c) / img.h)
  }, [img, OW, OH])

  const clamp = useCallback((o, z = zoom, t = theta) => {
    if (!img) return o
    const sc = coverScale(t) * z
    const c = Math.cos(t), s = Math.sin(t)
    const ac = Math.abs(c), as = Math.abs(s)
    const mx = Math.max(0, (sc * img.w - (OW * ac + OH * as)) / 2)
    const my = Math.max(0, (sc * img.h - (OW * as + OH * ac)) / 2)
    // Into the image's axes, clamp, and back.
    let ix = o.x * c + o.y * s
    let iy = -o.x * s + o.y * c
    ix = Math.max(-mx, Math.min(mx, ix))
    iy = Math.max(-my, Math.min(my, iy))
    return { x: ix * c - iy * s, y: ix * s + iy * c }
  }, [img, zoom, theta, coverScale, OW, OH])

  // Re-clamp whenever the angle or zoom changes the allowed range.
  useEffect(() => { setOffset(o => clamp(o)) }, [zoom, quarter, fine, img]) // eslint-disable-line react-hooks/exhaustive-deps

  const paint = useCallback((ctx, withGuides) => {
    ctx.save()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, OW, OH)
    if (img) {
      const sc = coverScale(theta) * zoom
      ctx.translate(OW / 2 + offset.x, OH / 2 + offset.y)
      ctx.rotate(theta)
      ctx.scale(flip ? -sc : sc, sc)
      // Best quality for the saved file; the default is plenty for the preview.
      if (!withGuides) ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img.src, -img.w / 2, -img.h / 2)
    }
    ctx.restore()
    if (!withGuides) return
    ctx.save()
    ctx.lineWidth = Math.max(2, OW / 400)
    if (dragging) {           // rule of thirds while moving
      ctx.strokeStyle = 'rgba(255,255,255,.7)'
      ctx.beginPath()
      for (const f of [1 / 3, 2 / 3]) {
        ctx.moveTo(OW * f, 0); ctx.lineTo(OW * f, OH)
        ctx.moveTo(0, OH * f); ctx.lineTo(OW, OH * f)
      }
      ctx.stroke()
    }
    if (guides) {
      const side = Math.min(OW, OH)
      const x = (OW - side) / 2, y = (OH - side) / 2
      ctx.setLineDash([OW / 60, OW / 90])
      ctx.strokeStyle = 'rgba(255,255,255,.95)'
      ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 4
      ctx.strokeRect(x, y, side, side)
      ctx.beginPath(); ctx.arc(OW / 2, OH / 2, side / 2, 0, Math.PI * 2); ctx.stroke()
    }
    ctx.restore()
  }, [img, theta, zoom, offset, flip, dragging, guides, coverScale, OW, OH])

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (ctx) paint(ctx, true)
  }, [paint])

  // Screen px → canvas px.
  const ratio = () => OW / (canvas.current?.clientWidth || OW)

  const onPointerDown = (e) => {
    canvas.current.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom }
    }
    setDragging(true)
  }
  const onPointerMove = (e) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    const next = { x: e.clientX, y: e.clientY }
    pointers.current.set(e.pointerId, next)
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()]
      const z = pinch.current.zoom * Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.dist
      setZoom(Math.max(1, Math.min(MAX_ZOOM, z)))
      return
    }
    // Add up the movement and apply it once per frame.
    const r = ratio(), acc = pending.current
    acc.x += (next.x - prev.x) * r
    acc.y += (next.y - prev.y) * r
    if (!acc.raf) acc.raf = requestAnimationFrame(() => {
      const { x, y } = acc
      acc.x = 0; acc.y = 0; acc.raf = 0
      setOffset(o => clamp({ x: o.x + x, y: o.y + y }))
    })
  }
  useEffect(() => () => cancelAnimationFrame(pending.current.raf), [])
  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    if (pointers.current.size === 0) setDragging(false)
  }

  // Wheel zoom needs a non-passive listener so the dialog does not scroll.
  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      setZoom(z => Math.max(1, Math.min(MAX_ZOOM, z * Math.exp(-e.deltaY / 500))))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Page scroll lock for the dialog's lifetime only.
  useEffect(() => {
    document.body.classList.add('no-scroll')
    return () => document.body.classList.remove('no-scroll')
  }, [])

  // Keys read the latest handlers through refs, so the listener is added once.
  const latest = useRef({})
  latest.current = { onCancel, clamp }
  useEffect(() => {
    const onKey = (e) => {
      const { onCancel, clamp } = latest.current
      if (e.key === 'Escape') onCancel()
      const step = e.shiftKey ? 40 : 10
      const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]
      if (move && document.activeElement === canvas.current) {
        e.preventDefault()
        setOffset(o => clamp({ x: o.x + move[0], y: o.y + move[1] }))
      }
      if ((e.key === '+' || e.key === '=') && document.activeElement === canvas.current) setZoom(z => Math.min(MAX_ZOOM, z * 1.1))
      if (e.key === '-' && document.activeElement === canvas.current) setZoom(z => Math.max(1, z / 1.1))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const reset = () => { setQuarter(0); setFine(0); setFlip(false); setZoom(1); setOffset({ x: 0, y: 0 }) }

  const save = () => {
    setBusy(true)
    const out = document.createElement('canvas')
    out.width = OW; out.height = OH
    paint(out.getContext('2d'), false)
    out.toBlob((blob) => {
      setBusy(false)
      if (!blob) { setError('Could not prepare the photo. Please try again.'); return }
      onDone(new File([blob], 'team-photo.jpg', { type: 'image/jpeg' }))
    }, 'image/jpeg', 0.9)
  }

  return createPortal(
    <div className="modal-overlay cropper-overlay" data-open="true">
      <div className="modal cropper" role="dialog" aria-modal="true" aria-labelledby="cropper-title">
        <button className="modal__close" type="button" onClick={onCancel} aria-label="Close">×</button>
        <h2 className="cropper__title" id="cropper-title">Adjust photo</h2>

        <div className="cropper__body">
          <div className="cropper__stage">
            <canvas
              ref={canvas}
              width={OW}
              height={OH}
              className={`cropper__canvas${dragging ? ' is-dragging' : ''}`}
              style={{ aspectRatio: `${OW} / ${OH}`, '--ar': OW / OH }}
              tabIndex={0}
              aria-label="Photo. Drag or use the arrow keys to move it; scroll, pinch or press plus and minus to zoom."
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onDoubleClick={() => setZoom(z => (z > 1.05 ? 1 : 2))}
            />
            {!img && !error && <p className="cropper__loading">Opening photo…</p>}
          </div>

          <div className="cropper__controls">
            {error && <p role="alert" style={{ color: 'var(--color-error)' }}>{error}</p>}
            <label className="field">
              <span className="field__label">Zoom · {Math.round(zoom * 100)}%</span>
              <input type="range" min="1" max={MAX_ZOOM} step="0.01" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
            </label>
            <label className="field">
              <span className="field__label">Straighten · {fine > 0 ? '+' : ''}{fine}°</span>
              <input type="range" min="-45" max="45" step="0.5" value={fine} onChange={(e) => setFine(Number(e.target.value))} onDoubleClick={() => setFine(0)} />
            </label>
            <div className="cluster" style={{ gap: 'var(--space-2)' }}>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setQuarter(q => q - 1)} title="Rotate left">⟲ Rotate left</button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setQuarter(q => q + 1)} title="Rotate right">⟳ Rotate right</button>
              <button type="button" className="btn btn--ghost btn--sm" aria-pressed={flip} onClick={() => setFlip(f => !f)} title="Mirror the photo">⇋ Flip</button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={reset}>Reset</button>
            </div>
            <p className="field__hint">
              Drag the photo to move it. Scroll, pinch or use the slider to zoom; double-click to zoom in or out.
              {guides && ' The full frame is the large photo on the About page; the dashed square and circle show how it appears in the team grid and on the digital card, so keep the face inside the circle.'}
            </p>
          </div>
        </div>

        <div className="cropper__footer">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn btn--primary" onClick={save} disabled={!img || busy}>
            {busy ? 'Preparing…' : 'Use this photo'}
          </button>
        </div>
      </div>
    </div>
  , document.body)
}
