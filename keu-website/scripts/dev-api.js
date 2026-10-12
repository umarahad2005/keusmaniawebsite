/* =========================================================
   Local dev server — runs the same api/*.js handlers that
   Vercel runs in production, but via plain Express. No
   `vercel link`, no global Vercel CLI install.

     Discovery:  walks ./api/, registers each .js file as a route.
                 [param].js → :param   (Vercel-style dynamic routes)
                 index.js   → the parent path
   ========================================================= */

import 'dotenv/config'
import dns from 'node:dns'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import express from 'express'
import { ensureAdmin } from '../api/_lib/ensureAdmin.js'

// Some networks refuse the SRV lookup that mongodb+srv:// needs; public
// resolvers work. Dev only: production (Vercel) resolves normally.
dns.setServers(['1.1.1.1', '8.8.8.8'])

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const ROOT       = path.resolve(__dirname, '..')
const API_DIR    = path.join(ROOT, 'api')
const PORT       = Number(process.env.DEV_API_PORT) || 3001

// ---------- Helpful pre-flight ----------
const MISSING = []
if (!process.env.MONGODB_URI) MISSING.push('MONGODB_URI')
if (!process.env.JWT_SECRET)  MISSING.push('JWT_SECRET')
if (MISSING.length) {
  console.warn(`\n⚠  .env.local is missing: ${MISSING.join(', ')}`)
  console.warn(`   The API will start anyway — endpoints that use these will return 503.\n`)
}

// ---------- App ----------
const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// ---------- Walk api/ ----------
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const out = []
  for (const e of entries) {
    if (e.name.startsWith('_')) continue            // skip _lib/ etc.
    const full = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...await walk(full))
    else if (e.name.endsWith('.js')) out.push(full)
  }
  return out
}

function fileToRoute(absPath) {
  const rel = path.relative(API_DIR, absPath).replace(/\\/g, '/').replace(/\.js$/, '')
  // index → strip
  const segs = rel.split('/').filter(s => s !== 'index')
  // [id] → :id
  const url = '/' + segs.map(s => s.replace(/^\[(.+)\]$/, ':$1')).join('/')
  return url === '/' ? '/' : url
}

// Wrap a Vercel-style handler so Express can call it
function wrap(handler) {
  return async (req, res) => {
    // Vercel handlers consume req.body as already-parsed JSON when content-type is JSON,
    // and req.query for both ?foo=bar and dynamic [param].
    try {
      const r = handler(req, res)
      if (r && typeof r.then === 'function') await r
    } catch (err) {
      console.error(`[api] ${req.method} ${req.url} —`, err)
      if (!res.headersSent) {
        const isMissingEnv = /not set|undefined env|MONGODB_URI|JWT_SECRET|SMTP|CLOUDINARY/i.test(err.message)
        res.status(isMissingEnv ? 503 : 500).json({ error: err.message })
      }
    }
  }
}

async function mountAll() {
  const files = await walk(API_DIR)
  console.log(`Discovered ${files.length} API handler(s):`)
  for (const file of files) {
    const route = fileToRoute(file)
    const url = pathToFileURL(file).href
    try {
      const mod = await import(url)
      const handler = mod.default
      if (typeof handler !== 'function') {
        console.warn(`  ✗ ${route}  (no default export)`)
        continue
      }
      // Mount on every method — handler does its own method check
      app.all('/api' + (route === '/' ? '' : route), wrap(handler))
      console.log(`  ✓ /api${route === '/' ? '' : route}`)
    } catch (err) {
      console.warn(`  ✗ /api${route} — failed to load: ${err.message}`)
    }
  }
}

await mountAll()

// 404 for anything under /api that didn't match a mounted handler.
// MUST be registered AFTER mountAll() — Express runs middleware in order.
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not Found' }))

// ---------- Auto-seed admin (idempotent) ----------
if (process.env.MONGODB_URI && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  const r = await ensureAdmin()
  switch (r.status) {
    case 'created':   console.log(`✓ admin created: ${r.email}`); break
    case 'updated':   console.log(`✓ admin password rotated: ${r.email}`); break
    case 'unchanged': console.log(`✓ admin ready: ${r.email}`); break
    case 'failed':    console.warn(`⚠  admin seed failed: ${r.error}`); break
  }
} else {
  console.warn(`⚠  admin auto-seed skipped — set MONGODB_URI + ADMIN_EMAIL + ADMIN_PASSWORD in .env.local`)
}

app.listen(PORT, () => {
  console.log(`\nAPI listening on http://localhost:${PORT}`)
  console.log(`(Vite proxies /api → :${PORT})\n`)
})
