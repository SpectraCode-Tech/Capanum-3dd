import data from '../../data.json'
import TLink from '../ui/TLink'
const to = (f) => '/' + f.replace('.html', '')
export default function Footer() {
  return (
    <footer className="foot">
      <div><img src="/mark.png" alt="" height="44" /><strong>{data.NAME}</strong><p>Your trusted partner for global mobility, travel management and seamless logistics. CAC registered, RC {data.RC}.</p></div>
      <div><h4>Services</h4>{data.SVC.map((s) => <TLink key={s.f} to={to(s.f)}>{s.n}</TLink>)}</div>
      <div><h4>Company</h4><TLink to="/about">About us</TLink><TLink to="/services">All services</TLink><TLink to="/corporate-government-ngo">Corporate, government, NGO</TLink><TLink to="/faq">FAQ</TLink><TLink to="/contact">Contact us</TLink></div>
      <div><h4>Reach us</h4><p>{data.ADDRESS}</p>{data.PHONES.map((p) => <a key={p} href={'tel:' + p.replace(/ /g, '')}>{p}</a>)}<a href={'mailto:' + data.EMAIL}>{data.EMAIL}</a><a href={'https://wa.me/' + data.WHATSAPP}>Chat on WhatsApp</a></div>
      <p className="copy">&copy; {new Date().getFullYear()} {data.NAME}. All rights reserved. CAC Registered, RC {data.RC}.</p>
    </footer>
  )
}
