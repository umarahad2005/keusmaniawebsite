/* The team numbers listed under the office numbers in the footer.

   Admin → Company → "Footer contact numbers" saves them as
   `company.footerNumbers` ([{ number, name }], in the order shown). Until
   that list is saved, they come from the team list, as before (owner,
   2026-10-12): every member's WhatsApp/mobile, minus the two office numbers,
   each labelled with the member's first name. */
import { waNumber } from './whatsapp.js'
import { DEFAULT_LANDLINE } from './phone.js'

const isEmail = (v) => /@/.test(String(v || ''))

// "Muhammad Mawiz Usmani" → "Mawiz", "Abdul Rahman Khan" → "Abdul Rahman", else the first name.
const firstName = (name) => {
  const w = String(name || '').trim().split(/\s+/)
  return w[0] === 'Muhammad' && w[1] ? w[1] : /^abd/i.test(w[0]) && w[1] ? `${w[0]} ${w[1]}` : w[0]
}

/** The list the team page implies, for the admin's "Start from the team list". */
export function teamFooterNumbers(site) {
  const c = site.company || {}
  const shown = new Set([waNumber(c.landline || DEFAULT_LANDLINE), waNumber(c.whatsapp || c.phone)])
  const out = []
  for (const m of site.team || []) {
    const number = m.whatsapp || m.phone
    if (!number || isEmail(number)) continue
    const digits = waNumber(number)
    if (!digits || shown.has(digits)) continue
    shown.add(digits)
    out.push({ number, name: firstName(m.name) })
  }
  return out
}

/** What the footer shows: the admin's list when saved, else the team-derived one. */
export function footerNumbers(site) {
  const saved = site.company?.footerNumbers
  const list = Array.isArray(saved) ? saved : teamFooterNumbers(site)
  return list
    .map(({ number, name }) => ({ number: String(number || '').trim(), name: String(name || '').trim(), digits: waNumber(number) }))
    .filter(t => t.number && !isEmail(t.number) && t.digits)
}
