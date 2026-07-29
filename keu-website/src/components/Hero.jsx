import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useThreeScene } from '../hooks/useThreeScene.js'
import { useWaLink } from '../lib/whatsapp.js'
import Img from './Img.jsx'

export default function Hero() {
  const canvasRef = useRef(null)
  useThreeScene(canvasRef)
  const wa = useWaLink()

  return (
    <section id="hero" className="hero">
      <div className="hero__photo" aria-hidden="true">
        <Img src="keu/makkah/kaaba" alt="" decoding="async" fetchpriority="high" />
      </div>
      <canvas id="hero-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        <span className="hero__pill">Lahore · Since 2005</span>
        <h1 className="hero__title hero__title--arabic" lang="ur">
          خدمات ضیوف الرحمن
        </h1>
        <p className="hero__title-accent hero__title-accent--sub">
          Services for the Guests of the Most Merciful
        </p>
        <p className="hero__subtitle">
          Premium Hajj &amp; Umrah services from Lahore, Pakistan.
          Trusted by thousands of pilgrims since 2005.
        </p>
        <div className="hero__ctas">
          <Link className="btn btn--primary btn--lg" to="/packages">View Packages</Link>
          <a className="btn btn--ghost-light btn--lg" href={wa('general')} target="_blank" rel="noopener">
            <span aria-hidden="true">💬</span> Book on WhatsApp
          </a>
        </div>
      </div>

    </section>
  )
}
