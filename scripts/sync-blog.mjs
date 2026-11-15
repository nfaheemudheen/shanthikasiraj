/**
 * Pulls the latest articles from the Shanthi Kasiraj WordPress blog and writes
 * them into `client/src/data/posts.js`, downloading cover art into
 * `client/public/images/blog/`.
 *
 * Usage:  node scripts/sync-blog.mjs
 *
 * Editorial fields (topics, excerpts, featured flag) live in this file so they
 * survive every re-sync.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DATA_FILE = path.join(ROOT, 'client', 'src', 'data', 'posts.js')
const IMAGE_DIR = path.join(ROOT, 'client', 'public', 'images', 'blog')
const SOURCE = 'https://blog.shanthikasiraj.com/wp-json/wp/v2/posts?per_page=24&_embed=wp:featuredmedia,wp:term'

/* ------------------------------------------------------------------ */
/*  Editorial curation                                                 */
/* ------------------------------------------------------------------ */
const TOPICS = {
  nutrition: { id: 'nutrition', label: 'Nutrition', blurb: 'Food that fits real Indian kitchens — no crash diets, no forbidden foods.' },
  strength: { id: 'strength', label: 'Strength', blurb: 'Lift, recover and build a body that carries you through life.' },
  'weight-loss': { id: 'weight-loss', label: 'Weight loss', blurb: 'Fat loss without the noise, the extremes or the rebound.' },
  'womens-health': { id: 'womens-health', label: "Women's health", blurb: 'Hormones, cycles, postpartum and the things nobody explains.' },
  coaching: { id: 'coaching', label: 'Coaching', blurb: 'What good online and in-studio coaching actually looks like.' },
  habits: { id: 'habits', label: 'Habits', blurb: 'Small, repeatable systems that outlast motivation.' },
}

const CURATION = {
  'how-to-stick-to-your-nutrition-consultant-plan-practical-strategies-for-long-term-success': {
    topics: ['nutrition', 'habits'],
    excerpt:
      'Motivation fades. Systems don’t. How to make a nutrition plan survive real weeks, real families and real cravings.',
  },
  'best-group-classes-for-weight-loss': {
    topics: ['weight-loss', 'strength'],
    excerpt:
      'Sweat, music and a room that pulls for you — why group classes work for weight loss, and how to pick the right one.',
  },
  'not-sure-what-to-eat-for-breakfast-get-a-personalized-nutrition-plan': {
    topics: ['nutrition', 'habits'],
    excerpt:
      'Breakfast is where most plans quietly fall apart. A simple, satisfying template you can repeat on busy mornings.',
  },
  'hormonal-health-and-fitness-how-women-can-exercise-according-to-their-menstrual-cycle': {
    topics: ['womens-health', 'strength'],
    excerpt:
      'Your energy is not random. A phase-by-phase guide to training with your cycle instead of fighting it.',
  },
  'why-youre-not-seeing-results-from-your-workouts-common-mistakes-and-solutions': {
    topics: ['strength', 'weight-loss'],
    excerpt:
      'Training hard but seeing nothing change? The quiet mistakes that stall results — and the fixes that actually work.',
  },
  'why-you-gain-weight-when-you-start-eating-more-lifting-heavy': {
    topics: ['strength', 'nutrition'],
    excerpt:
      'The scale moved up after you started eating more and lifting heavy. Before you panic, read this.',
  },
  'weight-loss-programs-that-really-work-a-complete-guide-to-sustainable-fat-loss-and-long-term-fitness-success': {
    topics: ['weight-loss', 'habits'],
    excerpt:
      'A no-hype guide to fat loss programmes: what works, what doesn’t, and how to judge one before you pay.',
  },
  'complete-indian-weight-loss-diet-plan-for-healthy-fat-loss-and-muscle-building': {
    topics: ['nutrition', 'weight-loss'],
    excerpt:
      'An Indian kitchen-friendly plan built on dal, roti, curd and real portions — with protein and strength in mind.',
  },
  'is-online-training-effective-for-body-transformation': {
    topics: ['coaching', 'strength'],
    excerpt:
      'Can online coaching really change your body? What good remote coaching looks like, and how to spot the rest.',
  },
}

