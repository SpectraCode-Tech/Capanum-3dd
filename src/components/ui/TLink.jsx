import { useNavigate, useLocation } from 'react-router-dom'

// Internal link: page fades out with a thin progress bar, then the route changes.
export default function TLink({ to, children, onNavigate, ...rest }) {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const go = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    onNavigate?.()
    if (to === pathname) return
    document.body.classList.add('leaving')
    setTimeout(() => nav(to), 220)
    setTimeout(() => document.body.classList.remove('leaving'), 2000) // safety net
  }
  return <a href={to} onClick={go} {...rest}>{children}</a>
}
