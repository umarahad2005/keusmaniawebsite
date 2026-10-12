/* Cloudinary URL builder.

   Accepts any of the three shapes that flow through this app:
     'keu/makkah/kaaba'                      — a public_id (site content)
     'https://res.cloudinary.com/…/x.jpg'    — a secure_url from an admin upload
     '/logo.png'  |  'https://other/x.jpg'   — anything else, passed through untouched

   f_auto lets Cloudinary serve AVIF/WebP to browsers that accept them;
   q_auto picks a quality per image. Together they typically cut these
   photos by 70-85% versus the original JPEGs. */

/* The cloud name is public — it sits in every image URL on the page. The literal
   fallback keeps images working if VITE_CLOUDINARY_CLOUD_NAME is ever missing at
   build time, which would otherwise break every image on the site at once. */
import LOCAL from './localImages.json'

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() || 'dpmnlysdt'
const BASE = `https://res.cloudinary.com/${CLOUD}/image/upload`

const UPLOAD_MARKER = '/image/upload/'

function transform({ w, h, crop, gravity }) {
  const parts = ['f_auto', 'q_auto']
  if (w) parts.push(`w_${w}`)
  if (h) parts.push(`h_${h}`)
  if (w && h) parts.push(`c_${crop || 'fill'}`, `g_${gravity || 'auto'}`)
  else if (crop) parts.push(`c_${crop}`)
  return parts.join(',')
}

/** Build a delivery URL for a public_id, or re-transform an existing Cloudinary URL. */
export function cldUrl(src, opts = {}) {
  if (!src) return src

  // Admin-uploaded images arrive as full secure_urls — splice transforms in after /upload/.
  if (src.includes('res.cloudinary.com') && src.includes(UPLOAD_MARKER)) {
    const [prefix, rest] = src.split(UPLOAD_MARKER)
    // Drop any transform segment already present so ours doesn't stack onto it.
    const clean = rest.replace(/^[a-z]{1,3}_[^/]*\//, '')
    return `${prefix}${UPLOAD_MARKER}${transform(opts)}/${clean}`
  }

  // Local files (/logo.png) and third-party URLs are not ours to transform.
  if (src.startsWith('/') || src.startsWith('http')) return src

  return `${BASE}/${transform(opts)}/${src}`
}

/** srcSet string across the given widths, for responsive <img>. */
export function cldSrcSet(src, widths, opts = {}) {
  if (!src || src.startsWith('/') || (src.startsWith('http') && !src.includes('res.cloudinary.com'))) {
    return undefined
  }
  return widths.map((w) => `${cldUrl(src, { ...opts, w })} ${w}w`).join(', ')
}

/* ---------- Local copies (scripts/localize-images.mjs) ---------- */

/** Cloudinary public id from a public id or a delivery URL (version, transforms, extension removed). */
export function publicIdOf(src = '') {
  if (!src || typeof src !== 'string') return ''
  if (!src.includes('res.cloudinary.com')) return /^keu\//.test(src) ? src.replace(/\.[a-z0-9]+$/i, '') : ''
  const rest = (src.split(UPLOAD_MARKER)[1] || '').split('?')[0]
  const parts = rest.split('/')
  while (parts.length && (/^[a-z]{1,3}_[^/]*$/.test(parts[0]) || parts[0].includes(',') || /^v\d+$/.test(parts[0]))) parts.shift()
  return parts.join('/').replace(/\.[a-z0-9]+$/i, '')
}

/** The local copy of a photo ({ file, widths, w, h }) or null. */
export function localImage(src) {
  const id = publicIdOf(src)
  return (id && LOCAL[id]) || null
}
