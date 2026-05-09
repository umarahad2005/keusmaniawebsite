import PageHeader            from '../components/PageHeader.jsx'
import GalleryGrid           from '../components/GalleryGrid.jsx'
import JsonLd                from '../components/JsonLd.jsx'

import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'
import { useSite }           from '../lib/SiteContext.jsx'
import { breadcrumbSchema, imageGallerySchema } from '../lib/schemas.js'

export default function Gallery() {
  const { site } = useSite()

  useDocumentHead({
    title: 'Gallery — Makkah & Madinah | Karwan-e-Usmania',
    description: 'Photo gallery from our Hajj and Umrah groups — Masjid al-Haram, Masjid an-Nabawi, the Kaaba, and pilgrims from Lahore making the sacred journey.',
    keywords: 'Makkah photos, Madinah photos, Hajj gallery, Umrah memories, Karwan-e-Usmania pilgrims',
    canonical: 'https://keusmania.vercel.app/gallery',
    ogImage: '/images/makkah/masjid-al-haram.jpg',
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
        subtitle="Photos & moments shared by our pilgrims."
        image="/images/makkah/masjid-al-haram.jpg"
        imageAlt="Masjid al-Haram during Tawaf"
      />

      <section className="section">
        <div className="container">
          <GalleryGrid />
        </div>
      </section>
    </>
  )
}