const FEATURED_SLUG =
  'how-to-stick-to-your-nutrition-consultant-plan-practical-strategies-for-long-term-success'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const decode = (text = '') =>
  text
    .replace(/&#8217;|&#8216;|&rsquo;|&lsquo;/g, '’')
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '”')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const stripTags = (html = '') =>
  decode(html.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()

const titleCase = (value = '') =>
  value
    .toLowerCase()
    .replace(/\b(fitness|nutrition|weight|loss|health|wellness|women's|indian|online|group|hiit|workout|programs?|coaching|diet|plans?|strength|training|body|transformation|results|meals?|healthy|realistic|progress|tracking|personalized|personalised|female|coach|muscle|building|fat|classes|virtual|cycle|health)\b/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))
    .replace(/\bAnd\b/g, '&')
    .replace(/\bFor\b/g, 'for')
    .replace(/\bOf\b/g, 'of')

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/* ------------------------------------------------------------------ */
/*  Fetch + transform                                                  */
/* ------------------------------------------------------------------ */
async function main() {
  console.log('Fetching posts…')
  const response = await fetch(SOURCE, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`WordPress responded with ${response.status}`)
  const raw = await response.json()

  await fs.mkdir(IMAGE_DIR, { recursive: true })

  const posts = []

  for (const item of raw) {
    const title = decode(stripTags(item.title?.rendered))
    const content = decode(item.content?.rendered || '')
    const words = stripTags(content).split(/\s+/).filter(Boolean).length
    const media = item._embedded?.['wp:featuredmedia']?.[0]
    const terms = item._embedded?.['wp:term'] || []
    const categories = (terms[0] || []).map((term) => titleCase(decode(term.name))).filter(Boolean)
    const tags = (terms[1] || []).map((term) => titleCase(decode(term.name))).filter(Boolean)

    const curated = CURATION[item.slug] || {}
    const topics = curated.topics || ['strength']

    let cover = ''
    let coverAlt = media?.alt_text ? decode(media.alt_text) : title

    if (media?.source_url) {
      const extension = (media.source_url.match(/\.(jpe?g|png|webp)$/i)?.[1] || 'jpg').toLowerCase()
      const filename = `${item.slug}.${extension}`
      const target = path.join(IMAGE_DIR, filename)
      try {
        const image = await fetch(media.source_url)
        if (!image.ok) throw new Error(`image ${image.status}`)
        await fs.writeFile(target, Buffer.from(await image.arrayBuffer()))
        cover = `/images/blog/${filename}`
        console.log(`  saved ${filename}`)
      } catch (error) {
        console.warn(`  could not download cover for ${item.slug}: ${error.message}`)
        cover = media.source_url.replace(/^http:/, 'https:')
      }
    }

    posts.push({
      slug: item.slug,
      title,
      excerpt: curated.excerpt || stripTags(item.excerpt?.rendered).replace(/…$/, '').slice(0, 180),
      date: item.date,
      dateLabel: formatDate(item.date),
      readTime: Math.max(2, Math.round(words / 215)),
      cover,
      coverAlt,
      topics,
      categories,
      tags,
      featured: item.slug === FEATURED_SLUG,
      url: item.link,
      content,
    })
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date))

  const header = `/* Auto-generated by scripts/sync-blog.mjs — re-run it to refresh articles. */
/* Source: https://blog.shanthikasiraj.com */

`
  const body = `export const topics = ${JSON.stringify(Object.values(TOPICS), null, 2)}

export const posts = ${JSON.stringify(posts, null, 2)}
`

  await fs.writeFile(DATA_FILE, header + body, 'utf8')
  console.log(`\nWrote ${posts.length} posts to ${path.relative(ROOT, DATA_FILE)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
