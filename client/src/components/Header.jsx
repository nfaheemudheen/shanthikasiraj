import { useEffect, useState } from 'react'
import Icon from './Icon'
import { navLinks, contactInfo } from '../data/content'
import { Link, usePath } from '../router'

export default function Header({ onOpenContact }) {
  const path = usePath()
  const onJournal = path.startsWith('/blog')
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

  /** Journal is a real route; every other nav item is an anchor on the home page. */
  const linkFor = (id) => (id === 'blog' ? 'http://localhost:4173/blog' : `${onJournal ? '/' : ''}#${id}`)

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />

      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-menu-open' : ''}`}>
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label="Shanthi Kasiraj — back to top">
            <span className="brand__mark"><img src="/images/logo.jpeg" alt="" /></span>
            <span className="brand__text">
              <strong>Shanthi Kasiraj</strong>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {navLinks.map((link) => {
              const isActive = link.id === 'blog' && onJournal
              return (
                <Link
                  key={link.id}
                  to={linkFor(link.id)}
                  data-nav-link
                  className={`site-nav__link ${isActive ? 'is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="site-header__actions">
            {onOpenContact ? (
              <button type="button" className="btn btn--accent btn--sm" onClick={onOpenContact}>
                Book a session
                <Icon name="arrowUpRight" size={16} />
              </button>
            ) : (
              <Link to="/#contact" className="btn btn--accent btn--sm">
                Book a session
                <Icon name="arrowUpRight" size={16} />
              </Link>
            )}
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
        <nav className="mobile-menu__nav" aria-label="Mobile">
          {navLinks.map((link, index) => (
            <Link
              key={link.id}
              to={linkFor(link.id)}
              className="mobile-menu__link"
              onClick={() => setOpen(false)}
            >
              <span className="mobile-menu__index">0{index + 1}</span>
              {link.label}
            </Link>
          ))}
          <Link to="/#contact" className="mobile-menu__link mobile-menu__link--cta" onClick={() => setOpen(false)}>
            <span className="mobile-menu__index">0{navLinks.length + 1}</span>
            Let’s talk
            <Icon name="arrowUpRight" size={26} />
          </Link>
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
