import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { testimonials } from '../data/content'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef(null)
  const count = testimonials.length

  const goTo = (next) => setIndex(((next % count) + count) % count)
  const go = (direction) => goTo(index + direction)

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % count), 6500)
    return () => clearInterval(timer)
  }, [paused, count])

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    }
  }

  const onTouchStart = (event) => {
    touchStart.current = event.touches[0].clientX
  }

  const onTouchEnd = (event) => {
    if (touchStart.current === null) return
    const delta = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 45) go(delta < 0 ? 1 : -1)
    touchStart.current = null
  }

  return (
    <section className="section stories" id="stories">
      <div className="stories__glow" aria-hidden="true" />
      <div className="container stories__grid">
        <div className="stories__intro" data-reveal>
          <p className="eyebrow eyebrow--light">
            <span className="status-dot" />
            Success stories
          </p>
          <h2 className="section-title section-title--light">
            Real women.
            <br />
            <em>Real strength.</em>
          </h2>
          <p className="section-head__copy">
            The wins that matter aren’t just physical. They’re clearer mornings, calmer minds, heavier
            lifts and the quiet confidence of showing up for yourself.
          </p>

          <div className="stories__rating">
            <span className="stories__rating-value">5.0</span>
            <div>
              <span className="stars stars--accent">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Icon key={starIndex} name="star" size={15} />
                ))}
              </span>
              <p>From the women who train with me</p>
            </div>
          </div>
        </div>

        <div
          className="stories__slider"
          data-reveal
          style={{ '--delay': '120ms' }}
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="stories__viewport">
            {testimonials.map((item, itemIndex) => (
              <blockquote
                key={item.name}
                className={`quote ${itemIndex === index ? 'is-active' : ''}`}
                aria-hidden={itemIndex !== index}
                aria-roledescription="slide"
                aria-label={`${itemIndex + 1} of ${count}`}
              >
                <span className="quote__mark" aria-hidden="true">
                  “
                </span>
                <p className="quote__text">{item.quote}</p>
                <footer className="quote__author">
                  <span className="quote__avatar" aria-hidden="true">
                    {item.initials}
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <span className="quote__stars stars">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Icon key={starIndex} name="star" size={12} />
                    ))}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>

          <div className="stories__controls">
            <div className="stories__dots">
              {testimonials.map((item, dotIndex) => (
                <button
                  key={item.name}
                  type="button"
                  className={`dot ${dotIndex === index ? 'is-active' : ''}`}
                  aria-label={`Show testimonial from ${item.name}`}
                  aria-pressed={dotIndex === index}
                  onClick={() => goTo(dotIndex)}
                />
              ))}
            </div>
            <span className="stories__counter">
              <strong>{String(index + 1).padStart(2, '0')}</strong>
              <span>/</span>
              {String(count).padStart(2, '0')}
            </span>
            <div className="rail-controls rail-controls--light">
              <button type="button" className="rail-btn rail-btn--light" aria-label="Previous testimonial" onClick={() => go(-1)}>
                <Icon name="chevronLeft" size={20} />
              </button>
              <button type="button" className="rail-btn rail-btn--light" aria-label="Next testimonial" onClick={() => go(1)}>
                <Icon name="chevronRight" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
