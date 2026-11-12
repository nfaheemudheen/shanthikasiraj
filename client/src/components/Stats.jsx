import { useEffect, useRef, useState } from 'react'
import { stats } from '../data/content'

function useCountUp(target, decimals = 0, duration = 1700) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(decimals > 0 ? (0).toFixed(decimals) : '0')

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setDisplay(target.toLocaleString('en-IN', { maximumFractionDigits: decimals }))
      return
    }

    let frame = 0
    let started = false

    const animate = (start) => {
      const step = (timestamp) => {
        const progress = Math.min(1, (timestamp - start) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        const value = target * eased
        setDisplay(
          value.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }),
        )
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true
            animate(performance.now())
            observer.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, decimals, duration])

  return [ref, display]
}

function Stat({ stat }) {
  const decimals = Number.isInteger(stat.value) ? 0 : 1
  const [ref, display] = useCountUp(stat.value, decimals)

  return (
    <div className="stat" data-reveal>
      <p className="stat__value" ref={ref}>
        {display}
        <span>{stat.suffix}</span>
      </p>
      <p className="stat__label">{stat.label}</p>
      <p className="stat__note">{stat.note}</p>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="stats" aria-label="Community statistics">
      <div className="container">
        <div className="stats__head">
          <p className="eyebrow">
            <span className="status-dot status-dot--dark" />
            The community
          </p>
          <p className="stats__intro">
            Thousands of women showing up for themselves — one workout, one meal, one stronger day at a time.
          </p>
        </div>
        <div className="stats__grid">
          {stats.map((stat) => (
            <Stat key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
