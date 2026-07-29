import { useWaLink } from '../lib/whatsapp.js'

export default function PackageCard({ pkg }) {
  const wa = useWaLink()
  return (
    <article className="package-card" id={pkg.id} data-category={pkg.category} data-tier={pkg.tier}>
      {pkg.badge && <span className="badge badge--gold package-card__badge">{pkg.badge}</span>}
      <h3 className="package-card__title">{pkg.name}</h3>
      <p className="package-card__subtitle">{pkg.subtitle}</p>
      <div className="package-card__price">
        <span className="package-card__price-amount">{pkg.priceLabel}</span>
        {pkg.price && <span className="package-card__price-currency">/ person</span>}
      </div>
      <p className="package-card__nights">{pkg.summary}</p>
      <div className="package-card__divider" />
      <ul className="package-card__inclusions">
        {(pkg.inclusions || []).filter(Boolean).map((line, i) => (
          <li key={i} className="package-card__inclusion">{line}</li>
        ))}
      </ul>
      <a
        className="btn btn--primary btn--full package-card__cta"
        href={wa(pkg.id)}
        target="_blank"
        rel="noopener"
      >
        Book on WhatsApp
      </a>
    </article>
  )
}
