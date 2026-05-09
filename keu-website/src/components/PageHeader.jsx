/* Reusable photo-backed page header.
   Mirrors the hero pattern: background image at low opacity behind a
   navy-gold gradient overlay, with the eyebrow / title / subtitle on top. */

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  image,         // path under /public — e.g. /images/makkah/kaaba.jpg
  imageAlt = '',
  align = 'center',
}) {
  return (
    <header className={`page-header ${align === 'left' ? 'page-header--left' : ''}`}>
      <div className="page-header__bg" aria-hidden="true">
        {image && <img src={image} alt={imageAlt} className="parallax-img" loading="eager" decoding="async" />}
        <div className="page-header__overlay" />
      </div>

      <div className="container page-header__content">
        {eyebrow && <span className="eyebrow gold-text">{eyebrow}</span>}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
    </header>
  )
}
