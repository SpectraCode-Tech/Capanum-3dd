import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { S } from './lib/store'
import data from './data.json'
import Loader from './components/ui/Loader'
import Nav from './components/ui/Nav'
import Home from './components/sections/Home'
import { ServicePage, ServicesIndex, About, Faq, Contact, NotFound } from './components/sections/Pages'

gsap.registerPlugin(ScrollTrigger)
const Scene = lazy(() => import('./components/3d/Scene'))
const slug = (f) => '/' + f.replace('.html', '')

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    const lenis = new Lenis({ lerp: S.reduced ? 1 : 0.09 })
    S.lenis = lenis
    lenis.on('scroll', (e) => { S.p = e.limit ? e.scroll / e.limit : 0; S.v = e.velocity; ScrollTrigger.update() })
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    const move = (e) => { S.mx = (e.clientX / innerWidth) * 2 - 1; S.my = (e.clientY / innerHeight) * 2 - 1 }
    addEventListener('pointermove', move)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); removeEventListener('pointermove', move) }
  }, [])

  useEffect(() => {
    S.lenis?.scrollTo(0, { immediate: true })
    document.body.dataset.home = pathname === '/' ? '1' : '0'
    document.body.classList.remove('leaving')
    const t = setTimeout(() => ScrollTrigger.refresh(), 80)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <>
      <Loader />
      <div className="stage" aria-hidden="true"><Suspense fallback={null}><Scene /></Suspense></div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<ServicesIndex />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        {[...data.SVC, ...data.AUD].map((s) => <Route key={s.f} path={slug(s.f)} element={<ServicePage key={s.f} item={s} />} />)}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
