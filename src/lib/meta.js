import { useEffect } from 'react'
const BASE = 'https://www.capanumassociates.com'
// Per-route title, description and canonical (Google renders JS, but see README about prerendering).
export function usePageMeta(title, desc) {
  useEffect(() => {
    document.title = title
    let d = document.querySelector('meta[name=description]')
    if (d) d.setAttribute('content', desc)
    let c = document.querySelector('link[rel=canonical]')
    if (c) c.setAttribute('href', BASE + (location.pathname === '/' ? '/' : location.pathname))
  }, [title, desc])
}
