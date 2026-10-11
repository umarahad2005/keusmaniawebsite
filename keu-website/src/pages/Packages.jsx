import { useEffect } from 'react'
import PageHeader            from '../components/PageHeader.jsx'
import PackagesGrid          from '../components/PackagesGrid.jsx'
import QafilaSection         from '../components/QafilaSection.jsx'
import FAQSection            from '../components/FAQSection.jsx'
import CTABanner             from '../components/CTABanner.jsx'
import JsonLd                from '../components/JsonLd.jsx'

import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'
import { SITE_URL }          from '../lib/brand.js'
import { useSite }           from '../lib/SiteContext.jsx'
import { breadcrumbSchema, packageListSchema, organizationSchema } from '../lib/schemas.js'

/* Packages (DESIGN-LANGUAGE §5.2): split header, sticky filter chips over a
   ruled grid, the trust line, then the Qafila e Shoq chapter, FAQ and the
   closing letter. Hash links (/packages#<id>) are scrolled by
   useScrollRestoration once the curtain opens. */
export default function Packages() {
  const { site, packages } = useSite()

  useDocumentHead({
    title: 'Umrah Packages from Lahore | Karwan e Usmania International',
    description: 'Umrah packages from Lahore with every cost explained in writing before you commit. Hotels near the Haram, visa handled by our team, and the Qafila e Shoq spiritual journey. Book on WhatsApp.',
    keywords: 'Umrah package price Pakistan, Umrah packages Lahore, VIP Umrah Lahore, family Umrah package, Qafila e Shoq, Karwan e Usmania International',
    canonical: `${SITE_URL}/packages`,
    ogImage: '/og/packages.jpg',
  })
  useGsapAnimations(['packages'])

  // The sticky chips sit under the nav: anchor jumps and focus must clear both
  // (DESIGN-LANGUAGE §2.3). Nastaliq (115 KB) is fetched by QafilaSection only
  // as it nears the viewport, so it never competes with the header image.
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('route-packages')
    return () => html.classList.remove('route-packages')
  }, [])

  const licence = site.company?.licence

  return (
    <>
      <JsonLd data={[
        organizationSchema(site, packages),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Packages', url: '/packages' },
        ]),
        packageListSchema(packages),
      ]} />

      <PageHeader
        eyebrow="Our packages"
        crumb="Packages"
        title="Umrah, the way it should be."
        lead="Choose a package below. Every cost is explained in writing before you commit."
        image="keu/makkah/kaaba"
        imageAlt="The Kaaba surrounded by pilgrims"
      />

      <section id="packages" className="k-section packages-page" data-surface="paper" aria-labelledby="packages-title">
        <div className="k-container">
          <h2 className="sr-only" id="packages-title">All packages</h2>
          <PackagesGrid showFilters sticky />
          <p className="packages-page__trust">Prices per person · every cost explained in writing before you commit</p>
          {licence && <p className="ledger__licence">{licence}</p>}
        </div>
      </section>

      <QafilaSection />
      <FAQSection num="03" />
      <CTABanner num="04" />
    </>
  )
}
