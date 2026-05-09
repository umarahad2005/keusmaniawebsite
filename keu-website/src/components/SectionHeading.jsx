export default function SectionHeading({ bismillah, title, subtext, align = 'center' }) {
  const className = align === 'left' ? 'section-heading section-heading--left' : 'section-heading'
  return (
    <div className={className}>
      {bismillah && <span className="section-heading__bismillah">{bismillah}</span>}
      <h2 className="section-heading__title">{title}</h2>
      <span className="section-heading__divider" />
      {subtext && <p className="section-heading__subtext">{subtext}</p>}
    </div>
  )
}
