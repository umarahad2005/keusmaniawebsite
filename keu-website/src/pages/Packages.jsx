import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageHeader            from '../components/PageHeader.jsx'
import PackagesGrid          from '../components/PackagesGrid.jsx'
import QafilaSection         from '../components/QafilaSection.jsx'
import FAQSection            from '../components/FAQSection.jsx'
import JsonLd                from '../components/JsonLd.jsx'

import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'
import { useSite }           from '../lib/SiteContext.jsx'
import { breadcrumbSchema, packageListSchema, organizationSchema } from '../lib/schemas.js'

export default function Packages() {
  const { site, packages } = useSite()

  useDocumentHead({
    title: 'Hajj & Umrah Packages from Lahore | Karwan-e-Usmania',
    description: 'Browse Economy (PKR 185,000), Premium (PKR 285,000), VIP (PKR 450,000), Ramadan (PKR 550,000), Family and Hajj 2025–2027 packages. Transparent pricing, 4★ & 5★ hotels near Haram, all-inclusive — book on WhatsApp.',
    keywords: 'Umrah package price Pakistan, Hajj package 2025 2026 2027, VIP Umrah Lahore, Ramadan Umrah, family umrah package, Hajj government quota Pakistan',
    canonical: 'https://keusmania.vercel.app/packages',
    ogImage: 'keu/makkah/kaaba',
  })
  useGsapAnimations(['packages'])

  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    const target = document.getElementById(id)
    if (target) setTimeout(() => target.scrollIntoView({ block: 'center', behavior: 'smooth' }), 200)
  }, [hash])

  return (
    <>
      <JsonLd data={[
        organizationSchema(site),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Packages', url: '/packages' },
        ]),
        packageListSchema(packages),
      ]} />

      <PageHeader
        eyebrow="Our Packages"
        title="Hajj & Umrah, the way it should be."
        subtitle="Filter by category — every package is fully transparent and inclusive."
        image="keu/makkah/kaaba"
        imageAlt="Kaaba surrounded by pilgrims"
      />

      <section className="section">
        <div className="container">
          <PackagesGrid showFilters={true} />
        </div>
      </section>

      <QafilaSection />
      <FAQSection />
    </>
  )
}
