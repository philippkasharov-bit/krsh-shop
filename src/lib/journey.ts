export type Dir = 'down' | 'side' | 'zoom-in' | 'zoom-out'

/** Scroll progress 0..1 across n scenes → which scene and how far into it (0..1). */
export function segmentAt(progress: number, n: number): { index: number; local: number } {
  const p = Math.max(0, Math.min(1, progress))
  if (p >= 1) return { index: n - 1, local: 1 }
  const f = p * n
  const index = Math.floor(f)
  return { index, local: Math.round((f - index) * 1e6) / 1e6 }
}

/** Camera move for a scene at local progress (MOTION-SPEC "Journey"). */
export function transformFor(dir: Dir, local: number): { x: string; y: string; scale: number } {
  const l = Math.max(0, Math.min(1, local))
  const r = (v: number) => Math.round(v * 1000) / 1000
  switch (dir) {
    case 'down': return { x: '0%', y: `${r(-l * 10)}%`, scale: 1.12 }
    case 'side': return { x: `${r(-l * 30)}%`, y: '0%', scale: 1 }
    case 'zoom-in': return { x: '0%', y: '0%', scale: r(1 + l * 0.6) }
    case 'zoom-out': return { x: '0%', y: '0%', scale: r(1.6 - l * 0.6) }
  }
}
