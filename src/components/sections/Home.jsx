import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import data from '../../data.json'
import TLink from '../ui/TLink'
import Magnetic from '../ui/Magnetic'
import Footer from './Footer'
import { usePageMeta } from '../../lib/meta'

const to = (f) => '/' + f.replace('.html', '')
const Line = ({ children }) => <span className="line"><span>{children}</span></span>
const stages = data.PROCESS
const philosophy = data.MISSION

export default function Home() {
  usePageMeta('Capanum Strategic Solution Associates Ltd | Travel, Immigration & Logistics in Abuja, Nigeria',
    'CAC-registered (RC 9240215) travel management, eVisa and immigration support, airport protocol, executive car hire, fleet, shipping and procurement in Abuja and Lagos.')
  const root = useRef(null)

  useLayoutEffect(() => {
    let mm
    const ctx = gsap.context(() => {
      // Scene 2: descent. Words fly past the camera while the page is pinned.
      const words = gsap.utils.toArray('.stage-word')
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.descent', start: 'top top', end: '+=260%', pin: true, scrub: 0.6 } })
      words.forEach((w) => tl.fromTo(w, { scale: 0.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }).to(w, { scale: 2.8, opacity: 0, duration: 1 }))

      // Scene 5: services scroll sideways inside the vertical page (desktop only).
      mm = gsap.matchMedia()
      mm.add('(min-width: 801px)', () => {
        const track = document.querySelector('.track')
        gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none',
          scrollTrigger: { trigger: '.hs', start: 'top top', end: () => '+=' + (track.scrollWidth - innerWidth), pin: true, scrub: 0.5, invalidateOnRefresh: true } })
      })

      // Scene 6: philosophy words light up as you scroll.
      gsap.fromTo('.ph-word', { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: '.philo', start: 'top 70%', end: 'bottom 65%', scrub: true } })
    }, root)
    return () => { mm?.revert(); ctx.revert() }
  }, [])

  return (
    <main ref={root}>
      <section className="hero">
        <p className="micro">CAC registered / RC {data.RC} / Abuja and Lagos</p>
        <h1 className="mega"><Line>Travel,</Line><Line>immigration</Line><Line>&amp; logistics.</Line></h1>
        <p className="lead">Move without limits. Arrive with confidence. One team for travel, immigration, logistics and events, serving individuals, corporations, government agencies and NGOs.</p>
        <span className="cue micro">Scroll to enter</span>
      </section>

      <section className="descent" aria-label="How a movement runs">
        {stages.map(([w, t]) => (
          <div className="stage-word" key={w}><h2>{w}</h2><p>{t}</p></div>
        ))}
      </section>

      <section className="hs" aria-label="Services">
        <div className="track">
          <div className="intro-panel"><h2 className="big">What we handle</h2><p className="micro">{data.SVC.length} services. Use one or combine them on one file.</p></div>
          {data.SVC.map((s, i) => (
            <TLink key={s.f} to={to(s.f)} className="panel" data-cursor>
              <span className="micro">0{i + 1} / 0{data.SVC.length}</span>
              <h3>{s.n}</h3>
              <p>{s.blurb}</p>
              <b className="ulink">Open service</b>
            </TLink>
          ))}
        </div>
      </section>

      <section className="serve">
        <p className="micro">Who we serve</p>
        {data.SERVE.map((a) => (
          <TLink key={a.n} to={a.to} className="serve-row" data-cursor><span>{a.n}</span><i>{a.blurb}</i></TLink>
        ))}
      </section>

      <section className="voices">
        <p className="micro">What clients say</p>
        <div className="vgrid">{data.TEST.map(([q, a]) => <figure key={a}><blockquote>{q}</blockquote><figcaption>{a}</figcaption></figure>)}</div>
      </section>

      <section className="philo">
        <p className="statement">{philosophy.split(' ').map((w, i) => <span className="ph-word" key={i}>{w} </span>)}</p>
      </section>

      <section className="final">
        <h2 className="mega">Plan a<br />movement.</h2>
        <Magnetic to="/contact">Request a consultation</Magnetic>
        <p className="micro">24-hour response. No hidden fees. Clear quotes, always invoiced.</p>
      </section>
      <Footer />
    </main>
  )
}
