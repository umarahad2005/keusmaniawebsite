/* The letterhead lockup: mark | gold divider | three-line wordmark.
   Used in the footer and on the Contact page only (the nav uses the mark and
   the one-line wordmark). tone="dark" sets the gold-on-green footer colours. */
import BrandMark from './BrandMark.jsx'
import Wordmark from './Wordmark.jsx'

export default function Lockup({ tone = 'paper', markSize = 80, className = '' }) {
  return (
    <div className={`lockup lockup--${tone} ${className}`.trim()}>
      <BrandMark variant={tone === 'dark' ? 'reversed' : 'color'} size={markSize} />
      <span className="lockup__divider" aria-hidden="true" />
      <Wordmark variant="lockup" className="lockup__words" />
    </div>
  )
}
