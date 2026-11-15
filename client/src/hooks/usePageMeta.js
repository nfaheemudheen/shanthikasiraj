import { useEffect } from 'react'

/** Keeps the document title + description in sync with the active page. */
export function usePageMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''

    if (title) document.title = title
    if (description && meta) meta.setAttribute('content', description)

    return () => {
      document.title = previousTitle
      if (meta) meta.setAttribute('content', previousDescription)
    }
  }, [title, description])
}
