/* Build-time pre-render support (scripts/prerender.mjs).

   During the pre-render there is no document: hooks that normally write to
   <head> in an effect (useDocumentHead, JsonLd) record what they would have
   written here instead, and the script puts it into each page's HTML. In the
   browser this collector is never used. */

export const IS_SSR = typeof document === 'undefined'

let current = null

export function startCollect() {
  current = { head: null, ld: [] }
  return current
}

export function collector() { return current }
