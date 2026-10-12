import PageHeader            from '../components/PageHeader.jsx'
import GalleryGrid           from '../components/GalleryGrid.jsx'
import JsonLd                from '../components/JsonLd.jsx'

import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'
import { SITE_URL }          from '../lib/brand.js'
import { useSite }           from '../lib/SiteContext.jsx'
import { useWaLink }         from '../lib/whatsapp.js'
import { breadcrumbSchema, imageGallerySchema } from '../lib/schemas.js'

export default function Gallery() {
  const { site } = useSite()
  const wa = useWaLink()

  useDocumentHead({
    title: 'Gallery — Makkah & Madinah | Karwan e Usmania International',
    description: 'Photographs of Masjid al-Haram, Masjid an-Nabawi and the Kaaba from Karwan e Usmania International, Umrah from Lahore since 2005.',
    keywords: 'Makkah photos, Madinah photos, Umrah gallery, Masjid al-Haram, Masjid an-Nabawi, Karwan e Usmania International',
    canonical: `${SITE_URL}/gallery`,
    ogImage: '/og/gallery.jpg',
  })
  useGsapAnimations(['gallery'])

  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Gallery', url: '/gallery' },
        ]),
        imageGallerySchema(site),
      ]} />

      <PageHeader
        eyebrow="Gallery"
        title="Glimpses from the Haramain."
        lead="Masjid al-Haram, Masjid an-Nabawi and the cities around them."
        image="keu/makkah/masjid-al-haram"
        imageAlt="Masjid al-Haram during Tawaf"
      />

      <section className="k-section" data-surface="paper" aria-label="Photographs">
        <div className="k-container">
          <GalleryGrid />
          <p className="gallery__after">
            <a className="k-link" href={wa('umrah')} target="_blank" rel="noopener">Plan your own journey <span aria-hidden="true">→</span></a>
          </p>
        </div>
      </section>
    </>
  )
}
