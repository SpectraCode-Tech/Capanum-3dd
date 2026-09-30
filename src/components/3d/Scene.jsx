import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { S } from '../../lib/store'
import land from '../../land.json' // real land coverage sampled from Natural Earth (lat, lon pairs)

const R = 2.2
const rad = Math.PI / 180
const ll = (lat, lon, r = R) => new THREE.Vector3(r * Math.cos(lat * rad) * Math.sin(lon * rad), r * Math.sin(lat * rad), r * Math.cos(lat * rad) * Math.cos(lon * rad))
const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const CITY = { Lagos: [6.5, 3.4], Abuja: [9.06, 7.49], Accra: [5.6, -0.19], London: [51.5, -0.12], Dubai: [25.2, 55.3], NewYork: [40.7, -74], Johannesburg: [-26.2, 28], Nairobi: [-1.29, 36.8] }
const ROUTES = [['Lagos', 'London'], ['Lagos', 'Dubai'], ['Abuja', 'Nairobi'], ['Lagos', 'NewYork'], ['Accra', 'Johannesburg'], ['Abuja', 'Lagos'], ['Lagos', 'Accra']]

// Camera story: Nigeria -> the routes out -> close on Lagos and Abuja -> pull back.
const KF = [
  { p: 0, lat: 9, lon: 8, x: 2.6, y: 0, z: 0 },
  { p: 0.3, lat: 32, lon: 22, x: 1.2, y: 0, z: 0.5 },
  { p: 0.55, lat: 8, lon: 5, x: 0, y: -0.2, z: 2.6 },
  { p: 0.8, lat: 14, lon: -15, x: -1.8, y: 0, z: 0.5 },
  { p: 1, lat: 20, lon: 10, x: 0, y: 0, z: -1.5 },
]
function at(p) {
  let i = 0
  while (i < KF.length - 2 && p > KF[i + 1].p) i++
  const a = KF[i], b = KF[i + 1], e = ss(a.p, b.p, p), L = THREE.MathUtils.lerp
  return { lat: L(a.lat, b.lat, e), lon: L(a.lon, b.lon, e), x: L(a.x, b.x, e), y: L(a.y, b.y, e), z: L(a.z, b.z, e) }
}

const tmpM = new THREE.Matrix4(), tmpUp = new THREE.Vector3()

function Globe() {
  const g = useRef(), planes = useRef([]), rings = useRef([])
  const cur = useRef({ lat: 9, lon: 8, x: 2.6, y: 0, z: 0 })
  const dots = useMemo(() => {
    const a = new Float32Array((land.length / 2) * 3)
    for (let i = 0; i < land.length; i += 2) { const v = ll(land[i], land[i + 1], R * 1.003); a.set([v.x, v.y, v.z], (i / 2) * 3) }
    return a
  }, [])
  const routes = useMemo(() => ROUTES.map(([a, b]) => {
    const A = ll(...CITY[a]), B = ll(...CITY[b])
    const c = A.clone().add(B).multiplyScalar(0.5).setLength(R * (1 + Math.max(0.1, (A.distanceTo(B) / R) * 0.45)))
    const curve = new THREE.QuadraticBezierCurve3(A, c, B)
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)), new THREE.LineBasicMaterial({ color: "#a3303a", transparent: true, opacity: 0.9, toneMapped: false }))
    return { curve, line }
  }), [])
  const marks = useMemo(() => ['Lagos', 'Abuja'].map((n) => { const p = ll(...CITY[n], R * 1.01); return { p, q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.clone().normalize()) } }), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const T = at(S.p), c = cur.current, k = Math.min(1, dt * 3)
    if (S.mobile) { T.x = 0; T.y += 1.5 * (1 - ss(0, 0.25, S.p)) }
    for (const key of ['lat', 'lon', 'x', 'y', 'z']) c[key] += (T[key] - c[key]) * k
    g.current.rotation.set(c.lat * rad + S.my * 0.07, -c.lon * rad + S.mx * 0.1 + (S.reduced ? 0 : Math.sin(t * 0.15) * 0.05), 0)
    g.current.position.set(c.x, c.y, c.z)
    g.current.scale.setScalar(S.mobile ? 0.82 : 1)
    routes.forEach((r, i) => {
      const rev = S.reduced ? 1 : Math.min(1, Math.max(0, (t - 0.5 - i * 0.2) / 1.4))
      r.line.geometry.setDrawRange(0, Math.floor(65 * rev))
      const pl = planes.current[i]; if (!pl) return
      pl.visible = rev > 0.99
      const u = S.reduced ? 0.5 : (t * 0.05 * (1 + i * 0.06) + i * 0.37) % 1
      const pos = r.curve.getPoint(u), tan = r.curve.getTangent(u)
      pl.position.copy(pos)
      tmpM.lookAt(pos.clone().add(tan), pos, tmpUp.copy(pos).normalize())
      pl.quaternion.setFromRotationMatrix(tmpM)
    })
    rings.current.forEach((m) => { if (!m) return; const u = (t * 0.7) % 1; m.scale.setScalar(1 + u * 2.4); m.material.opacity = (1 - u) * 0.7 })
  })

  return (
    <group ref={g}>
      <mesh><sphereGeometry args={[R * 0.994, 48, 48]} /><meshBasicMaterial color="#f6ecf1" toneMapped={false} /></mesh>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" array={dots} count={dots.length / 3} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.06} color="#782f5c" sizeAttenuation toneMapped={false} />
      </points>
      {routes.map((r, i) => <primitive key={i} object={r.line} />)}
      {routes.map((_, i) => (
        <mesh key={'p' + i} ref={(el) => (planes.current[i] = el)} visible={false}>
          <coneGeometry args={[0.035, 0.14, 8]} onUpdate={(geo) => geo.rotateX(Math.PI / 2)} />
          <meshBasicMaterial color="#e5262b" />
        </mesh>
      ))}
      {marks.map((m, i) => (
        <group key={i} position={m.p} quaternion={m.q}>
          <mesh><sphereGeometry args={[0.05, 16, 16]} /><meshBasicMaterial color="#e5262b" /></mesh>
          <mesh ref={(el) => (rings.current[i] = el)}><ringGeometry args={[0.07, 0.085, 32]} /><meshBasicMaterial color="#e5262b" transparent side={THREE.DoubleSide} /></mesh>
        </group>
      ))}
    </group>
  )
}

export default function Scene() {
  return (
    <Canvas dpr={[1, S.mobile ? 1.5 : 2]} camera={{ position: [0, 0, 9.5], fov: 38 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}>
      <Globe />
    </Canvas>
  )
}
