import { useEffect, useState } from 'react'
import Icon from './Icon'
import { navLinks, contactInfo } from '../data/content'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.body.classList.toggle('is-locked', open)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />

      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-menu-open' : ''}`}>
        <div className="container site-header__inner">
          <a href="#home" className="brand" aria-label="Shanthi Kasiraj — back to top">
            <span className="brand__mark">SK</span>
            <span className="brand__text">
              <strong>Shanthi</strong>
              <small>Fitness &amp; Wellness</small>
            </span>
          </a>

          <nav className="site-nav" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`} data-nav-link className="site-nav__link">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <a href="#contact" className="btn btn--accent btn--sm">
              Book a session
              <Icon name="arrowUpRight" size={16} />
            </a>
            <button
              type="button"
              className="menu-toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              <Icon name={open ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu__glow" aria-hidden="true" />
        <nav className="mobile-menu__nav" aria-label="Mobile">
          {navLinks.map((link, index) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="mobile-menu__link"
              onClick={() => setOpen(false)}
            >
              <span className="mobile-menu__index">0{index + 1}</span>
              {link.label}
            </a>
          ))}
          <a href="#contact" className="mobile-menu__link mobile-menu__link--cta" onClick={() => setOpen(false)}>
            <span className="mobile-menu__index">0{navLinks.length + 1}</span>
            Let’s talk
            <Icon name="arrowUpRight" size={26} />
          </a>
        </nav>

        <div className="mobile-menu__footer">
          <a href={contactInfo.phoneHref}>{contactInfo.phone}</a>
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          <span>{contactInfo.hours}</span>
        </div>
      </div>
    </>
  )
}
