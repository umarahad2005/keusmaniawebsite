/* The KU mark (traced from newlogo.png). Full colour on paper, reversed on dark
   grounds and over the film. Never rotate, stretch, recolour or circle-crop it,
   and never render it below 32 px (DESIGN-LANGUAGE §2.6, Design System README). */
import markUrl from '../../assets/brand/ku-mark.svg'
import markReversedUrl from '../../assets/brand/ku-mark-reversed.svg'

export default function BrandMark({ variant = 'color', size = 40, className = '', alt = '', ...rest }) {
  return (
    <img
      src={variant === 'reversed' ? markReversedUrl : markUrl}
      width={size}
      height={size}
      alt={alt}
      className={`brand-mark ${className}`.trim()}
      decoding="async"
      {...rest}
    />
  )
}
