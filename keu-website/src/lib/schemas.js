/* JSON-LD schema builders. Pure functions — pass data, get schema.org objects. */

const SITE_URL = 'https://keusmania.vercel.app'

export function organizationSchema(site) {
  const c = site.company
  return {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: c.name,
    alternateName: 'Karwan e Usmania',
    description: 'Premium Hajj and Umrah services from Lahore, Pakistan',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: c.phone,
    email: c.email,
    foundingDate: '2005',
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.address.street,
      addressLocality: c.address.city,
      addressCountry: 'PK',
      postalCode: c.address.postalCode,
    },
    areaServed: { '@type': 'Country', name: 'Pakistan' },
    priceRange: 'PKR 185,000 - PKR 550,000',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        opens: '09:00', closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '11:00', closes: '16:00',
      },
    ],
    sameAs: c.socials.map(s => s.url),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${c.whatsapp}`,
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
    name: 'Karwan-e-Usmania',
    description: 'Premium Hajj and Umrah travel from Lahore',
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

/** TouristTrip with Offer per package. */
export function packageSchema(pkg) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${SITE_URL}/packages#${pkg.id}`,
    name: pkg.name,
    description: `${pkg.subtitle}. ${pkg.summary}. Includes: ${pkg.inclusions.slice(0, 4).join(', ')}.`,
    touristType: pkg.category === 'hajj' ? 'Hajj pilgrimage' : 'Umrah pilgrimage',
    provider: { '@id': `${SITE_URL}/#organization` },
    image: `${SITE_URL}/images/makkah/kaaba.jpg`,
    offers: pkg.price ? {
      '@type': 'Offer',
      price: pkg.price,
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/packages#${pkg.id}`,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: pkg.price,
        priceCurrency: 'PKR',
        unitText: 'per person',
      },
    } : {
      '@type': 'Offer',
      url: `${SITE_URL}/packages#${pkg.id}`,
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
    name: 'About Karwan-e-Usmania',
    url: `${SITE_URL}/about`,
    about: { '@id': `${SITE_URL}/#organization` },
    mainEntity: {
      '@type': 'Organization',
      name: site.company.name,
      foundingDate: String(site.company.founded),
      employee: (site.team || []).map(m => ({
        '@type': 'Person',
        name: m.name,
        jobTitle: m.role,
        image: m.photo?.startsWith('http') ? m.photo : `${SITE_URL}${m.photo}`,
      })),
    },
  }
}

export function imageGallerySchema(site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${SITE_URL}/gallery#gallery`,
    name: 'Karwan-e-Usmania Gallery',
    url: `${SITE_URL}/gallery`,
    image: (site.gallery || []).map(g => ({
      '@type': 'ImageObject',
      contentUrl: g.src.startsWith('http') ? g.src : `${SITE_URL}${g.src}`,
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
