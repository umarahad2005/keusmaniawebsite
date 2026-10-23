/* MongoDB Atlas connection — cached across serverless invocations. */
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI

let cached = global.__mongoose
if (!cached) cached = global.__mongoose = { conn: null, promise: null }

export async function connectDB() {
  if (!uri) throw new Error('MONGODB_URI is not set')
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 5,
    }).catch(err => {
      // Never leave a rejected promise in the cache: a warm serverless instance
      // would re-await this same failure forever and never retry the connection.
      cached.promise = null
      throw err
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

// ---------- Models ----------

const adminSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name:         { type: String, default: 'Admin' },
}, { timestamps: true })

const inquirySchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  phone:   { type: String, required: true, trim: true },
  email:   { type: String, trim: true, lowercase: true },
  package: { type: String, trim: true },
  prefer:  { type: String, enum: ['whatsapp', 'call', 'email'], default: 'whatsapp' },
  message: { type: String, required: true, trim: true },
  status:  { type: String, enum: ['unread', 'read', 'replied', 'archived'], default: 'unread', index: true },
  ip:      { type: String },
  userAgent: { type: String },
}, { timestamps: true })

inquirySchema.index({ createdAt: -1 })

const contentSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true, index: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true })

/* The /updates feed (api/social): Instagram posts mirrored by the sync, plus
   posts the owner adds by hand or imports (scripts/import-social-exports.mjs).
   Images are Cloudinary public_ids under keu/social. A post shows on the site
   once publishAt has passed, so imported posts appear on their scheduled day.
   `removed` is a tombstone for a deleted Instagram post, so the next sync does
   not bring it back. */
const socialImageSchema = new mongoose.Schema({
  src:    { type: String, required: true },
  alt:    { type: String, default: '', trim: true },
  width:  { type: Number },
  height: { type: Number },
}, { _id: false })

const socialPostSchema = new mongoose.Schema({
  source:    { type: String, enum: ['instagram', 'manual'], default: 'manual', index: true },
  igId:      { type: String, unique: true, sparse: true },
  importKey: { type: String, unique: true, sparse: true },
  mediaType: { type: String, default: 'IMAGE' },
  images:    { type: [socialImageSchema], default: [] },
  caption:   { type: String, default: '' },
  text:      { type: String, default: '' },
  permalink: { type: String, default: '' },
  postedAt:  { type: Date, required: true },
  publishAt: { type: Date, required: true, index: true },
  hidden:    { type: Boolean, default: false },
  pinned:    { type: Boolean, default: false },
  removed:   { type: Boolean, default: false },
}, { timestamps: true })

socialPostSchema.index({ hidden: 1, removed: 1, publishAt: -1 })

/* One row per connected service (provider: 'instagram'). The access token is
   select: false, so it only leaves the database when a query asks for
   '+token' (api/social sync and refresh), and no endpoint ever returns it. */
const integrationSchema = new mongoose.Schema({
  provider:   { type: String, required: true, unique: true },
  token:      { type: String, select: false },
  tokenSetAt: { type: Date },
  expiresAt:  { type: Date },
  account:    { userId: String, username: String },
  lastSyncAt:    { type: Date },
  lastSyncAdded: { type: Number, default: 0 },
  lastError:     { type: String, default: '' },
  lastErrorAt:   { type: Date },
  // Set by an edit that can wait (alt text only); the next sync rebuilds.
  rebuildPending: { type: Date },
}, { timestamps: true })

export const Admin   = mongoose.models.Admin   || mongoose.model('Admin',   adminSchema)
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema)
export const Content = mongoose.models.Content || mongoose.model('Content', contentSchema)
export const SocialPost  = mongoose.models.SocialPost  || mongoose.model('SocialPost',  socialPostSchema)
export const Integration = mongoose.models.Integration || mongoose.model('Integration', integrationSchema)
