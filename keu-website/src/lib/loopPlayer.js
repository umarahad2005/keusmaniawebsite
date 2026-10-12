/* Looping background-sound player (SoundToggle).

   Two engines behind one interface — start(), stop(), destroy():

   - Short clips (≤ 90 s, e.g. the 16 s Talbiyah): Web Audio. The clip is
     decoded once and played by an AudioBufferSourceNode with loop = true,
     which repeats sample-exactly (an <audio loop> leaves a small gap at every
     restart, very noticeable on a 16 s clip). The clip's last second is
     cross-faded into its first second (equal power), so the join is
     inaudible even when the recording's start and end do not match.
   - Longer tracks: a plain <audio loop>. Decoding minutes of audio into
     memory would be too heavy on phones, and a gap every few minutes is fine.

   Both fade in and out over ~1.2 s and keep their place when stopped, so the
   sound resumes where it paused. Call start() from a click handler: browsers
   only allow sound after the visitor presses something. */

const FADE_S = 1.2
const SHORT_MAX_S = 90

const AudioCtx = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null

/** Copy of `buf` whose end is equal-power cross-faded into its start, so it loops without a seam. */
function seamless(ctx, buf) {
  const sr = buf.sampleRate
  const x = Math.min(Math.floor(sr * 1), Math.floor(buf.length * 0.15))   // 1 s, or 15 % of a very short clip
  if (x < sr * 0.05) return buf
  const len = buf.length - x
  const out = ctx.createBuffer(buf.numberOfChannels, len, sr)
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const src = buf.getChannelData(c)
    const dst = out.getChannelData(c)
    dst.set(src.subarray(0, len))
    // Head: fade in the clip's start while the clip's tail fades out over it.
    for (let i = 0; i < x; i++) {
      const t = i / x
      dst[i] = src[i] * Math.sin(t * Math.PI / 2) + src[len + i] * Math.cos(t * Math.PI / 2)
    }
  }
  return out
}

function webAudioPlayer(src, volume) {
  let ctx = null, gain = null, source = null, buffer = null, loading = null, stopTimer = 0

  async function load() {
    const res = await fetch(src, { mode: 'cors' })
    if (!res.ok) throw new Error(`audio HTTP ${res.status}`)
    const data = await res.arrayBuffer()
    const decoded = await new Promise((resolve, reject) => {
      const p = ctx.decodeAudioData(data, resolve, reject)   // callback form for older Safari
      if (p && p.then) p.then(resolve, reject)
    })
    buffer = seamless(ctx, decoded)
  }

  return {
    async start() {
      clearTimeout(stopTimer)
      if (!ctx) {
        ctx = new AudioCtx()
        gain = ctx.createGain()
        gain.gain.value = 0
        gain.connect(ctx.destination)
      }
      const resumed = ctx.resume()            // inside the click: unlocks audio on iOS
      if (!buffer) { loading = loading || load(); await loading }
      await resumed
      if (!source) {
        source = ctx.createBufferSource()
        source.buffer = buffer
        source.loop = true
        source.connect(gain)
        source.start()
      }
      const now = ctx.currentTime
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(volume, now + FADE_S)
    },
    stop() {
      if (!ctx) return
      const now = ctx.currentTime
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(0, now + FADE_S)
      clearTimeout(stopTimer)
      stopTimer = setTimeout(() => { ctx.suspend().catch(() => {}) }, FADE_S * 1000 + 50)
    },
    destroy() {
      clearTimeout(stopTimer)
      try { source?.stop() } catch { /* not started */ }
      ctx?.close().catch(() => {})
      ctx = gain = source = buffer = loading = null
    },
  }
}

function mediaElementPlayer(src, volume) {
  const el = new Audio()
  el.src = src
  el.loop = true
  el.preload = 'auto'
  el.volume = 0
  let raf = 0
  const ramp = (to, done) => {
    cancelAnimationFrame(raf)
    const from = el.volume, t0 = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - t0) / (FADE_S * 1000))
      el.volume = from + (to - from) * p
      if (p < 1) raf = requestAnimationFrame(step)
      else done?.()
    }
    raf = requestAnimationFrame(step)
  }
  return {
    async start() { await el.play(); ramp(volume) },
    stop() { if (!el.paused) ramp(0, () => el.pause()) },
    destroy() { cancelAnimationFrame(raf); el.pause(); el.removeAttribute('src'); el.load() },
  }
}

/** A player for `src`. `duration` (seconds, from the admin upload) picks the engine. */
export function createLoopPlayer(src, { volume = 0.35, duration = 0 } = {}) {
  const short = duration > 0 && duration <= SHORT_MAX_S
  if (short && AudioCtx) {
    const web = webAudioPlayer(src, volume)
    let fallback = null
    // If Web Audio fails (e.g. the file cannot be fetched cross-origin), fall back to <audio loop>.
    return {
      async start() {
        if (fallback) return fallback.start()
        try { await web.start() } catch { web.destroy(); fallback = mediaElementPlayer(src, volume); return fallback.start() }
      },
      stop() { (fallback || web).stop() },
      destroy() { web.destroy(); fallback?.destroy() },
    }
  }
  return mediaElementPlayer(src, volume)
}
