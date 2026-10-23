/* The /updates feed: Instagram calls, the Cloudinary mirror and caption
   cleaning. Used by api/social and scripts/import-social-exports.mjs.

   Instagram API with Instagram Login (graph.instagram.com, permission
   instagram_business_basic). The owner pastes a long-lived token from the Meta
   app dashboard (docs/SOCIAL-FEED.md); it lasts 60 days and every refresh
   starts a new 60 days, so the daily sync refreshes it once it is a week old. */
import { v2 as cloudinary } from 'cloudinary'

export const IG_API = 'https://graph.instagram.com'
export const SOCIAL_FOLDER = 'keu/social'
export const REFRESH_AFTER_MS = 7 * 24 * 60 * 60 * 1000
/* How many posts can sit pinned at the top of /updates (api/social/[id].js refuses more). */
export const PINNED_MAX = 6
const TOKEN_LIFETIME_S = 60 * 24 * 60 * 60

const MEDIA_FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_url,media_type,thumbnail_url}'

/* An Instagram error with the token scrubbed from anything that could echo it. */
export class InstagramError extends Error {
  constructor(message, { code, status } = {}) {
    super(message)
    this.name = 'InstagramError'
    this.code = code
    this.status = status
  }
}

async function igGet(url, token) {
  const scrub = (s) => String(s || '').split(token).join('***')
  let res
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  } catch (err) {
    throw new InstagramError(`Instagram could not be reached: ${scrub(err?.message)}`)
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok || body.error) {
    const e = body.error || {}
    // 190: the token expired, was revoked or is not an Instagram Login token.
    const msg = e.code === 190
      ? 'Instagram rejected the token (expired, revoked or the wrong kind). Paste a new one.'
      : `Instagram answered ${res.status}: ${scrub(e.message || 'unknown error')}`
    throw new InstagramError(msg, { code: e.code, status: res.status })
  }
  return body
}

const withToken = (path, token, params = {}) => {
  const u = new URL(path, IG_API)
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v)
  u.searchParams.set('access_token', token)
  return u.toString()
}

/** { userId, username } of the account the token belongs to. */
export async function igAccount(token) {
  const me = await igGet(withToken('/me', token, { fields: 'user_id,username' }), token)
  return { userId: String(me.user_id || me.id || ''), username: me.username || '' }
}

/** A fresh long-lived token: { token, expiresAt }. Instagram refuses tokens younger than 24 h. */
export async function igRefresh(token) {
  const r = await igGet(withToken('/refresh_access_token', token, { grant_type: 'ig_refresh_token' }), token)
  return {
    token: r.access_token,
    expiresAt: new Date(Date.now() + (Number(r.expires_in) || TOKEN_LIFETIME_S) * 1000),
  }
}

export const estimatedExpiry = () => new Date(Date.now() + TOKEN_LIFETIME_S * 1000)

/** Newest-first media until `isKnown(id)` is true or `max` items are read. */
export async function igRecentMedia(token, isKnown, max = 100) {
  const out = []
  let url = withToken('/me/media', token, { fields: MEDIA_FIELDS, limit: '25' })
  while (url && out.length < max) {
    const page = await igGet(url, token)
    for (const m of page.data || []) {
      if (await isKnown(String(m.id))) return out
      out.push(m)
      if (out.length >= max) return out
    }
    url = page.paging?.next || null
  }
  return out
}

/* ---------- Cloudinary mirror ---------- */

let configured = false
/* The same server config as api/upload-signature.js; trim() for pasted values. */
export function cloudinaryReady() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const key = process.env.CLOUDINARY_API_KEY?.trim()
  const secret = process.env.CLOUDINARY_API_SECRET?.trim()
  if (!cloud || !key || !secret) throw new Error('CLOUDINARY_CLOUD_NAME is not set')
  if (!configured) { cloudinary.config({ cloud_name: cloud, api_key: key, api_secret: secret }); configured = true }
  return cloudinary
}

/** Upload a URL or local file to keu/social/<name>; an existing copy is kept (overwrite: false). */
export async function mirrorImage(source, name) {
  const cld = cloudinaryReady()
  const r = await cld.uploader.upload(source, {
    public_id: `${SOCIAL_FOLDER}/${name}`,
    overwrite: false,
    resource_type: 'image',
  })
  return { src: r.public_id, width: r.width, height: r.height }
}

/* The images of one Instagram media item: every carousel child, or the post's
   own image; a video contributes its thumbnail. */
export function igImageSources(m) {
  const one = (x) => (x.media_type === 'VIDEO' ? x.thumbnail_url : x.media_url)
  const kids = m.children?.data || []
  return (kids.length ? kids.map(one) : [one(m)]).filter(Boolean)
}

/** Mirror an Instagram item to Cloudinary as ig-<id>, ig-<id>-2, … */
export async function mirrorMedia(m) {
  const sources = igImageSources(m)
  const images = []
  for (let i = 0; i < sources.length; i++) {
    images.push({ ...(await mirrorImage(sources[i], i ? `ig-${m.id}-${i + 1}` : `ig-${m.id}`)), alt: '' })
  }
  return images
}

/* ---------- Captions ---------- */

/* Lines that belong to the contact footer every caption carries (numbers,
   links, the office address, hours), not to the post itself. */
const FOOTER_LINE = [
  /wa\.me\//i,
  /instagram\.com|facebook\.com|tiktok\.com|youtube\.com/i,
  /^\s*(whatsapp|instagram|facebook|call|phone|email|website|visit us|office)\b/i,
  /\+92[\s\d-]{8,}/,
  /usman plaza|johar town/i,
  /\b(mon|peer)\s*[–-]\s*(fri|juma)\b/i,
]
const HASHTAG = /(^|\s)#[\p{L}\p{M}\p{N}_]+/gu

/** The caption as the site shows it: no contact footer, no hashtags. */
export function cleanCaption(caption = '') {
  return String(caption)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .filter(line => !FOOTER_LINE.some(re => re.test(line)))
    .map(line => line.replace(HASHTAG, '').replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/* ---------- Public shape ---------- */

/** What the public feed and the pre-render receive for a post (no raw caption, no flags). */
export function publicPost(p) {
  return {
    id: String(p._id),
    source: p.source,
    mediaType: p.mediaType,
    images: (p.images || []).map(({ src, alt, width, height }) => ({ src, alt, width, height })),
    text: p.text,
    permalink: p.permalink,
    date: new Date(p.publishAt || p.postedAt).toISOString(),
    pinned: !!p.pinned,
  }
}
