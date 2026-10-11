/* Inner page header, split (DESIGN-LANGUAGE §4 PageHeader). On paper:
   breadcrumb, running head, H1 and lead on the left; the still on the right in a
   20 px inset frame with the letterhead corner device. No type ever sits on the
   image. ≤56vh. The still opens with T3; the copy is painted from the start.
   `data-page-header` is the sentinel the FAB and thumb bar watch. */
import { Link } from 'react-router-dom'
import Img from './Img.jsx'

export default function PageHeader({
  eyebrow,
  title,
  lead,
  subtitle,       // alias of lead
  arabic,         // optional Urdu/Arabic line on its own line under the H1
  image,          // Cloudinary public_id — e.g. keu/makkah/kaaba
  imageAlt = '',
  crumb,          // breadcrumb label for this page (defaults to the eyebrow)
}) {
  const text = lead ?? subtitle
  return (
    <header className="pheader" data-page-header data-surface="paper">
      <div className="k-container pheader__grid">
        <div className="pheader__copy">
          <nav className="pheader__crumbs" aria-label="Breadcrumb">
            <ol role="list">
              <li><Link to="/">Home</Link></li>
              <li aria-current="page">{crumb || eyebrow}</li>
            </ol>
          </nav>
          {eyebrow && (
            <p className="runhead">
              <span className="runhead__rule" aria-hidden="true" />
              <span className="runhead__label">{eyebrow}</span>
            </p>
          )}
          <h1 className="pheader__title">{title}</h1>
          {arabic && (
            <p className="pheader__arabic" lang="ur" dir="rtl"><span className="ar-face"><bdi>{arabic}</bdi></span></p>
          )}
          {text && <p className="pheader__lead">{text}</p>}
        </div>
        {image && (
          <figure className="pheader__media">
            <div className="pheader__frame" data-reveal="t3">
              <Img
                src={image}
                alt={imageAlt}
                widths={[480, 720, 960, 1280]}
                sizes="(max-width: 767px) calc(100vw - 32px), 45vw"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
            </div>
            <svg className="pheader__corner" viewBox="0 0 333 164" aria-hidden="true">
              <path className="pheader__corner-fill" d="M0 0H270C180 12 60 62 0 137Z" />
              <path className="pheader__corner-ribbon" d="M333 0C232 14 96 72 0 164" vectorEffect="non-scaling-stroke" />
            </svg>
          </figure>
        )}
      </div>
    </header>
  )
}
