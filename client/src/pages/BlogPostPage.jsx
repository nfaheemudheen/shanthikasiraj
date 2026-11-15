import { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollTop from '../components/ScrollTop'
import Icon from '../components/Icon'
import PostCard from '../components/PostCard'
import { posts } from '../data/posts'
import { coach, topicLabel } from '../data/blog'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { Link } from '../router'

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[’'"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

/** Adds stable ids to headings so the table of contents can link to them. */
function prepareArticle(html) {
  if (!html) return { html: '', headings: [] }
  const doc = new DOMParser().parseFromString(`<div id="article-root">${html}</div>`, 'text/html')
  const root = doc.getElementById('article-root')
  if (!root) return { html, headings: [] }

  const headings = []
  root.querySelectorAll('h2, h3').forEach((heading, index) => {
    const text = heading.textContent?.replace(/\s+/g, ' ').trim()
    if (!text) return
    const id = `${slugify(text) || 'section'}-${index + 1}`
    heading.setAttribute('id', id)
    headings.push({ id, text, level: heading.tagName.toLowerCase() })
  })

  return { html: root.innerHTML, headings }
}

function useShare(post) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : post.url
  const title = post.title

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return {
    copied,
    copy,
    links: {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
  }
}

function ShareRow({ share, compact = false }) {
  return (
    <div className={`article-share ${compact ? 'article-share--compact' : ''}`}>
      <span className="article-share__label">Share</span>
      <button type="button" onClick={share.copy} aria-label="Copy article link">
        {share.copied ? <Icon name="check" size={16} /> : <Icon name="mail" size={16} />}
        <span>{share.copied ? 'Copied' : 'Copy link'}</span>
      </button>
      <a href={share.links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
        <Icon name="whatsapp" size={16} />
      </a>
      <a href={share.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
        <Icon name="linkedin" size={16} />
      </a>
      <a href={share.links.x} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        <span aria-hidden="true" className="article-share__x">X</span>
      </a>
    </div>
  )
}

export default function BlogPostPage({ slug }) {
  useReveal()

  const post = posts.find((item) => item.slug === slug)
  const article = useMemo(() => prepareArticle(post?.content || ''), [post?.content])
  const share = useShare(post || { title: '', url: '' })
  const [activeHeading, setActiveHeading] = useState('')
  const bodyRef = useRef(null)

  usePageMeta(
    post ? `${post.title} — Shanthi Kasiraj` : 'Story not found — Shanthi Kasiraj Journal',
    post?.excerpt,
  )

  useEffect(() => {
    if (!article.headings.length) return undefined
    const elements = article.headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHeading(entry.target.id)
        })
      },
      { rootMargin: '-120px 0px -65% 0px', threshold: 0 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [article.headings, slug])

  if (!post) {
    return (
      <div className="journal-page">
        <Header />
        <main id="main" className="article-missing">
          <div className="container">
            <p className="eyebrow"><span className="status-dot" />404 — Journal</p>
            <h1>That story has moved.</h1>
            <p>We could not find this article. Browse the journal instead — everything is still here.</p>
            <Link to="/blog" className="journal-btn journal-btn--accent">
              Back to the journal <Icon name="arrowRight" size={17} />
            </Link>
          </div>
        </main>
        <Footer />
        <ScrollTop />
      </div>
    )
  }

  const related = [
    ...posts.filter((item) => item.slug !== post.slug && item.topics.some((topic) => post.topics.includes(topic))),
    ...posts.filter((item) => item.slug !== post.slug && !item.topics.some((topic) => post.topics.includes(topic))),
  ].slice(0, 3)

  return (
    <div className="journal-page article-page">
      <Header />
      <main id="main">
        <article>
          <header className="article-hero">
            <span className="article-hero__glow" aria-hidden="true" />
            <div className="container">
              <Link to="/blog" className="article-back">
                <Icon name="chevronLeft" size={15} />
                Back to the journal
              </Link>

              <div className="article-hero__topics">
                {post.topics.map((topic) => (
                  <span key={topic} className="journal-chip journal-chip--outline">{topicLabel(topic)}</span>
                ))}
              </div>

              <h1 className="article-hero__title" data-reveal>{post.title}</h1>

              <p className="article-hero__excerpt" data-reveal style={{ '--delay': '80ms' }}>
                {post.excerpt}
              </p>

              <div className="article-hero__meta" data-reveal style={{ '--delay': '140ms' }}>
                <span className="article-hero__author">
                  <img src="/images/logo.jpeg" alt="" width="40" height="40" />
                  <span>
                    <strong>{coach.name}</strong>
                    <small>{coach.role}</small>
                  </span>
                </span>
                <span className="article-hero__divider" aria-hidden="true" />
                <span><Icon name="calendar" size={14} />{post.dateLabel}</span>
                <span><Icon name="clock" size={14} />{post.readTime} min read</span>
              </div>
            </div>
          </header>

          <figure className="article-cover">
            <div className="container">
              <div className="article-cover__frame">
                <img src={post.cover} alt={post.coverAlt} width="1200" height="670" fetchPriority="high" />
                <span className="article-cover__stamp">The Journal</span>
              </div>
            </div>
          </figure>

          <div className="container article-layout">
            <div className="article-main">
              <div
                className="article-body"
                ref={bodyRef}
                dangerouslySetInnerHTML={{ __html: article.html }}
              />

              {post.tags.length > 0 && (
                <div className="article-tags">
                  <span>Filed under</span>
                  {post.tags.slice(0, 6).map((tag) => (
                    <span key={tag} className="journal-chip journal-chip--outline">{tag}</span>
                  ))}
                </div>
              )}

              <div className="article-author">
                <img src={coach.image} alt={coach.name} loading="lazy" />
                <div>
                  <span>Written by</span>
                  <strong>{coach.name}</strong>
                  <p>{coach.role} helping women build strength, confidence and habits that last.</p>
                  <Link to="/#about" className="journal-read">
                    Meet your coach <Icon name="arrowUpRight" size={15} />
                  </Link>
                </div>
              </div>

              <div className="article-foot">
                <Link to="/blog" className="journal-btn journal-btn--outline">
                  <Icon name="chevronLeft" size={16} />
                  All stories
                </Link>
                <ShareRow share={share} compact />
              </div>
            </div>

            <aside className="article-aside">
              {article.headings.length > 1 && (
                <nav className="article-toc" aria-label="In this article">
                  <p>In this article</p>
                  <ol>
                    {article.headings.map((heading) => (
                      <li key={heading.id} className={heading.level === 'h3' ? 'is-sub' : ''}>
                        <a
                          href={`#${heading.id}`}
                          className={activeHeading === heading.id ? 'is-active' : ''}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div className="article-aside__card">
                <img src={coach.image} alt={coach.name} loading="lazy" />
                <p className="eyebrow"><span className="status-dot" />Need a plan?</p>
                <strong>Train with Shanthi</strong>
                <p>Personalised nutrition, strength coaching and a community that keeps you consistent.</p>
                <Link to="/#contact" className="journal-btn journal-btn--accent journal-btn--block">
                  Book a consultation <Icon name="arrowUpRight" size={16} />
                </Link>
              </div>

              <ShareRow share={share} />
            </aside>
          </div>
        </article>

        <section className="article-related">
          <div className="container">
            <div className="journal-section-head" data-reveal>
              <div>
                <p className="eyebrow"><span className="status-dot status-dot--dark" />Keep reading</p>
                <h2 className="section-title">Next on <em>the journal.</em></h2>
              </div>
              <Link to="/blog" className="journal-read">
                All stories <Icon name="arrowRight" size={16} />
              </Link>
            </div>
            <div className="journal-grid">
              {related.map((item, index) => <PostCard key={item.slug} post={item} index={index} />)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollTop />
    </div>
  )
}
