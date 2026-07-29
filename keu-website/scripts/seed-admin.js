/* npm run seed:admin
   Standalone entry — useful for production / one-off password rotation. */
import 'dotenv/config'
import mongoose from 'mongoose'
import { ensureAdmin } from '../api/_lib/ensureAdmin.js'

const r = await ensureAdmin()
switch (r.status) {
  case 'created':   console.log(`✓ admin created: ${r.email}`); break
  case 'updated':   console.log(`✓ admin credentials synced from env: ${r.email}`); break
  case 'unchanged': console.log(`✓ admin already up to date: ${r.email}`); break
  case 'skipped':   console.error(`✗ ${r.reason} — set them in .env.local`); process.exit(1); break
  case 'failed':    console.error(`✗ failed: ${r.error}`); process.exit(1); break
}
await mongoose.disconnect()
