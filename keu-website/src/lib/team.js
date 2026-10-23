/* Team digital cards: slugs, links and the "Save contact" vCard.
   Every field beyond name and role is optional; empty fields are left out. */
import { cldUrl } from './images.js'
import { SITE_URL, BRAND } from './brand.js'
import { waNumber } from './whatsapp.js'
import { DEFAULT_LANDLINE } from './phone.js'

export function slugify(s = '') {
  return String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'member'
}

/** A package's in-page anchor (/packages#star-package). Slugged from the
    visible name, not the raw admin id ("Star Package yaya "), so the card id,
    the footer link and the JSON-LD URL always agree and stay clean. */
export const packageAnchor = (pkg) => slugify(pkg?.name || pkg?.id)

/** How long a package is, in its own words: { days } when its name or
    subtitle gives days ("Rabi ul Awal Umrah · 21 days", whose admin `nights`
    holds the days), else { nights } from the admin field; null when unset. */
export function packageLength(pkg) {
  const d = [pkg?.name, pkg?.subtitle].join(' ').match(/\b(\d{1,3})[\s-]*days?\b/i)
  if (d) return { days: Number(d[1]), label: `${d[1]} days` }
  const n = Math.round(Number(pkg?.nights) || 0)
  return n > 0 ? { nights: n, label: `${n} nights` } : null
}

/** The member's card slug: the admin's own slug if set, else from the name. */
export const memberSlug = (m) => slugify(m?.slug || m?.name)
export const memberPath = (m) => `/team/${memberSlug(m)}`
export const memberUrl = (m) => `${SITE_URL}${memberPath(m)}`

export function findMember(team = [], slug) {
  return (team || []).find(m => m && m.name && memberSlug(m) === slug) || null
}

/* vCard text escaping: backslash, newline, comma and semicolon. */
const esc = (v = '') => String(v)
  .replace(/\\/g, '\\\\')
  .replace(/\r?\n/g, '\\n')
  .replace(/([,;])/g, '\\$1')

/** vCard 3.0 text for a member (widely supported by iOS and Android contacts). */
export function memberVCard(m, company = {}) {
  const parts = String(m.name || '').trim().split(/\s+/)
  const last = parts.length > 1 ? parts.pop() : ''
  const first = parts.join(' ')
  const a = company.address || {}
  const photo = m.photo ? cldUrl(m.photo, { w: 400, h: 400, crop: 'fill', gravity: 'face' }) : ''
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(last)};${esc(first)};;;`,
    `FN:${esc(m.name)}`,
    `ORG:${esc(BRAND)}`,
    m.role && `TITLE:${esc(m.role)}`,
    m.phone && `TEL;TYPE=CELL,VOICE:+${waNumber(m.phone)}`,
    m.whatsapp && m.whatsapp !== m.phone && `TEL;TYPE=CELL:+${waNumber(m.whatsapp)}`,
    `TEL;TYPE=WORK,VOICE:+${waNumber(company.landline || DEFAULT_LANDLINE)}`,
    m.email && `EMAIL;TYPE=INTERNET,WORK:${m.email}`,
    `ADR;TYPE=WORK:;;${esc(a.street || '')};${esc(a.city || '')};;${esc(a.postalCode || '')};${esc(a.country || '')}`,
    `URL:${memberUrl(m)}`,
    photo.startsWith('http') && `PHOTO;VALUE=URI:${photo}`,
    m.bio && `NOTE:${esc(m.bio)}`,
    'END:VCARD',
  ].filter(Boolean)
  return lines.join('\r\n') + '\r\n'
}

export function downloadVCard(m, company) {
  const blob = new Blob([memberVCard(m, company)], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = Object.assign(document.createElement('a'), { href: url, download: `${memberSlug(m)}.vcf` })
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
