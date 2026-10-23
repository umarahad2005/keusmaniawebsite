/* FAQ topics for /faq (grouped) and the Packages page (its topic only).

   The FAQs live in the admin (/admin/faqs, site.faqs) as { q, a }. A row may
   carry an optional "topic" with one of the keys below to place it by hand;
   rows without one are placed by the words in the question, so a new question
   typed in the admin lands in a sensible group without any extra field.
   Order matters: the first rule that matches wins. */

export const FAQ_TOPICS = [
  { key: 'booking',  label: 'Planning and booking',        title: 'Planning and booking' },
  { key: 'packages', label: 'Packages, hotels and flights', title: 'Packages, hotels and flights' },
  { key: 'visa',     label: 'Visa and who can travel',      title: 'Visa, documents and who can travel' },
  { key: 'ground',   label: 'In Makkah and Madinah',        title: 'Transport, guides and support in Saudi Arabia' },
  { key: 'company',  label: 'About us',                     title: 'About Karwan e Usmania International' },
  { key: 'qafila',   label: 'Qafila e Shoq',                title: 'Qafila e Shoq' },
]

const RULES = [
  ['qafila',   /qafila/i],
  ['company',  /karwan e usmania|registered|pilgrims have you served|your office|appointment/i],
  ['visa',     /visa|document|vaccin|mahram|children|outside pakistan/i],
  ['ground',   /transfer|guide|ziyar|between makkah|24\/7|women-only|insurance|\bill\b/i],
  ['packages', /package|hotel|meal|room|upgrade|air ticket|\bfly\b|baggage|zamzam|cost/i],
]

const KEYS = new Set(FAQ_TOPICS.map(t => t.key))

/** The topic key for one FAQ row: its own "topic" if valid, else by keyword, else booking. */
export function faqTopic(f) {
  const own = String(f?.topic || '').trim().toLowerCase()
  if (KEYS.has(own)) return own
  const hit = RULES.find(([, re]) => re.test(String(f?.q || '')))
  return hit ? hit[0] : 'booking'
}

/** The usable FAQ rows (question and answer both set). */
export const usableFaqs = (faqs) => (faqs || []).filter(f => f && f.q && f.a)

/** [{ ...topic, faqs: [...] }] in FAQ_TOPICS order, empty groups left out. */
export function groupFaqs(faqs) {
  const rows = usableFaqs(faqs)
  return FAQ_TOPICS
    .map(t => ({ ...t, faqs: rows.filter(f => faqTopic(f) === t.key) }))
    .filter(g => g.faqs.length)
}
