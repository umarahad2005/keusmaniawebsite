/* Idempotent admin sync.
   Reads ADMIN_EMAIL + ADMIN_PASSWORD from env and makes the Admin collection
   match: upserts the row and removes any left over under a previous email.

   Returns one of:
     { status: 'created',  email, id }  — admin row was created
     { status: 'updated',  email, id }  — email and/or password changed
     { status: 'unchanged',email, id }  — already current
     { status: 'skipped', reason }      — env vars missing
     { status: 'failed',  error  }      — DB error (caller decides what to do)
*/

import bcrypt from 'bcryptjs'
import { connectDB, Admin } from './db.js'
import { envAdmin } from './adminCreds.js'

export async function ensureAdmin() {
  const env = envAdmin()
  if (!env) {
    return { status: 'skipped', reason: 'ADMIN_EMAIL or ADMIN_PASSWORD not set' }
  }
  const { email, password } = env

  try {
    await connectDB()

    /* Rows under a different email are stale — the admin address was changed in
       env. Left behind, they'd keep accepting the old credentials at login. */
    const stale = await Admin.deleteMany({ email: { $ne: email } })

    const existing = await Admin.findOne({ email })
    if (existing) {
      const same = await bcrypt.compare(password, existing.passwordHash)
      if (same && stale.deletedCount === 0) {
        return { status: 'unchanged', email, id: existing._id.toString() }
      }
      if (!same) {
        existing.passwordHash = await bcrypt.hash(password, 12)
        await existing.save()
      }
      return { status: 'updated', email, id: existing._id.toString() }
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const created = await Admin.create({ email, passwordHash, name: 'Karwan Admin' })
    return { status: 'created', email, id: created._id.toString() }
  } catch (err) {
    return { status: 'failed', error: err.message || String(err) }
  }
}
