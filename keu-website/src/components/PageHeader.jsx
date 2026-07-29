/* Reusable photo-backed page header.
   Mirrors the hero pattern: background image at low opacity behind a
   navy-gold gradient overlay, with the eyebrow / title / subtitle on top. */
import Img from './Img.jsx'

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  image,         // Cloudinary public_id — e.g. keu/makkah/kaaba
  imageAlt = '',
  align = 'center',
}) {
  return (
    <header className={`page-header ${align === 'left' ? 'page-header--left' : ''}`}>
      <div className="page-header__bg" aria-hidden="true">
        {image && (
          <Img
            src={image}
            alt={imageAlt}
            widths={[768, 1200, 1600, 2048]}
            className="parallax-img"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        )}
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
