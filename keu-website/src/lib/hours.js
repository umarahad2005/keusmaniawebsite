/* Office hours rows for the footer, menu, CTA band and Contact.
   Owner hours (2026-10-10): Mon–Fri 11 am – 7 pm, Saturday 11 am – 5 pm,
   Sunday closed, Pakistan time. "Sunday: Closed" is added only when the saved
   hours do not already mention Sunday. */
export function hoursRows(hours = []) {
  const rows = (hours || []).filter(h => h && h.days)
  const hasSunday = rows.some(h => /sun/i.test(h.days))
  return hasSunday ? rows : [...rows, { days: 'Sunday', time: 'Closed' }]
}
