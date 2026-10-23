/* JSON-LD schema builders. Pure functions — pass data, get schema.org objects. */

import { cldUrl } from './images.js'
import { SITE_URL, BRAND, DESCRIPTION, LOGO_PATH, TAGLINE, ALT_NAMES, KNOWS_ABOUT, ogCard } from './brand.js'
import { hoursRows } from './hours.js'
import { packageAnchor, packageLength, memberUrl } from './team.js'
import { headline } from './social.js'

/* Cloudinary public_id, full URL or /public path → absolute URL. */
const absImage = (src, w) => {
  const u = cldUrl(src, { w })
  return u.startsWith('http') ? u : `${SITE_URL}${u}`
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_KEYS = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6, monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 }

/* "11:00 am" → "11:00" (24 h). */
function to24(t) {
  const m = String(t).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i)
  if (!m) return null
  let h = Number(m[1]) % 12
  if (/pm/i.test(m[3] || '')) h += 12
  if (!m[3]) h = Number(m[1])
  return `${String(h).padStart(2, '0')}:${m[2] || '00'}`
}

/* Admin hours rows ("Mon – Fri" / "11:00 am – 7:00 pm") → OpeningHoursSpecification.
   Rows that cannot be parsed, and closed days, are left out. */
export function openingHours(hours) {
  return hoursRows(hours).flatMap(({ days, time }) => {
    const [o, c] = String(time).split(/\s*[–-]\s*/)
    const opens = to24(o || ''), closes = to24(c || '')
    if (!opens || !closes) return []
    const keys = String(days).toLowerCase().split(/\s*[–-]\s*/).map(d => DAY_KEYS[d.trim().slice(0, 3)] ?? DAY_KEYS[d.trim()])
    if (keys.some(k => k == null)) return []
    const range = keys.length === 2 ? DAYS.slice(keys[0], keys[1] + 1) : [DAYS[keys[0]]]
    return [{ '@type': 'OpeningHoursSpecification', dayOfWeek: range, opens, closes }]
  })
}

/* "PKR 78,500" … "PKR 375,000" → "PKR 78,500 – PKR 375,000" from the live labels;
   undefined when no label carries a figure. The numeric price field is never trusted. */
export function priceRange(packages = []) {
  const nums = packages
    .map(p => Number(String(p.priceLabel || '').replace(/[^\d]/g, '')))
    .filter(n => n >= 1000)
  if (!nums.length) return undefined
  const f = n => `PKR ${n.toLocaleString('en-US')}`
  const lo = Math.min(...nums), hi = Math.max(...nums)
  return lo === hi ? f(lo) : `${f(lo)} – ${f(hi)}`
}

export function organizationSchema(site, packages = []) {
  const c = site.company
  const address = {
    '@type': 'PostalAddress',
    streetAddress: c.address?.street,
    addressLocality: c.address?.city,
    addressCountry: 'PK',
  }
  if (c.address?.postalCode) address.postalCode = c.address.postalCode
  return {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: BRAND,
    alternateName: ALT_NAMES,
    description: DESCRIPTION,
    slogan: c.tagline || TAGLINE,
    knowsAbout: KNOWS_ABOUT,
    url: SITE_URL,
    logo: `${SITE_URL}${LOGO_PATH}`,
    image: ogCard('home'),
    telephone: c.landline || c.phone,
    email: c.email,
    foundingDate: String(c.founded || 2005),
    address,
    areaServed: { '@type': 'Country', name: 'Pakistan' },
    priceRange: priceRange(packages),
    openingHoursSpecification: openingHours(c.hours),
    sameAs: (c.socials || []).map(s => s.url).filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${String(c.whatsapp || '').replace(/\D/g, '')}`,
      contactType: 'customer support',
      areaServed: 'PK',
      availableLanguage: ['en', 'ur'],
    },
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND,
    description: DESCRIPTION,
    inLanguage: 'en-PK',
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  }
}

/** TouristTrip with Offer per package. The price comes from the label the
    owner typed ("PKR 78,500"); the numeric `price` field is never trusted.
    The @id and URL fragment use packageAnchor() ("Star Package" → star-package),
    the same id the card and the footer link use. `duration` comes from
    packageLength(): the days the package names ("21 days" → P21D), else the
    admin's nights plus the day of arrival (14 nights → P15D); left out when
    neither is set. */
export function packageSchema(pkg) {
  const amount = Number(String(pkg.priceLabel || '').replace(/[^\d]/g, ''))
  const url = `${SITE_URL}/packages#${packageAnchor(pkg)}`
  const inclusions = (pkg.inclusions || []).filter(Boolean).slice(0, 4)
  const description = [pkg.subtitle, inclusions.length ? `Includes: ${inclusions.join(', ')}` : '']
    .map(t => String(t || '').trim()).filter(Boolean).join('. ')
  const soldOut = pkg.soldOut ? 'https://schema.org/SoldOut' : null
  const length = packageLength(pkg)
  const days = length ? length.days || length.nights + 1 : 0
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': url,
    name: String(pkg.name || '').trim(),
    description: description || undefined,
    touristType: 'Umrah pilgrimage',
    duration: days > 0 ? `P${days}D` : undefined,
    provider: { '@id': `${SITE_URL}/#organization` },
    image: ogCard('packages'),
    offers: amount >= 1000 ? {
      '@type': 'Offer',
      price: amount,
      priceCurrency: 'PKR',
      availability: soldOut || 'https://schema.org/InStock',
      url,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: amount,
        priceCurrency: 'PKR',
        unitText: 'per person',
      },
    } : {
      '@type': 'Offer',
      url,
      availability: soldOut || 'https://schema.org/PreOrder',
      description: 'Price on request',
    },
  }
}

