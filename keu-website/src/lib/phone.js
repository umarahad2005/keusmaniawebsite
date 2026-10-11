/* Display formatting for Pakistani numbers stored in any shape
   ("+92-333-4883578", "923334883578", "+924235136177"). */
import { waNumber } from './whatsapp.js'

export const DEFAULT_LANDLINE = '+924235136177'

export function formatPk(raw) {
  const d = waNumber(raw)
  if (d.startsWith('9242') && d.length === 12) return `+92 42 ${d.slice(4, 12)}`
  if (d.startsWith('92') && d.length === 12) return `+92 ${d.slice(2, 5)} ${d.slice(5)}`
  return raw
}

export const telHref = (raw) => `tel:+${waNumber(raw)}`
