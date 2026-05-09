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

export const Admin   = mongoose.models.Admin   || mongoose.model('Admin',   adminSchema)
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema)
export const Content = mongoose.models.Content || mongoose.model('Content', contentSchema)
