import { useEffect, useState } from 'react'
import Icon from './Icon'
import Ticker from './Ticker'

const tickerItems = ['Personal training', 'Nutrition coaching', 'Women-only classes', '30-day challenges', 'Online & in studio', 'Sustainable results']

const heroStats = [
  { value: 639, suffix: 'K+', label: 'YouTube community' },
  { value: 1000, suffix: '+', label: 'Women coached' },
  { value: 4, suffix: '+ yrs', label: 'Coaching experience' },
]

function OdometerValue({ value, suffix }) {
  const [display, setDisplay] = useState('0')
  const [spinning, setSpinning] = useState(true)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setDisplay(value.toLocaleString('en-IN'))
      setSpinning(false)
      return undefined
    }

    const duration = 4000
    const start = performance.now()
    let frame = 0

    const tick = (timestamp) => {
      const progress = Math.min(1, (timestamp - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const odometerValue = value < 10
        ? Math.floor((80 + value) * eased) % 10
        : Math.round(value * eased)
      setDisplay(odometerValue.toLocaleString('en-IN'))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setDisplay(value.toLocaleString('en-IN'))
        setSpinning(false)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return <><span className={`hero-odometer${spinning ? ' is-spinning' : ''}`}>{display}</span><span>{suffix}</span></>
}

export default function Hero() {
  return (
    <section className="hero hero--clean" id="home">
      <div className="container hero__clean-inner">
        <div className="hero__clean-content">
          <span className="hero__clean-kicker" data-reveal style={{ '--delay': '50ms' }}>A stronger way to live</span>
          <h1 className="hero__clean-title" data-reveal style={{ '--delay': '100ms' }}>
            <span className="hero-title-line hero-title-line--primary">Feel strong.</span><br />
            <span className="hero-title-line hero-title-line--accent"><em>Live fully.</em></span>
          </h1>
          <p className="hero__clean-lead" data-reveal style={{ '--delay': '170ms' }}>
            Fitness and nutrition coaching for women who want lasting strength, confidence and energy — without extremes.
          </p>
          <div className="hero__clean-actions" data-reveal style={{ '--delay': '230ms' }}>
            <a href="#contact" className="hero__primary-action">Book a consultation <Icon name="arrowUpRight" size={18} /></a>
            <a href="#about" className="hero__text-action">Meet Shanthi Kasiraj <Icon name="arrowRight" size={17} /></a>
          </div>
        </div>

        <figure className="hero__clean-photo" data-reveal style={{ '--delay': '140ms' }}>
          <img src="/images/image1/DSC00418.JPG" alt="Shanthi Kasiraj smiling in a pink sari" width="1162" height="2048" loading="eager" fetchPriority="high" />
          <figcaption>Shanthi Kasiraj <span>Women&apos;s Fitness Coach | Nutritionist | Social Media Influencer</span></figcaption>
        </figure>

        <div className="hero__clean-bottom" data-reveal style={{ '--delay': '300ms' }}>
          <dl className="hero__clean-stats">
            {heroStats.map((stat) => <div key={stat.label}><dd><OdometerValue value={stat.value} suffix={stat.suffix} /></dd><dt>{stat.label}</dt></div>)}
          </dl>
          <a href="#community" className="hero__clean-community"><Icon name="youtube" size={17} /><span>Join the community</span><Icon name="arrowRight" size={15} /></a>
        </div>
      </div>
      <div className="hero__ticker-wrap"><Ticker items={tickerItems} className="ticker--accent" /></div>
    </section>
  )
}
