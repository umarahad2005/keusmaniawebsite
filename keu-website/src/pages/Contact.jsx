import PageHeader            from '../components/PageHeader.jsx'
import ContactInfo           from '../components/ContactInfo.jsx'
import ContactForm           from '../components/ContactForm.jsx'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'

export default function Contact() {
  useDocumentHead({
    title: 'Contact & Bookings | Karwan-e-Usmania',
    description: 'Contact Karwan-e-Usmania for Hajj & Umrah bookings. Lahore office, WhatsApp, phone & email — quick response, honest advice.',
    canonical: 'https://keusmania.vercel.app/contact',
  })
  useGsapAnimations(['contact'])

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We are here to help — السلام علیکم"
        subtitle="Reach out on WhatsApp for the fastest response, or visit our Lahore office."
        image="/images/madinah/madinah-city.jpg"
        imageAlt="Madinah city view"
      />

      <section className="section">
        <div className="container">
          <div
            className="grid"
            style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'start' }}
          >
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <div
            id="contact-map"
            style={{
              aspectRatio: '16/9',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--color-border-gold)',
              background: 'var(--color-cream)',
            }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Mansoora+Homes+Multan+Road+Lahore&hl=en&z=16&output=embed"
              style={{ width: '100%', height: '100%', border: 0 }}
              loading="lazy"
              allowFullScreen
              title="Karwan-e-Usmania Lahore office location"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  )
}
