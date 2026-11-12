import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { reels } from '../data/content'

export default function Reels() {
  const railRef = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  const [activeReel, setActiveReel] = useState(null)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveReel(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const updateEdges = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    setEdges({
      start: rail.scrollLeft <= 12,
      end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 12,
    })
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    updateEdges()
    rail.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      rail.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [updateEdges])

  const scrollBy = (direction) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.72, 620), behavior: 'smooth' })
  }

  const openReel = (event, reel) => {
    event.preventDefault()
    setActiveReel(reel)
  }

  const getEmbedUrl = (href) => {
    const match = href.match(/(?:shorts\/|watch\?v=|youtu\.be\/)([^?&/]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : href
  }

  return (
    <section className="section reels" id="reels">
      <div className="container">
        <div className="section-head reels__head">
          <div>
            <p className="eyebrow">
              <span className="status-dot status-dot--dark" />
              Latest reels
            </p>
            <h2 className="section-title">
              Train with me, <em>anywhere.</em>
            </h2>
            <p className="section-head__copy">
              Quick, practical workouts and honest nutrition tips — free on YouTube, for every woman, at
              every stage.
            </p>
          </div>

          <div className="reels__aside">
            <div className="reels__count">
              <Icon name="youtube" size={22} />
              <div>
                <strong>639K+</strong>
                <span>subscribers strong</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="reels__rail-wrap">
        <div className="reels__controls-row" aria-label="Reel navigation">
          <div className="rail-controls">
            <button
              type="button"
              className="rail-btn"
              aria-label="Previous reels"
              onClick={() => scrollBy(-1)}
              disabled={edges.start}
            >
              <Icon name="chevronLeft" size={20} />
            </button>
            <button
              type="button"
              className="rail-btn"
              aria-label="More reels"
              onClick={() => scrollBy(1)}
              disabled={edges.end}
            >
              <Icon name="chevronRight" size={20} />
            </button>
          </div>
        </div>
        <div className="reels__rail" ref={railRef}>
          {reels.map((reel, index) => (
            <a
              key={reel.id}
              className="reel-card"
              href={reel.href}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              style={{ '--delay': `${index * 80}ms` }}
              onClick={(event) => openReel(event, reel)}
            >
              <img
                src={reel.image}
                alt={reel.alt}
                width="720"
                height="1280"
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = reel.image.replace('/maxresdefault.jpg', '/sddefault.jpg')
                }}
              />
              <span className="reel-card__shade" aria-hidden="true" />
              <span className="reel-card__play" aria-label={`Play ${reel.title}`}>
                <Icon name="play" size={20} />
              </span>
              <span className="reel-card__meta">
                <span className="reel-card__views">{reel.views}</span>
                <strong>{reel.title}</strong>
                <span className="reel-card__watch">
                  Play video
                  <Icon name="play" size={13} />
                </span>
              </span>
            </a>
          ))}
        </div>
        <div className={`reels__fade ${edges.end ? 'is-hidden' : ''}`} aria-hidden="true" />
      </div>

      <div className="container reels__foot">
        <a
          href="https://www.youtube.com/@shanthikasiraj"
          target="_blank"
          rel="noopener noreferrer"
          className="link-arrow"
        >
          See all videos on YouTube
          <Icon name="arrowUpRight" size={17} />
        </a>
      </div>

      {activeReel && (
        <div className="reel-modal" role="dialog" aria-modal="true" aria-label={activeReel.title} onMouseDown={(event) => event.target === event.currentTarget && setActiveReel(null)}>
          <div className="reel-modal__panel">
            <button type="button" className="reel-modal__close" onClick={() => setActiveReel(null)} aria-label="Close video">
              <Icon name="close" size={20} />
            </button>
            <iframe src={getEmbedUrl(activeReel.href)} title={activeReel.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}
    </section>
  )
}
