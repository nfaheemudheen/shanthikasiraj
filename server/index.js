import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 4000
const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'submissions.json')
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist')

const app = express()
app.disable('x-powered-by')
app.use(cors())
app.use(express.json({ limit: '32kb' }))

/* ------------------------------------------------------------------ */
/*  Tiny in-memory rate limiter — keeps the public form from being     */
/*  hammered without pulling in extra dependencies.                    */
/* ------------------------------------------------------------------ */
const WINDOW_MS = 15 * 60 * 1000
const MAX_PER_WINDOW = 8
const hits = new Map()

function rateLimit(req, res, next) {
  const key = req.ip || 'unknown'
  const now = Date.now()
  const entry = hits.get(key)

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return next()
  }

  entry.count += 1
  if (entry.count > MAX_PER_WINDOW) {
    return res.status(429).json({
      ok: false,
      message: 'Too many requests. Please try again in a few minutes or call +91 83291 49126.',
    })
  }
  next()
}

// Periodically clear stale rate-limit entries.
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key)
  }
}, WINDOW_MS).unref()

/* ------------------------------------------------------------------ */
/*  Storage — a small JSON file is enough for a portfolio site.       */
/*  Swap this for a database later without touching the API shape.    */
/* ------------------------------------------------------------------ */
async function readSubmissions() {
  try {
    const raw = await fsp.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    if (error.code === 'ENOENT') return []
    console.error('Could not read submissions:', error)
    return []
  }
}

let writeQueue = Promise.resolve()

function persistSubmission(submission) {
  writeQueue = writeQueue.catch(() => {}).then(async () => {
    await fsp.mkdir(DATA_DIR, { recursive: true })
    const existing = await readSubmissions()
    existing.push(submission)
    const tmp = `${DATA_FILE}.tmp`
    await fsp.writeFile(tmp, JSON.stringify(existing, null, 2), 'utf8')
    await fsp.rename(tmp, DATA_FILE)
  })
  return writeQueue
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */
const GOALS = [
  'Personal Training',
  'Nutrition Coaching',
  'Group Fitness Classes',
  '30-Day Challenge',
  'Something else',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function sanitize(value) {
  return typeof value === 'string' ? value.trim().slice(0, 2500) : ''
}

function validateContact(body = {}) {
  const errors = {}
  const name = sanitize(body.name)
  const email = sanitize(body.email).toLowerCase()
  const phone = sanitize(body.phone)
  const goal = sanitize(body.goal)
  const message = sanitize(body.message)
  const consent = body.consent === true
  const website = sanitize(body.website) // honeypot

  if (name.length < 2) errors.name = 'Please tell me your name.'
  else if (name.length > 80) errors.name = 'Name must be 80 characters or fewer.'

  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  else if (email.length > 120) errors.email = 'Email must be 120 characters or fewer.'

  if (phone) {
    const digits = phone.replace(/[^\d]/g, '')
    if (digits.length < 7 || digits.length > 15) {
      errors.phone = 'Please enter a valid phone number.'
    }
  }

  if (!GOALS.includes(goal)) errors.goal = 'Please choose what you are interested in.'

  if (message.length < 10) errors.message = 'A little more detail helps me help you (10+ characters).'
  else if (message.length > 2000) errors.message = 'Please keep your message under 2000 characters.'

  if (!consent) errors.consent = 'Please accept the privacy note so I can reply.'

  if (website) {
    // Honeypot filled → silently reject as a bot.
    return { errors: { form: 'Unable to process this request.' }, data: null }
  }

  return {
    errors: Object.keys(errors).length ? errors : null,
    data: { name, email, phone, goal, message, consent },
  }
}

/* ------------------------------------------------------------------ */
/*  API                                                                */
/* ------------------------------------------------------------------ */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'shanthi-kasiraj-api', uptime: process.uptime() })
})

app.post('/api/contact', rateLimit, async (req, res, next) => {
  try {
    const { errors, data } = validateContact(req.body)

    if (errors) {
      return res.status(422).json({
        ok: false,
        message: 'Please check the highlighted fields and try again.',
        errors,
      })
    }

    const submission = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      userAgent: (req.get('user-agent') || '').slice(0, 300),
    }

    await persistSubmission(submission)

    return res.status(201).json({
      ok: true,
      message: 'Thank you! Your consultation request has been received.',
      id: submission.id,
    })
  } catch (error) {
    next(error)
  }
})

/* ------------------------------------------------------------------ */
/*  Static client (production build)                                   */
/* ------------------------------------------------------------------ */
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST, { maxAge: '1h' }))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(path.join(CLIENT_DIST, 'index.html'))
  })
}

app.use('/api', (req, res) => {
  res.status(404).json({ ok: false, message: 'API route not found.' })
})

app.use((error, req, res, next) => {
  console.error(error)
  if (res.headersSent) return next(error)
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, message: 'Invalid request body.' })
  }
  res.status(500).json({
    ok: false,
    message: 'Something went wrong on our side. Please email wellnesswithshanthikasiraj1@gmail.com.',
  })
})

app.listen(PORT, () => {
  console.log(`Shanthi Kasiraj API running at http://localhost:${PORT}`)
})
