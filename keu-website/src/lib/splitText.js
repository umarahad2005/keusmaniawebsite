/* =========================================================
   Safe SplitText wrapper (DESIGN-LANGUAGE §2.2, §3.2).

   Arabic and Urdu are joined scripts: splitting them into characters or words
   breaks the letter shapes and the right-to-left order. This wrapper refuses to
   split any element that is, or contains, Arabic or Urdu. In development it
   throws so the mistake is caught immediately; in production it skips the split
   and leaves the element untouched (it animates as one line with its parent).
   ========================================================= */
import { SplitText } from './motion.js'

const RTL_SELECTOR = ':lang(ar), :lang(ur), .ar-face, .nastaliq, [dir="rtl"]'

function containsRtl(el) {
  return el.matches(RTL_SELECTOR) || !!el.querySelector(RTL_SELECTOR)
}

/**
 * Split an English heading into masked lines.
 *   const split = splitLines(el, { onSplit: self => gsap.from(self.lines, {...}) })
 * Returns the SplitText instance, or null when the element must not be split.
 * Always call split.revert() in cleanup (gsap.context does this for you).
 */
export function splitLines(el, { words = false, onSplit } = {}) {
  if (!el) return null
  if (containsRtl(el)) {
    const msg = `splitText: refusing to split Arabic/Urdu content in <${el.tagName.toLowerCase()} class="${el.className}">`
    if (import.meta.env.DEV) throw new Error(msg)
    return null
  }
  return SplitText.create(el, {
    type: words ? 'lines,words' : 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    wordsClass: 'split-word',
    autoSplit: true,   // re-splits once fonts load or the width changes
    aria: 'auto',      // screen readers keep reading the original text
    onSplit,
  })
}
