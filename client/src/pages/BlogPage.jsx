import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollTop from '../components/ScrollTop'
import Ticker from '../components/Ticker'
import Icon from '../components/Icon'
import PostCard from '../components/PostCard'
import JournalNewsletter from '../components/JournalNewsletter'
import { posts, topics } from '../data/posts'
import { journal, featuredSlug, watchVideos, channels, coach, topicLabel } from '../data/blog'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { Link } from '../router'

const scrollToLatest = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById('latest')?.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
function Hero({ featured }) {
  return (
    <section className="journal-hero">
      <span className="journal-hero__grid-lines" aria-hidden="true" />
      <span className="journal-hero__glow journal-hero__glow--one" aria-hidden="true" />
      <span className="journal-hero__glow journal-hero__glow--two" aria-hidden="true" />

      <div className="container journal-hero__inner">
        <div className="journal-hero__copy">
          <p className="journal-badge" data-reveal>
            {journal.badge}
          </p>

          <h1 className="journal-hero__title" data-reveal style={{ '--delay': '80ms' }}>
            <span>{journal.titleLines[0]}</span>
            <span className="journal-hero__title-accent">
              <em>{journal.titleLines[1]}</em>
            </span>
          </h1>

          <p className="journal-hero__lead" data-reveal style={{ '--delay': '150ms' }}>
            {journal.lead}
          </p>

          <div className="journal-hero__actions" data-reveal style={{ '--delay': '210ms' }}>
            <a className="journal-btn journal-btn--accent" href="#latest">
              Browse the journal
              <Icon name="arrowRight" size={17} />
            </a>
            <a
              className="journal-btn journal-btn--ghost"
              href="https://www.youtube.com/@shanthikasiraj"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="youtube" size={18} />
              Watch on YouTube
            </a>
          </div>

          <ul className="journal-hero__meta" data-reveal style={{ '--delay': '260ms' }}>
            <li>{journal.meta[0]}</li>
            <li><Icon name="dumbbell" size={14} />{journal.meta[1]}</li>
          </ul>
        </div>

        {featured && (
          <div className="journal-feature" data-reveal style={{ '--delay': '180ms' }}>
            <span className="journal-feature__backdrop" aria-hidden="true" />
            <article className="journal-feature__card">
              <Link to={`/blog/${featured.slug}`} className="journal-feature__media" aria-label={`Read ${featured.title}`}>
                <img src={featured.cover} alt={featured.coverAlt} loading="eager" fetchPriority="high" />
                <span className="journal-chip journal-chip--solid">Featured story</span>
              </Link>
              <div className="journal-feature__body">
                <p className="journal-feature__kicker">
                  {topicLabel(featured.topics[0])} · {featured.readTime} min read
                </p>
                <h2>
                  <Link to={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p className="journal-feature__excerpt">{featured.excerpt}</p>
                <div className="journal-feature__foot">
                  <Link to={`/blog/${featured.slug}`} className="journal-read">
                    Read the story
                    <Icon name="arrowUpRight" size={16} />
                  </Link>
                  <span>The Journal · Vol. 01</span>
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Latest + filters                                                   */
/* ------------------------------------------------------------------ */
function Latest({ active, onTopicChange }) {
  const featured = posts.find((post) => post.slug === featuredSlug) || posts[0]

  const counts = useMemo(() => {
    const map = { all: Math.max(posts.length - 1, 0) }
    topics.forEach((topic) => {
      map[topic.id] = posts.filter((post) => post.topics.includes(topic.id)).length
    })
    return map
  }, [])

  const visible = useMemo(() => {
    if (active === 'all') return posts.filter((post) => post.slug !== featured.slug)
    return posts.filter((post) => post.topics.includes(active))
  }, [active, featured.slug])

  return (
    <section className="journal-latest" id="latest">
      <div className="container">
        <div className="journal-section-head" data-reveal>
          <div>
            <p className="eyebrow"><span className="status-dot status-dot--dark" />The latest</p>
            <h2 className="section-title">
              Fresh from <em>the desk.</em>
            </h2>
          </div>
          <p className="journal-section-head__copy">
            Everything I would tell a client in a session — written down, so it stays with you after the
            workout ends.
          </p>
        </div>

        <div className="journal-filters" data-reveal>
          <div className="journal-filters__chips" role="group" aria-label="Filter articles by topic">
            {[{ id: 'all', label: 'All stories' }, ...topics].map((topic) => {
              const selected = active === topic.id
              return (
                <button
                  key={topic.id}
                  type="button"
                  aria-pressed={selected}
                  className={`journal-filter ${selected ? 'is-active' : ''}`}
                  onClick={() => onTopicChange(topic.id)}
                >
                  {topic.label}
                  <span>{counts[topic.id] ?? 0}</span>
                </button>
              )
            })}
          </div>
          <p className="journal-filters__count" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? 'story' : 'stories'}
          </p>
        </div>

        {visible.length > 0 ? (
          <div className="journal-grid">
            {visible.map((post, index) => <PostCard key={post.slug} post={post} index={index} />)}
          </div>
        ) : (
          <div className="journal-empty">
            <h3>More stories coming soon.</h3>
            <p>Try another topic, or read the full archive on the original blog.</p>
            <a href="https://blog.shanthikasiraj.com/" target="_blank" rel="noopener noreferrer" className="journal-read">
              Visit the archive <Icon name="arrowUpRight" size={16} />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Themes                                                             */
/* ------------------------------------------------------------------ */
function Themes({ onChoose }) {
  return (
    <section className="journal-themes">
      <div className="container">
        <div className="journal-section-head" data-reveal>
          <div>
            <p className="eyebrow"><span className="status-dot status-dot--dark" />Read by theme</p>
            <h2 className="section-title">
              Pick your <em>starting point.</em>
            </h2>
          </div>
          <p className="journal-section-head__copy">
            Six themes, one philosophy: train with your body, eat like a human, and keep showing up.
          </p>
        </div>

        <div className="journal-themes__grid">
          {topics.map((topic, index) => {
            const count = posts.filter((post) => post.topics.includes(topic.id)).length
            return (
              <button
                key={topic.id}
                type="button"
                className="journal-theme"
                onClick={() => onChoose(topic.id)}
                data-reveal
                style={{ '--delay': `${index * 60}ms` }}
              >
                <span className="journal-theme__top">
                  <span className="journal-theme__number">0{index + 1}</span>
                  <span className="journal-theme__count">{count} {count === 1 ? 'story' : 'stories'}</span>
                </span>
                <span className="journal-theme__label">{topic.label}</span>
                <span className="journal-theme__blurb">{topic.blurb}</span>
                <span className="journal-theme__arrow" aria-hidden="true"><Icon name="arrowUpRight" size={18} /></span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Watch                                                              */
/* ------------------------------------------------------------------ */
function Watch({ activeVideo, setActiveVideo }) {
  return (
    <section className="journal-watch" id="watch">
      <span className="journal-watch__glow" aria-hidden="true" />
      <div className="container">
        <div className="journal-section-head journal-section-head--light" data-reveal>
          <div>
            <p className="eyebrow eyebrow--light"><Icon name="youtube" size={14} /> Watch &amp; move</p>
            <h2 className="section-title section-title--light">
              Wellness worth <em>pressing play for.</em>
            </h2>
            <p className="journal-section-head__copy">
              Short, practical videos from the studio floor — form fixes, food myths and honest conversations
              about women&apos;s health.
            </p>
          </div>
          <a
            className="journal-btn journal-btn--light"
            href="https://www.youtube.com/@shanthikasiraj"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="youtube" size={18} />
            Subscribe on YouTube
          </a>
        </div>

        <div className="journal-watch__grid">
          {watchVideos.map((video, index) => (
            <button
              key={video.id}
              type="button"
              className="journal-video"
              onClick={() => setActiveVideo(video)}
              aria-label={`Play ${video.title}`}
              data-reveal
              style={{ '--delay': `${Math.min(index, 5) * 60}ms` }}
            >
              <span className="journal-video__media">
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
                  }}
                />
                <span className="journal-video__shade" aria-hidden="true" />
                <span className="journal-video__tag">{video.tag}</span>
                <span className="journal-video__play" aria-hidden="true"><Icon name="play" size={18} /></span>
              </span>
              <span className="journal-video__body">
                <span className="journal-video__title">{video.cardTitle}</span>
                <span className="journal-video__meta">
                  Watch now <Icon name="arrowUpRight" size={13} />
                </span>
              </span>
            </button>
          ))}
        </div>

        <p className="journal-watch__hint">Tap any video to watch without leaving the page.</p>
      </div>

      {activeVideo && (
        <div
          className="reel-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onMouseDown={(event) => event.target === event.currentTarget && setActiveVideo(null)}
        >
          <div className="reel-modal__panel">
            <button
              type="button"
              className="reel-modal__close"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
            >
              <Icon name="close" size={20} />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&playsinline=1`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Coach                                                              */
/* ------------------------------------------------------------------ */
function Coach() {
  return (
    <section className="journal-coach">
      <div className="container journal-coach__grid">
        <figure className="journal-coach__photo" data-reveal>
          <img src={coach.image} alt="Shanthi Kasiraj coaching a women’s fitness class" loading="lazy" />
          <figcaption>
            <strong>{coach.name}</strong>
            <span>{coach.role}</span>
          </figcaption>
        </figure>

        <div className="journal-coach__copy" data-reveal style={{ '--delay': '120ms' }}>
          <p className="eyebrow"><span className="status-dot status-dot--dark" />Who writes this</p>
          <h2 className="section-title">
            Coaching first. <em>Writing second.</em>
          </h2>
          <blockquote>“{coach.quote}”</blockquote>
          <ul className="journal-coach__creds">
            {coach.credentials.map((item) => (
              <li key={item}><Icon name="check" size={14} />{item}</li>
            ))}
          </ul>
          <div className="journal-coach__actions">
            <Link to="/#about" className="journal-read">
              More about Shanthi <Icon name="arrowUpRight" size={16} />
            </Link>
            <Link to="/#services" className="journal-read">
              Explore coaching <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Channels                                                           */
/* ------------------------------------------------------------------ */
function Channels() {
  return (
    <section className="journal-channels">
      <div className="container">
        <div className="journal-section-head" data-reveal>
          <div>
            <p className="eyebrow"><span className="status-dot status-dot--dark" />Beyond the blog</p>
            <h2 className="section-title">
              Follow the <em>everyday.</em>
            </h2>
          </div>
          <p className="journal-section-head__copy">
            Between articles you will find me on video, in the comments and inside the community — same
            message, different format.
          </p>
        </div>

        <div className="journal-channels__grid">
          {channels.map((channel, index) => (
            <a
              key={channel.label}
              className="journal-channel"
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              style={{ '--delay': `${index * 60}ms` }}
            >
              <span className="journal-channel__icon"><Icon name={channel.icon} size={22} /></span>
              <span className="journal-channel__followers">{channel.followers}</span>
              <strong>{channel.label}</strong>
              <span className="journal-channel__handle">{channel.handle}</span>
              <span className="journal-channel__note">{channel.note}</span>
              <span className="journal-channel__arrow"><Icon name="arrowUpRight" size={17} /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function BlogPage() {
  useReveal()
  usePageMeta(
    'The Journal — Shanthi Kasiraj | Strength, Nutrition & Women’s Health',
    'Practical articles on strength training, nutrition, hormones and healthy weight loss from fitness coach and nutritionist Shanthi Kasiraj.',
  )

  const [activeVideo, setActiveVideo] = useState(null)
  const [activeTopic, setActiveTopic] = useState('all')

  const chooseTopic = (id) => {
    setActiveTopic(id)
    scrollToLatest()
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveVideo(null)
    }
    document.body.classList.toggle('is-locked', Boolean(activeVideo))
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeVideo])

  const featured = posts.find((post) => post.slug === featuredSlug) || posts[0]

  return (
    <div className="journal-page">
      <Header />
      <main id="main">
        <Hero featured={featured} />
        <div className="journal-ticker">
          <Ticker
            className="ticker--accent"
            items={[
              'Strength for life',
              'Nutrition that fits',
              'Hormones & cycles',
              'No crash diets',
              'Women-only coaching',
              'Real, repeatable results',
            ]}
          />
        </div>
        <Latest active={activeTopic} onTopicChange={setActiveTopic} />
        <Themes onChoose={chooseTopic} />
        <Watch activeVideo={activeVideo} setActiveVideo={setActiveVideo} />
        <Coach />
        <JournalNewsletter />
        <Channels />
        <section className="journal-cta">
          <div className="container">
            <div className="journal-cta__frame" data-reveal>
              <p className="eyebrow eyebrow--light"><span className="status-dot" />Your next chapter</p>
              <h2>
                The best story is the one you <em>live next.</em>
              </h2>
              <p>
                Reading is a start. Coaching is the change. Come for a class, meet the community, or begin
                with a simple conversation about where you are today.
              </p>
              <div className="journal-cta__actions">
                <Link to="/#contact" className="journal-btn journal-btn--accent">
                  Book a consultation <Icon name="arrowUpRight" size={17} />
                </Link>
                <Link to="/#services" className="journal-btn journal-btn--ghost">
                  Explore programmes <Icon name="arrowRight" size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollTop />
    </div>
  )
}
