/* Package card (DESIGN-LANGUAGE §4 PackageCard). Identical in the admin's
   360 px preview: every size variant switches on a container query, never on
   the viewport.

   Order: TIER · CATEGORY eyebrow with the badge inline, name, subtitle (with
   "N nights ·" only when the subtitle does not already say nights), priceLabel
   exactly as entered plus "per person", a hairline, inclusions (6, or 4 in a
   narrow card, then "+N more"), the summary behind "Full package details", and
   the WhatsApp button pinned to the bottom.
   The numeric `price` field is never shown, sorted or trusted (live data has 1
   and 78498 in it); "on request" is detected from the label. The element id is
   packageAnchor(pkg), shared with the footer links and the JSON-LD URL; the
   WhatsApp message stays keyed on the raw pkg.id.
   `soldOut` (set in the admin) dims the card under a round "Sold out" seal
   and turns the button into an enquiry about the next group. */
import { useWaLink } from '../lib/whatsapp.js'
import { packageAnchor } from '../lib/team.js'
import { Icon } from '../icons.jsx'

/* Round seal: double outer ring, "ALHAMDULILLAH" over the top and "GROUP FULL"
   under the bottom on the band, SOLD / OUT in the centre. The bottom text runs
   on a slightly larger radius because its letters hang inward from the path. */
function SoldOutSeal() {
  return (
    <svg className="package-card__seal" viewBox="0 0 200 200" role="img" aria-label="Sold out">
      <defs>
        <path id="seal-top" d="M 30 100 A 70 70 0 0 1 170 100" />
        <path id="seal-bottom" d="M 21 100 A 79 79 0 0 0 179 100" />
      </defs>
      <circle className="package-card__seal-fill" cx="100" cy="100" r="96" />
      <circle className="package-card__seal-line" cx="100" cy="100" r="95" strokeWidth="3" />
      <circle className="package-card__seal-line" cx="100" cy="100" r="88" strokeWidth="1.2" />
      <circle className="package-card__seal-line" cx="100" cy="100" r="62" strokeWidth="1.2" />
      <text className="package-card__seal-ring"><textPath href="#seal-top" startOffset="50%" textAnchor="middle">Alhamdulillah</textPath></text>
      <text className="package-card__seal-ring"><textPath href="#seal-bottom" startOffset="50%" textAnchor="middle">Group full</textPath></text>
      <text className="package-card__seal-star" x="25" y="104" textAnchor="middle">★</text>
      <text className="package-card__seal-star" x="175" y="104" textAnchor="middle">★</text>
      <line className="package-card__seal-line" x1="58" y1="100" x2="142" y2="100" strokeWidth="1.2" />
      <text className="package-card__seal-main" x="100" y="94" textAnchor="middle">Sold</text>
      <text className="package-card__seal-main" x="100" y="131" textAnchor="middle">Out</text>
    </svg>
  )
}

const TIER = { economy: 'Economy', premium: 'Premium', vip: 'VIP' }
const CATEGORY = { umrah: 'Umrah', ramadan_umrah: 'Ramadan', family: 'Family', hajj: 'Hajj' }

export default function PackageCard({ pkg }) {
  const wa = useWaLink()
  const label = String(pkg.priceLabel || '').trim()
  const isOnRequest = !/\d/.test(label)
  const perPerson = pkg.perPerson !== false && !isOnRequest
  const subtitle = String(pkg.subtitle || '').trim()
  const nights = Number(pkg.nights) > 0 && !/\bnights?\b/i.test(subtitle) ? `${pkg.nights} nights` : ''
  const meta = [nights, subtitle].filter(Boolean).join(' · ')
  const inclusions = (pkg.inclusions || []).map(s => String(s || '').trim()).filter(Boolean)
  const more = Math.max(0, inclusions.length - 6)
  const moreNarrow = Math.max(0, inclusions.length - 4)
  const summary = String(pkg.summary || '').trim()
  const eyebrow = [TIER[pkg.tier] || '', CATEGORY[pkg.category] || ''].filter(Boolean).join(' · ')
  const badge = String(pkg.badge || '').trim()
  const variant = pkg.tier === 'vip' ? ' package-card--vip' : isOnRequest ? ' package-card--request' : ''
  const soldOut = !!pkg.soldOut

  return (
    <article className={`package-card${variant}${soldOut ? ' package-card--sold-out' : ''}`} id={packageAnchor(pkg)} data-category={pkg.category} data-tier={pkg.tier}>
      {soldOut && <SoldOutSeal />}
      <div className="package-card__inner">
        <p className="package-card__eyebrow">
          {eyebrow && <span>{eyebrow}</span>}
          {badge && <span className="package-card__badge">{badge}</span>}
        </p>
        <h3 className="package-card__title">{pkg.name}</h3>
        {meta && <p className="package-card__meta">{meta}</p>}

        <div className="package-card__price">
          {isOnRequest
            ? <span className="package-card__amount package-card__amount--request">Price on request</span>
            : <span className="package-card__amount">{label}</span>}
          {perPerson && <span className="package-card__per">per person</span>}
        </div>

        <hr className="package-card__rule" />

        {inclusions.length > 0 && (
          <ul className="package-card__inclusions" role="list">
            {inclusions.map((line, i) => (
              <li key={i} className={`package-card__inclusion${i >= 6 ? ' is-extra' : ''}${i >= 4 ? ' is-extra-narrow' : ''}`}>
                <Icon name="check" className="k-ico package-card__check" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}

        {summary && (
          <>
            <p className="package-card__summary" aria-hidden="true">{summary}</p>
            <details className="package-card__details">
              <summary>
                {more > 0 && <span className="package-card__more package-card__more--wide">+{more} more · </span>}
                {moreNarrow > 0 && <span className="package-card__more package-card__more--narrow">+{moreNarrow} more · </span>}
                Full package details
              </summary>
              {inclusions.length > 4 && (
                <ul className="package-card__all" role="list">{inclusions.map((l, i) => <li key={i}>{l}</li>)}</ul>
              )}
              <p className="package-card__full">{summary}</p>
            </details>
          </>
        )}

        <a className="k-btn k-btn--wa package-card__cta" href={wa(pkg.id)} target="_blank" rel="noopener">
          <Icon name="whatsapp" className="k-ico" />
          {soldOut ? 'Ask about the next group' : isOnRequest ? 'Enquire on WhatsApp' : 'Book on WhatsApp'}
        </a>
      </div>
    </article>
  )
}
