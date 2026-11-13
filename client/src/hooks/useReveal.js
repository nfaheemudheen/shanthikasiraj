import { useEffect } from 'react'

/**
 * Adds `is-visible` to every `[data-reveal]` element as it enters the
 * viewport. Elements are only observed once, keeping scrolling cheap.
 */
export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

/** Tracks which section is currently in view for the navigation. */
export function useActiveSection(ids) {
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!sections.length) return

    const setActive = (id) => {
      document.querySelectorAll('[data-nav-link]').forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`
        link.classList.toggle('is-active', isActive)
        if (isActive) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    }

    const updateActive = () => {
      const marker = window.scrollY + Math.min(160, window.innerHeight * 0.3)
      let activeId = sections[0].id

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY
        if (sectionTop <= marker) activeId = section.id
      })

      setActive(activeId)
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)
    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [ids])
}
