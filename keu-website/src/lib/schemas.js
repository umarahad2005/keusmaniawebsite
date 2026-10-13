/* JSON-LD schema builders. Pure functions — pass data, get schema.org objects. */

import { cldUrl } from './images.js'
import { SITE_URL, BRAND, DESCRIPTION, LOGO_PATH, ogCard } from './brand.js'
import { hoursRows } from './hours.js'
import { packageAnchor, memberUrl } from './team.js'

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
    alternateName: ['Karwan e Usmania', 'Karwan e Usmania International Travel & Tours'],
    description: DESCRIPTION,
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
    the same id the card and the footer link use. */
export function packageSchema(pkg) {
  const amount = Number(String(pkg.priceLabel || '').replace(/[^\d]/g, ''))
  const url = `${SITE_URL}/packages#${packageAnchor(pkg)}`
  const inclusions = (pkg.inclusions || []).filter(Boolean).slice(0, 4)
  const description = [pkg.subtitle, inclusions.length ? `Includes: ${inclusions.join(', ')}` : '']
    .map(t => String(t || '').trim()).filter(Boolean).join('. ')
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': url,
    name: String(pkg.name || '').trim(),
    description: description || undefined,
    touristType: 'Umrah pilgrimage',
    provider: { '@id': `${SITE_URL}/#organization` },
    image: ogCard('packages'),
    offers: amount >= 1000 ? {
      '@type': 'Offer',
      price: amount,
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
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
      availability: 'https://schema.org/PreOrder',
      description: 'Price on request',
    },
  }
}

export function packageListSchema(packages) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: packages.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: packageSchema(p),
    })),
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

/** Speakable schema — voice-search hint about what to read aloud. */
export function speakableSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.section-heading__title', '.hero__title', '.faq-item__q'],
    },
  }
}
