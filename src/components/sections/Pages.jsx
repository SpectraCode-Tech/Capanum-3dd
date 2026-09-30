import { useMemo, useState } from 'react'
import data from '../../data.json'
import TLink from '../ui/TLink'
import Magnetic from '../ui/Magnetic'
import Footer from './Footer'
import { usePageMeta } from '../../lib/meta'

const to = (f) => '/' + f.replace('.html', '')
const Line = ({ children }) => <span className="line"><span>{children}</span></span>

function Shell({ title, desc, h1, lead, children, cta = true }) {
  usePageMeta(title, desc)
  return (
    <main className="page">
      <header className="phead">
        <h1 className="big"><Line>{h1}</Line></h1>
        {lead && <p className="lead">{lead}</p>}
      </header>
      {children}
      {cta && <section className="final small"><h2 className="big">Plan a movement.</h2><Magnetic to="/contact">Start a request</Magnetic></section>}
      <Footer />
    </main>
  )
}

const Faqs = ({ items }) => items.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)

export function ServicePage({ item: s }) {
  return (
    <Shell title={s.title} desc={s.desc} h1={s.h1} lead={s.intro}>
      <section className="cols">
        <div className="prose">
          <h2>What is included</h2>
          <ul>{s.inc.map((x) => <li key={x}>{x}</li>)}</ul>
          {s.steps && <><h2>How it works</h2><ol>{s.steps.map((x) => <li key={x}>{x}</li>)}</ol></>}
          <h2>Questions</h2>
          <Faqs items={s.faq} />
          <h2>Related services</h2>
          <p className="links">{data.SVC.filter((x) => x.f !== s.f).map((x) => <TLink key={x.f} to={to(x.f)} className="ulink">{x.n}</TLink>)}</p>
        </div>
        {s.who && <aside className="aside"><h3>At a glance</h3><p><strong>Who it is for.</strong> {s.who}</p><p><strong>What we need.</strong> {s.need}</p></aside>}
      </section>
    </Shell>
  )
}

export function ServicesIndex() {
  return (
    <Shell title="Travel, Immigration and Logistics Services in Nigeria | Capanum" desc="Flight booking, visa support, airport protocol, fleet management, cargo clearance and corporate event travel from one CAC-registered Nigerian consultancy."
      h1="Services" lead="Everything you need to move people and goods through Nigeria and beyond, handled by one registered team.">
      <section className="rows">
        {[...data.SVC, ...data.AUD].map((s) => (
          <TLink key={s.f} to={to(s.f)} className="serve-row" data-cursor><span>{s.n}</span><i>{s.blurb}</i></TLink>
        ))}
      </section>
    </Shell>
  )
}

export function About() {
  return (
    <Shell title="About Capanum Strategic Solution Associates Ltd | Travel and Logistics in Abuja, Nigeria" desc="Capanum is a CAC-registered one-stop provider of travel, immigration, logistics and event solutions for individuals, corporations, government agencies and NGOs."
      h1="Simplifying global mobility, driven by precision" lead={`${data.NAME} is a fully registered one-stop provider of professional travel, logistics and event management solutions across Africa and beyond.`}>
      <section className="cols"><div className="prose">
        <h2>Our journey and reputation</h2>
        <p>{data.NAME} is incorporated under the Corporate Affairs Commission (CAC) of Nigeria, RC {data.RC}. We have grown into a travel and logistics consultancy built to manage the complexity of both domestic and international mobility.</p>
        <p>We serve individuals, corporate bodies, government agencies and non-governmental organisations with personalised solutions, blending expertise with continuous innovation so every deployment is handled with precision. From strategic corporate retreats to international NGO field deployments, we safeguard your values of transparency and operational excellence.</p>
        <h2>Our mission</h2><p>{data.MISSION}</p>
        <h2>Our vision</h2><p>{data.VISION}</p>
        <h2>Our pillars of excellence</h2>
        <ul>{data.PILLARS.map(([a, b]) => <li key={a}><strong>{a}.</strong> {b}</li>)}</ul>
        <h2>Our business etiquette</h2>
        <ul>{data.ETIQ.map(([a, b]) => <li key={a}><strong>{a}.</strong> {b}</li>)}</ul>
        <h2>Company details</h2>
        <table className="reg"><tbody>
          <tr><th>Legal name</th><td>{data.NAME}</td></tr><tr><th>Registration</th><td>CAC, RC {data.RC}</td></tr>
          <tr><th>Head office</th><td>{data.ADDRESS}</td></tr><tr><th>Branch office</th><td>Lagos State</td></tr>
          <tr><th>Managing Partner</th><td>{data.PARTNER}</td></tr>
        </tbody></table>
      </div></section>
    </Shell>
  )
}

