// Shared mutable state read every frame by the 3D scene (no React re-renders).
export const S = {
  p: 0, // page scroll progress 0..1
  v: 0, // scroll velocity
  mx: 0, // pointer x -1..1
  my: 0, // pointer y -1..1
  lenis: null,
  reduced: typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  mobile: typeof innerWidth !== 'undefined' && innerWidth < 800,
}
