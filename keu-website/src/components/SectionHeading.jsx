/* Section heading (DESIGN-LANGUAGE §4 SectionHeading and Eyebrow).
   A running head like the letterhead's "Ref:" line (number, drawn gold rule,
   label), then the title and a short lead. Keeps .section-heading__title, which
   the speakable structured data selects.

   The old `bismillah` kicker prop is accepted and ignored: no decorative
   religious phrase sits above commercial headings. `subtext` still works as an
   alias of `lead`. */
export default function SectionHeading({ num, eyebrow, title, lead, subtext, align = 'left', tone = 'paper', id, className = '' }) {
  const text = lead ?? subtext
  return (
    <div className={`section-heading section-heading--${align} section-heading--${tone} ${className}`.trim()}>
      {eyebrow && (
        <p className="runhead">
          {num && <span className="runhead__num">{num}</span>}
          <span className="runhead__rule" data-reveal="t0" aria-hidden="true" />
          <span className="runhead__label">{eyebrow}</span>
        </p>
      )}
      <h2 className="section-heading__title" id={id}>{title}</h2>
      {text && <p className="section-heading__lead" data-reveal="t1">{text}</p>}
    </div>
  )
}
