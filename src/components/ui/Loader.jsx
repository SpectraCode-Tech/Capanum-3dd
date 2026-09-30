import { useEffect, useState } from 'react'

// Brief brand splash: waits for fonts (max ~1.8s, min 0.7s), then fades away.
export default function Loader() {
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const min = new Promise((r) => setTimeout(r, 700))
    const fonts = Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1800))])
    Promise.all([min, fonts]).then(() => {
      document.body.classList.add('ready'); setOut(true); setTimeout(() => setGone(true), 600)
    })
  }, [])
  if (gone) return null
  return <div className={'loader' + (out ? ' out' : '')} role="status" aria-label="Loading"><img src="/mark.png" alt="" width="64" /><i /></div>
}
