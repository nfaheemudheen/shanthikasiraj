import { useEffect, useState } from 'react'

const NAV_EVENT = 'sk:navigate'

/**
 * Minimal client-side router. The site only needs two kinds of destinations:
 *  - the marketing page at `/` with in-page anchors
 *  - the journal index (`/blog`) and articles (`/blog/:slug`)
 */
export function navigate(to) {
  const target = new URL(to, window.location.origin)
  const samePath = target.pathname === window.location.pathname
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (samePath && target.hash) {
    window.history.replaceState({}, '', to)
    const element = document.querySelector(target.hash)
    element?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    window.dispatchEvent(new Event(NAV_EVENT))
    return
  }

  if (samePath) {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    window.dispatchEvent(new Event(NAV_EVENT))
    return
  }

  window.history.pushState({}, '', to)
  window.dispatchEvent(new Event(NAV_EVENT))
}

export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    window.addEventListener('popstate', update)
    window.addEventListener(NAV_EVENT, update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener(NAV_EVENT, update)
    }
  }, [])

  return path
}

/** In-page anchor that still works when the destination lives on another route. */
export function Link({ to, children, onClick, ...props }) {
  const external = props.target === '_blank' || /^(https?:|mailto:|tel:)/.test(to)

  return (
    <a
      href={to}
      onClick={(event) => {
        if (external) return
        if (event.defaultPrevented || event.button !== 0) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        onClick?.(event)
        navigate(to)
      }}
      {...props}
    >
      {children}
    </a>
  )
}

/** Scrolls to the top on route changes, or to the hash target once it renders. */
export function useRouteScroll(path) {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    let frame = 0
    let attempts = 0
    const tryScroll = () => {
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'start' })
        return
      }
      if (attempts < 12) {
        attempts += 1
        frame = window.requestAnimationFrame(tryScroll)
      }
    }
    frame = window.requestAnimationFrame(tryScroll)
    return () => window.cancelAnimationFrame(frame)
  }, [path])
}
