import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageHeader            from '../components/PageHeader.jsx'
import PackagesGrid          from '../components/PackagesGrid.jsx'
import QafilaSection         from '../components/QafilaSection.jsx'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'

export default function Packages() {
  useDocumentHead({
    title: 'Hajj & Umrah Packages | Karwan-e-Usmania',
    description: 'Browse Economy, Premium and VIP Hajj and Umrah packages from Lahore. Transparent pricing, 4★ & 5★ hotels, all-inclusive — book on WhatsApp.',
    canonical: 'https://keusmania.vercel.app/packages',
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
      <PageHeader
        eyebrow="Our Packages"
        title="Hajj & Umrah, the way it should be."
        subtitle="Filter by category — every package is fully transparent and inclusive."
        image="/images/makkah/kaaba.jpg"
        imageAlt="Kaaba surrounded by pilgrims"
      />

      <section className="section">
        <div className="container">
          <PackagesGrid showFilters={true} />
        </div>
      </section>

      <QafilaSection />
    </>
  )
}
