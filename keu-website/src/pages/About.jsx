import { useSite } from '../lib/SiteContext.jsx'
import PageHeader            from '../components/PageHeader.jsx'
import SectionHeading        from '../components/SectionHeading.jsx'
import StatsSection          from '../components/StatsSection.jsx'
import WhyChooseUs           from '../components/WhyChooseUs.jsx'
import TeamGrid              from '../components/TeamGrid.jsx'
import CTABanner             from '../components/CTABanner.jsx'
import JsonLd                from '../components/JsonLd.jsx'
import Img                   from '../components/Img.jsx'

import { useGsapAnimations } from '../hooks/useGsapAnimations.js'
import { useDocumentHead }   from '../lib/useDocumentHead.js'
import { SITE_URL }          from '../lib/brand.js'
import { aboutPageSchema, breadcrumbSchema, organizationSchema } from '../lib/schemas.js'

/* About (DESIGN-LANGUAGE §5.2): story beside an arch, story[3] pulled out
   between hairlines, the ledger, why us as one row, the team, the closing letter. */
export default function About() {
  const { site, packages } = useSite()
  const story = site.about?.story || []
  const pull = story[3]
  const body = story.filter((_, i) => i !== 3)

  useDocumentHead({
    title: 'About Us — Serving Pilgrims Since 2005 | Karwan e Usmania International',
    description: 'Karwan e Usmania International · Travel & Tours has served pilgrims from Lahore since 2005, with trusted partners on the ground in Makkah and Madinah. Meet the team and read our story.',
    keywords: 'Karwan e Usmania International about, Umrah operator Lahore, Umrah travel agency Johar Town, Pirzada Burhan Usmani',
    canonical: `${SITE_URL}/about`,
    ogImage: '/og/about.jpg',
  })
  useGsapAnimations(['about'])

  return (
    <>
      <JsonLd data={[
        organizationSchema(site, packages),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]),
        aboutPageSchema(site),
      ]} />

      <PageHeader
        eyebrow="About us"
        crumb="About"
        title="A Karwan rooted in service."
        lead="Twenty-one years of walking with pilgrims, from Lahore to the Haramain and back home."
        image="keu/madinah/prophets-mosque"
        imageAlt="Masjid an-Nabawi at sunset"
      />

      <section id="story" className="k-section story" data-surface="paper" aria-labelledby="story-title">
        <div className="k-container story__grid">
          <div className="story__copy">
            <SectionHeading num="01" eyebrow="Our story" id="story-title" title="Our Story" />
            {body.map((p, i) => <p key={i} className="story__p" data-reveal="block">{p}</p>)}
          </div>
          {site.about?.storyImage && (
            <div className="story__arch" data-reveal="t3">
              <Img src={site.about.storyImage} alt={site.about.storyImageAlt || ''} widths={[480, 720, 960]} sizes="(max-width: 1023px) 100vw, 40vw" loading="lazy" decoding="async" />
            </div>
          )}
        </div>
        {pull && (
          <div className="k-container">
            <blockquote className="story__pull" data-reveal="block">{pull}</blockquote>
          </div>
        )}
      </section>

      <StatsSection surface="ivory" />

      <section id="why" className="k-section why" data-surface="paper" aria-labelledby="why-title">
        <div className="k-container">
          <SectionHeading num="02" eyebrow="Why pilgrims choose us" id="why-title" title="Why Pilgrims Choose Us" />
          <WhyChooseUs wrapped={false} row />
        </div>
      </section>

      <section id="team" className="k-section" data-surface="ivory" aria-labelledby="team-title">
        <div className="k-container">
          <SectionHeading num="03" eyebrow="Meet the Karwan" id="team-title" title="Meet the Karwan" lead="The team that walks with you on every step of the journey." />
          <TeamGrid />
        </div>
      </section>

      <CTABanner num="04" />
    </>
  )
}
