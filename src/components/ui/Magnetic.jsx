import { useRef } from 'react'
import gsap from 'gsap'
import TLink from './TLink'

// Button that leans toward the pointer within its bounds.
export default function Magnetic({ to, children }) {
  const el = useRef(null)
  const move = (e) => {
    const r = el.current.getBoundingClientRect()
    gsap.to(el.current, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: 'power3' })
  }
  const leave = () => gsap.to(el.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,.4)' })
  return (
    <span className="mag" onPointerMove={move} onPointerLeave={leave}>
      <TLink to={to} className="bigbtn"><span ref={el}>{children}</span></TLink>
    </span>
  )
}
