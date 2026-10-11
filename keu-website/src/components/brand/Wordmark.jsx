/* The KEUI wordmark, outlined to SVG paths (Cinzel 500 + Manrope 500), so no
   font is needed to render the logo and it can never fall back to another face.

   variant="line"    one line, "KARWAN e USMANIA", colour = currentColor (nav)
   variant="lockup"  three lines with gold rules; colours come from
                     --lockup-2 (INTERNATIONAL), --lockup-rule, --lockup-3
                     (TRAVEL & TOURS) and currentColor (the wordmark) */
import lineSvg from '../../assets/brand/wordmark-line.svg?raw'
import lockupSvg from '../../assets/brand/wordmark.svg?raw'

export default function Wordmark({ variant = 'line', className = '', style }) {
  const svg = variant === 'lockup' ? lockupSvg : lineSvg
  return (
    <span
      className={`wordmark wordmark--${variant} ${className}`.trim()}
      style={style}
      // Static, first-party asset bundled at build time (not user content).
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
