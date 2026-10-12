/* <img> for site photos.

   1. Photos copied into the site by scripts/localize-images.mjs (listed in
      src/lib/localImages.json) are served from /img/ as WebP at the widths the
      page asks for: same origin, already resized, cached by the host's CDN.
      (Owner, 2026-10-12: Cloudinary's first-time resizing made photos slow.)
   2. Anything else (e.g. a photo uploaded in the admin later) uses
      Cloudinary: responsive, format-negotiated URLs.
   3. Local files and other URLs pass through untouched. */
import { cldUrl, cldSrcSet, localImage } from '../lib/images.js'

const DEFAULT_WIDTHS = [480, 768, 1200, 1600, 2048]

export default function Img({
  src,
  alt = '',
  widths = DEFAULT_WIDTHS,
  sizes = '100vw',
  w,
  h,
  crop,
  gravity,
  ...rest
}) {
  const local = localImage(src)
  if (local) {
    // Exactly the requested widths that exist locally (so a <link rel=preload>
    // with the same widths is reused); fall back to every local width.
    const want = h ? [w, w * 2].filter(Boolean) : widths
    let ws = local.widths.filter(x => want.includes(x))
    if (!ws.length) ws = local.widths
    const target = w || widths[widths.length - 1]
    const best = local.widths.find(x => x >= target) || local.widths[local.widths.length - 1]
    const file = x => `/img/${local.file}-${x}.webp`
    return (
      <img
        src={file(best)}
        srcSet={ws.length > 1 ? ws.map(x => `${file(x)} ${x}w`).join(', ') : undefined}
        sizes={ws.length > 1 ? (h ? `${w}px` : sizes) : undefined}
        alt={alt}
        {...rest}
      />
    )
  }

  const opts = { w, h, crop, gravity }
  const srcSet = h ? undefined : cldSrcSet(src, widths, opts)

  return (
    <img
      src={cldUrl(src, { ...opts, w: w || widths[widths.length - 1] })}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      {...rest}
    />
  )
}
