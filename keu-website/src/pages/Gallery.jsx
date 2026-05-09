import PageHeader            from '../components/PageHeader.jsx'
import GalleryGrid           from '../components/GalleryGrid.jsx'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'

export default function Gallery() {
  useDocumentHead({
    title: 'Gallery — Makkah & Madinah | Karwan-e-Usmania',
    description: 'Photo gallery from our Hajj and Umrah groups — Masjid al-Haram, Masjid an-Nabawi, and the journeys in between.',
    canonical: 'https://keusmania.vercel.app/gallery',
  })
  useGsapAnimations(['gallery'])

  return (
    <>
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
