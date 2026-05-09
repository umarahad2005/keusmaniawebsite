import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useThreeScene } from '../hooks/useThreeScene.js'
import { useWaLink } from '../lib/whatsapp.js'

export default function Hero() {
  const canvasRef = useRef(null)
  useThreeScene(canvasRef)
  const wa = useWaLink()

  return (
    <section id="hero" className="hero">
      <div className="hero__photo" aria-hidden="true">
        <img src="/images/makkah/kaaba.jpg" alt="" decoding="async" fetchpriority="high" />
      </div>
      <canvas id="hero-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        <span className="hero__pill">Lahore · Since 2005</span>
        <h1 className="hero__title">
          Your Sacred Journey
          <span className="hero__title-accent">Begins Here</span>
        </h1>
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

      <div className="hero__scroll-cue" aria-hidden="true">Scroll to explore</div>
    </section>
  )
}