/* The list carries the one @context; nested items never repeat it. */
export function packageListSchema(packages) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: packages.map((p, i) => {
      const { '@context': _, ...item } = packageSchema(p)
      return { '@type': 'ListItem', position: i + 1, item }
    }),
  }
}

export function aboutPageSchema(site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_URL}/about#aboutpage`,
    name: `About ${BRAND}`,
    url: `${SITE_URL}/about`,
    about: { '@id': `${SITE_URL}/#organization` },
    // The page is about the one organization node (no second, anonymous copy);
    // the team are listed as people who work for it, each with their card page.
    mainEntity: { '@id': `${SITE_URL}/#organization` },
    mentions: (site.team || []).filter(m => m && m.name).map(m => ({
      '@type': 'Person',
      name: m.name,
      jobTitle: m.role,
      url: memberUrl(m),
      image: m.photo ? absImage(m.photo, 640) : undefined,
      worksFor: { '@id': `${SITE_URL}/#organization` },
    })),
  }
}

export function imageGallerySchema(site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${SITE_URL}/gallery#gallery`,
    name: `${BRAND} Gallery`,
    url: `${SITE_URL}/gallery`,
    image: (site.gallery || []).map(g => ({
      '@type': 'ImageObject',
      contentUrl: absImage(g.src, 1600),
      caption: g.alt,
    })),
  }
}

/** Speakable schema — voice-search hint about what to read aloud, on the
    page's own WebPage node (path is the page's URL path). */
export function speakableSchema(path = '/') {
  const url = `${SITE_URL}${path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.section-heading__title', '.hero__title', '.faq-item__q'],
    },
  }
}

/* Answers with a claim the site must not make ("100% approval rate") stay out
   of the structured data until the owner fixes them in admin → FAQs
   (scripts/apply-trust-fixes.mjs). Same rule in generate-seo.js. */
const UNBACKED = /100\s*%/

/** FAQPage for /faq, the one URL that marks the questions up (Home and
    Packages show subsets without it). */
export function faqPageSchema(faqs) {
  faqs = faqs.filter(f => !UNBACKED.test(`${f.q} ${f.a}`))
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/faq#faqpage`,
    url: `${SITE_URL}/faq`,
    name: `Umrah questions and answers | ${BRAND}`,
    inLanguage: 'en-PK',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

/** Article for a guide page (/guides/<slug>). datePublished is the guide's
    fixed `published` day, dateModified its latest `reviewed` day; written and
    published by the organization. */
export function guideSchema(guide) {
  const url = `${SITE_URL}/guides/${guide.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: guide.title,
    description: guide.description,
    url,
    mainEntityOfPage: url,
    image: ogCard(guide.og || 'packages'),
    datePublished: guide.published || guide.reviewed,
    dateModified: guide.reviewed || guide.published,
    inLanguage: 'en-PK',
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  }
}

/** CollectionPage for /guides: the index, pointing at each guide's Article. */
export function guidesIndexSchema(guides) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/guides#collection`,
    name: `Umrah guides | ${BRAND}`,
    url: `${SITE_URL}/guides`,
    inLanguage: 'en-PK',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    hasPart: guides.map(g => ({ '@id': `${SITE_URL}/guides/${g.slug}#article` })),
  }
}

/** ItemList of SocialMediaPosting for /updates: one item per post, in the
    order shown, each with its images and text. A post's own URL is its
    Instagram permalink when it has one, else its anchor on /updates. */
export function socialFeedSchema(posts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/updates#feed`,
    name: `Updates | ${BRAND}`,
    url: `${SITE_URL}/updates`,
    itemListElement: posts.map((p, i) => {
      const url = p.permalink || `${SITE_URL}/updates#post-${p.id}`
      const title = headline(p)
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SocialMediaPosting',
          '@id': `${SITE_URL}/updates#post-${p.id}`,
          url,
          headline: title || undefined,
          articleBody: p.text || undefined,
          datePublished: p.date,
          image: (p.images || []).map(img => ({
            '@type': 'ImageObject',
            contentUrl: absImage(img.src, 1080),
            caption: img.alt || title || undefined,
          })),
          author: { '@id': `${SITE_URL}/#organization` },
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
      }
    }),
  }
}
