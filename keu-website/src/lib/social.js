/* The /updates feed (api/social) for the page, kept off every other page.

   - The build-time pre-render fetches the posts for /updates only and hands
     them over with primeSocial() (src/entry-server.jsx); the page's HTML then
     carries them in window.__KEU_SOCIAL__ (scripts/prerender.mjs), never in
     __KEU_CONTENT__, so Home and Packages stay as light as before.
   - In the browser the page starts from that snapshot (or nothing, arriving
     from another page) and reads /api/social once for anything newer.
   Shape: { posts: [...], next: <ISO> | null } (api/_lib/social.js publicPost). */
import { useEffect, useState } from 'react'
import { IS_SSR } from './ssr.js'

let snapshot = !IS_SSR && window.__KEU_SOCIAL__ ? window.__KEU_SOCIAL__ : null
let fetched = false

/** Build time only: the posts the next render of /updates should show. */
export function primeSocial(data) { snapshot = data }

async function getPage(before) {
  const q = before ? `?before=${encodeURIComponent(before)}` : ''
  const r = await fetch(`/api/social${q}`)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const body = await r.json()
  return { posts: Array.isArray(body.posts) ? body.posts : [], next: body.next || null }
}

/** { feed, error, more, loadMore }: feed is null until the first posts arrive. */
export function useSocialFeed() {
  const [feed, setFeed] = useState(snapshot)
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (fetched) return
    let live = true
    getPage().then(
      (f) => { fetched = true; snapshot = f; if (live) setFeed(f) },
      () => { if (live) setError(true) },
    )
    return () => { live = false }
  }, [])

  const loadMore = async () => {
    if (!feed?.next || busy) return
    setBusy(true)
    try {
      const f = await getPage(feed.next)
      setFeed(prev => {
        const seen = new Set(prev.posts.map(p => p.id))
        return { posts: [...prev.posts, ...f.posts.filter(p => !seen.has(p.id))], next: f.next }
      })
    } catch { setError(true) } finally { setBusy(false) }
  }

  return { feed, error, busy, loadMore }
}

/* ---------- Text ---------- */

/* Letters Urdu writes and Arabic does not (ٹ ڈ ڑ ں ھ ہ ی ے ک گ پ چ ژ …). */
const URDU_ONLY = /[ٹڈڑںھہ-ۃیےۓکگپچژ]/
const ARABIC_SCRIPT = /[؀-ۿﭐ-﷿ﹰ-﻿]/g
const LATIN = /[A-Za-z]/g

/** "ar" | "ur" | "en" for one paragraph: Arabic script when most of its letters are. */
export function scriptOf(text) {
  const ar = (text.match(ARABIC_SCRIPT) || []).length
  const lat = (text.match(LATIN) || []).length
  if (ar <= lat) return 'en'
  return URDU_ONLY.test(text) ? 'ur' : 'ar'
}

/** The post text as paragraphs, each tagged with its language. */
export function paragraphs(text = '') {
  return String(text).split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
    .map(p => ({ lang: scriptOf(p), text: p }))
}

/** A short plain headline for a post (JSON-LD, image alt fallback). */
export function headline(post, max = 110) {
  const first = paragraphs(post.text).find(p => p.lang === 'en') || paragraphs(post.text)[0]
  const t = (first?.text || '').replace(/\s+/g, ' ').replace(/^["“]|["”]$/g, '')
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t
}