export function Faq() {
  useMemo(() => {}, [])
  return (
    <Shell title="Frequently Asked Questions | Capanum Travel and Logistics" desc="Answers about Capanum's registration, services, visa support, airport protocol, cargo clearance and how to get a quote."
      h1="Questions" lead="Straight answers about how Capanum works.">
      <section className="cols"><div className="prose"><Faqs items={data.FAQ} /></div></section>
    </Shell>
  )
}

const NEEDS = ['Travel management', 'Immigration and eVisa', 'Airport protocol', 'Executive car hire', 'Fleet management', 'Shipping and courier', 'Procurement']
export function Contact() {
  const [f, setF] = useState({ name: '', contact: '', date: '', details: '' })
  const [needs, setNeeds] = useState([])
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const body = ['Hello Capanum,', '', 'Name: ' + (f.name || '(not given)'), 'Contact: ' + (f.contact || '(not given)'), 'Needs: ' + (needs.join(', ') || '(not chosen)'), 'Date: ' + (f.date || '(not fixed)'), 'Details: ' + (f.details || '(none yet)')].join('\n')
  const mail = `mailto:${data.EMAIL}?subject=${encodeURIComponent('Consultation request')}&body=${encodeURIComponent(body)}`
  const wa = `https://wa.me/${data.WHATSAPP}?text=${encodeURIComponent(body)}`
  return (
    <Shell title="Contact Capanum | Abuja and Lagos | Request a Consultation" desc="Reach Capanum in Abuja or Lagos for travel, immigration, airport protocol, car hire, fleet, shipping and procurement. We respond within 24 hours." h1="We are here to clear your path"
      lead="Tell us your situation. Your brief writes itself on the right, and you can send it by email or WhatsApp. We respond to all enquiries within 24 hours." cta={false}>
      <section className="cols">
        <form onSubmit={(e) => e.preventDefault()} className="form">
          <label>Your name<input value={f.name} onChange={set('name')} autoComplete="name" /></label>
          <label>Phone or email<input value={f.contact} onChange={set('contact')} /></label>
          <fieldset><legend>What do you need?</legend><div className="chips">
            {NEEDS.map((n) => <label key={n} className={needs.includes(n) ? 'on' : ''}><input type="checkbox" checked={needs.includes(n)} onChange={() => setNeeds(needs.includes(n) ? needs.filter((x) => x !== n) : [...needs, n])} /><span>{n}</span></label>)}
          </div></fieldset>
          <label>Travel or delivery date<input type="date" value={f.date} onChange={set('date')} /></label>
          <label>Details<textarea rows="4" value={f.details} onChange={set('details')} placeholder="Dates, destination, shipment details or event brief" /></label>
        </form>
        <aside className="aside"><h3>Your brief</h3><pre>{body}</pre>
          <p className="links"><a className="bigbtn sm" href={mail} data-cursor>Send by email</a><a className="bigbtn sm" href={wa} data-cursor>WhatsApp</a></p>
          <h3 style={{ marginTop: '1.6rem' }}>Head office, Abuja</h3><p>{data.ADDRESS}</p>
          <p>{data.PHONES.map((p) => <a key={p} href={'tel:' + p.replace(/ /g, '')} className="ulink" style={{ display: 'block' }}>{p}</a>)}<a className="ulink" href={'mailto:' + data.EMAIL}>{data.EMAIL}</a></p>
          <h3>Branch office</h3><p>Lagos State</p>
          <p className="micro">Managing Partner: {data.PARTNER}</p>
        </aside>
      </section>
    </Shell>
  )
}

export function NotFound() {
  return <Shell title="Page not found | Capanum" desc="This page could not be found." h1="Not here" lead="The link may be old. Try the home page or our services." />
}
