/* Idempotent admin seed.
   Reads ADMIN_EMAIL + ADMIN_PASSWORD from env, upserts the matching Admin
   document with a fresh bcrypt hash.

   Returns one of:
     { status: 'created',  email }  — admin row was created
     { status: 'updated',  email }  — existing admin had its password rotated
     { status: 'unchanged',email }  — password already current
     { status: 'skipped', reason }  — env vars missing
     { status: 'failed',  error  }  — DB error (caller decides what to do)
*/

import bcrypt from 'bcryptjs'
import { connectDB, Admin } from './db.js'

export async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    return { status: 'skipped', reason: 'ADMIN_EMAIL or ADMIN_PASSWORD not set' }
  }

  try {
    await connectDB()

    const existing = await Admin.findOne({ email })
    if (existing) {
      // Only re-hash + update if the password actually changed
      const same = await bcrypt.compare(password, existing.passwordHash)
      if (same) return { status: 'unchanged', email }

      existing.passwordHash = await bcrypt.hash(password, 12)
      await existing.save()
      return { status: 'updated', email }
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await Admin.create({ email, passwordHash, name: 'Karwan Admin' })
    return { status: 'created', email }
  } catch (err) {
    return { status: 'failed', error: err.message || String(err) }
  }
}
