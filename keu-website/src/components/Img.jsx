/* <img> that serves responsive, format-negotiated Cloudinary images.
   Falls back to a plain <img> for anything not on Cloudinary (logos, local files). */
import { cldUrl, cldSrcSet } from '../lib/images.js'

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
