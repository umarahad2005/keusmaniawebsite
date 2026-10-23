import PageHeader            from '../components/PageHeader.jsx'
import { ContactLetterhead, WhatsAppRows } from '../components/ContactInfo.jsx'
import ContactForm           from '../components/ContactForm.jsx'
import JsonLd                from '../components/JsonLd.jsx'

import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'
import { SITE_URL }          from '../lib/brand.js'
import { useSite }           from '../lib/SiteContext.jsx'
import { breadcrumbSchema, organizationSchema } from '../lib/schemas.js'

/* Contact (DESIGN-LANGUAGE §5.2): the letterhead block, WhatsApp topic rows,
   then the form (7 columns) beside the map (5 columns, Johar Town).
   Phone order: contact, WhatsApp rows, form, map. */
export default function Contact() {
  const { site, packages } = useSite()
  const a = site.company?.address || {}
  const mapQuery = encodeURIComponent([a.street, a.city, a.country].filter(Boolean).join(', ') || 'Usman Plaza, 436-G1, Johar Town, Lahore')

  useDocumentHead({
    title: 'Contact & Bookings | Karwan e Usmania International, Lahore',
    description: 'Contact Karwan e Usmania International for Umrah bookings. Office No. 2, Usman Plaza, 436-G1, Johar Town, Lahore. WhatsApp +92 331 4950665. Open Monday to Friday 11 am–7 pm, Saturday 11 am–5 pm.',
    keywords: 'Karwan e Usmania International contact, Umrah booking Lahore, Umrah WhatsApp Pakistan, Johar Town travel agency',
    canonical: `${SITE_URL}/contact`,
    ogImage: '/og/contact.jpg',
  })
  useGsapAnimations(['contact'])

  return (
    <>
      <JsonLd data={[
        organizationSchema(site, packages),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]),
      ]} />

      <PageHeader
        eyebrow="Contact"
        title="We are here to help"
        arabic="السلام علیکم"
        lead="WhatsApp is the fastest way to reach us, or visit our office in Johar Town, Lahore."
        image="keu/madinah/madinah-city"
        imageAlt="Madinah city view"
      />

      <section className="k-section contact" data-surface="paper" aria-label="Contact details">
        <div className="k-container contact__grid">
          <div className="contact__letter" data-reveal="block"><ContactLetterhead /></div>
          <div className="contact__wa" data-reveal="t1"><WhatsAppRows /></div>
          <div className="contact__form"><ContactForm /></div>
          <div className="contact__map" id="contact-map">
            <iframe
              src={`https://maps.google.com/maps?q=${mapQuery}&hl=en&z=16&output=embed`}
              loading="lazy"
              allowFullScreen
              title="Map: Karwan e Usmania International office, Johar Town, Lahore"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  )
}
