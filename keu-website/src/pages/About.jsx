import { useSite } from '../lib/SiteContext.jsx'
import PageHeader            from '../components/PageHeader.jsx'
import SectionHeading        from '../components/SectionHeading.jsx'
import WhyChooseUs           from '../components/WhyChooseUs.jsx'
import TeamGrid              from '../components/TeamGrid.jsx'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'

export default function About() {
  const { site } = useSite()
  useDocumentHead({
    title: 'About Us | Karwan-e-Usmania',
    description: 'Karwan-e-Usmania has served pilgrims from Lahore since 2005. Saudi-approved partners on the ground in Makkah & Madinah.',
    canonical: 'https://keusmania.vercel.app/about',
  })
  useGsapAnimations(['about'])

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="A Karwan rooted in service."
        subtitle="Eighteen years of walking with pilgrims — from Lahore to the Haramain and back home."
        image="/images/madinah/prophets-mosque.jpg"
        imageAlt="Masjid an-Nabawi at sunset"
      />

      <section className="section">
        <div className="container">
          <SectionHeading bismillah="بِسْمِ اللَّهِ" title="Our Story" align="left" />
          <div className="about-story">
            <div className="about-story__copy">
              {site.about.story.map((p, i) => <p key={i} className="lead mt-4">{p}</p>)}
            </div>
            <div className="about-story__media">
              <img src={site.about.storyImage} alt={site.about.storyImageAlt} loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream section--pattern">
        <div className="container">
          <SectionHeading title="Why Choose Us" />
          <WhyChooseUs wrapped={false} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            bismillah="اَلْكَرْوَانُ"
            title="Meet the Karwan"
            subtext="The team that walks with you on every step of the journey."
          />
          <TeamGrid />
        </div>
      </section>
    </>
  )
}
