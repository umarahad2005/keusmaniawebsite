import PageHeader            from '../components/PageHeader.jsx'
import CTABanner             from '../components/CTABanner.jsx'
import JsonLd                from '../components/JsonLd.jsx'
import Img                   from '../components/Img.jsx'

import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'
import { SITE_URL }          from '../lib/brand.js'
import { useSite }           from '../lib/SiteContext.jsx'
import { useSocialFeed, paragraphs, headline } from '../lib/social.js'
import { breadcrumbSchema, organizationSchema, socialFeedSchema } from '../lib/schemas.js'

/* /updates: the live social feed (api/social): Instagram posts mirrored by the
   daily sync, plus posts added by hand in admin → Social feed. Pre-rendered
   with the posts of the build (src/lib/social.js), then refreshed in the
   browser. One <article> per post: its date, its images (a carousel scrolls
   sideways), its text with Arabic and Urdu paragraphs set right to left in
   their own faces, and the link to the post on Instagram. */

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Karachi' })
const SIZES = '(min-width: 1100px) 360px, (min-width: 700px) 50vw, 100vw'

export default function Updates() {
  const { site, packages } = useSite()
  const { feed, error, busy, loadMore } = useSocialFeed()
  const posts = feed?.posts || []
  const instagram = (site.company.socials || []).find(s => /instagram/i.test(s.name || s.icon || ''))

  useDocumentHead({
    title: 'Updates from Karwan e Usmania International | Umrah from Lahore',
    description: 'Our latest posts: Quran verses and hadith with Urdu translation, Umrah guidance and news from our office in Johar Town, Lahore.',
    keywords: 'Karwan e Usmania International Instagram, Umrah updates Lahore, Umrah posts Urdu, Quran hadith Urdu translation',
    canonical: `${SITE_URL}/updates`,
    ogImage: '/og/home.jpg',
    // An empty feed is a thin page: kept out of the index until posts exist
    // (generate-seo.js also leaves it out of sitemap.xml and llms.txt).
    noindex: !!feed && !posts.length,
  })
  useGsapAnimations(['updates'])

  return (
    <>
      <JsonLd data={[
        organizationSchema(site, packages),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Updates', url: '/updates' },
        ]),
        ...(posts.length ? [socialFeedSchema(posts)] : []),
      ]} />

      <PageHeader
        eyebrow="Updates"
        crumb="Updates"
        title="From our Instagram."
        lead="Verses, hadith and Umrah guidance we share on Instagram, in Arabic, Urdu and English."
        image="keu/makkah/makkah-city"
        imageAlt="Makkah skyline with Clock Tower"
      />

      <section className="k-section updates" data-surface="paper" aria-labelledby="updates-title">
        <div className="k-container">
          <h2 className="sr-only" id="updates-title">Latest posts</h2>

          {posts.length > 0 && (
            <div className="updates__grid">
              {posts.map(p => <UpdatePost key={p.id} post={p} />)}
            </div>
          )}

          {!feed && !error && <p className="updates__status" role="status">Loading the latest posts…</p>}
          {feed && !posts.length && (
            <p className="updates__status">
              No posts here yet. {instagram ? <>Follow us on <a className="k-link" href={instagram.url} target="_blank" rel="noopener">Instagram</a> for the latest.</> : null}
            </p>
          )}
          {!feed && error && (
            <p className="updates__status" role="alert">
              The posts could not load just now. {instagram ? <>See them on <a className="k-link" href={instagram.url} target="_blank" rel="noopener">Instagram</a>.</> : null}
            </p>
          )}

          <div className="updates__more">
            {feed?.next && (
              <button type="button" className="k-btn k-btn--ghost" onClick={loadMore} disabled={busy}>
                {busy ? 'Loading…' : 'Older posts'}
              </button>
            )}
            {instagram && posts.length > 0 && (
              <a className="k-link" href={instagram.url} target="_blank" rel="noopener">Follow us on Instagram <span aria-hidden="true">→</span></a>
            )}
          </div>
        </div>
      </section>

      <CTABanner num="" />
    </>
  )
}

function UpdatePost({ post }) {
  const title = headline(post)
  const images = post.images || []
  const label = title || 'Post from Karwan e Usmania International'
  return (
    <article className="update" id={`post-${post.id}`}>
      {images.length > 0 && (
        <figure className={`update__media${images.length > 1 ? ' update__media--carousel' : ''}`}>
          <div
            className="update__slides"
            {...(images.length > 1 ? { tabIndex: 0, role: 'group', 'aria-label': `${images.length} images, scroll sideways` } : {})}
          >
            {images.map((img, i) => (
              <Img
                key={img.src}
                src={img.src}
                alt={img.alt || (images.length > 1 ? `${label} (${i + 1} of ${images.length})` : label)}
                widths={[480, 768, 1080]}
                sizes={SIZES}
                width={img.width || 1080}
                height={img.height || 1350}
                style={img.width && img.height ? { aspectRatio: `${img.width} / ${img.height}` } : undefined}
                loading="lazy"
                decoding="async"
                className="update__img"
              />
            ))}
          </div>
          {images.length > 1 && <figcaption className="update__count">{images.length} images</figcaption>}
        </figure>
      )}
      <div className="update__body">
        <time className="update__date" dateTime={post.date}>{DATE.format(new Date(post.date))}</time>
        {paragraphs(post.text).map((par, i) => (
          par.lang === 'en'
            ? <p key={i} className="update__text">{par.text}</p>
            : <p key={i} lang={par.lang} dir="rtl" className={`update__text update__text--${par.lang}${par.lang === 'ur' ? ' nastaliq' : ''}`}>{par.text}</p>
        ))}
        {post.permalink && (
          <a className="k-link update__link" href={post.permalink} target="_blank" rel="noopener">
            {/instagram\.com/.test(post.permalink) ? 'View on Instagram' : 'View the post'} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </article>
  )
}
