import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { S } from '../../lib/store'
import TLink from './TLink'

const links = [['Services', '/services'], ['About', '/about'], ['FAQ', '/faq'], ['Contact', '/contact']]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const bar = useRef(null)
  useEffect(() => {
    const t = () => { if (bar.current) bar.current.style.transform = `scaleY(${S.p})` }
    gsap.ticker.add(t)
    return () => gsap.ticker.remove(t)
  }, [])
  useEffect(() => { S.lenis?.[open ? 'stop' : 'start']() }, [open])
  const close = () => setOpen(false)
  return (
    <>
      <header className="nav">
        <TLink to="/" className="logo" onNavigate={close} aria-label="Capanum home">
          <img src="/mark.png" alt="" height="38" />
          <span className="wm"><b>CAPANUM</b><small>Associates Limited</small></span>
        </TLink>
        <nav aria-label="Main" className={open ? 'open' : ''}>
          {links.map(([n, h]) => <TLink key={h} to={h} className="ulink" onNavigate={close}>{n}</TLink>)}
        </nav>
        <button className={'burger' + (open ? ' x' : '')} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><i /><i /><i /></button>
      </header>
      <div className="prog" aria-hidden="true"><i ref={bar} /></div>
    </>
  )
}
