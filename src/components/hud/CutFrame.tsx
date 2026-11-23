import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

/** Arch as a polygon (same point count open/closed so it interpolates): straight sides, half-ellipse top. */
function arch(closed: boolean) {
  const pts: string[] = []
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI - (i / 16) * Math.PI
    const x = 50 + Math.cos(a) * 50, y = 30 - Math.sin(a) * 30
    pts.push(`${x.toFixed(2)}% ${closed ? 100 : y.toFixed(2)}%`)
  }
  pts.push('100% 100%', '0% 100%')
  return `polygon(${pts.join(', ')})`
}

const SHAPES = {
  step: { from: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)', to: 'polygon(0 8%, 12% 8%, 12% 0, 100% 0, 100% 92%, 88% 92%, 88% 100%, 0 100%)' },
  diag: { from: 'polygon(0 0, 0 0, 0 0, 0 0, 0 0)', to: 'polygon(0 0, 100% 0, 100% 86%, 82% 100%, 0 100%)' },
  arch: { from: arch(true), to: arch(false) },
} as const

/** Image in a stepped / arch / diagonal frame that opens on entering the viewport; image settles from 1.15 (refs R2, R3). */
export default function CutFrame({ src, alt, shape = 'step', className = '', ratio = 'aspect-[4/5]' }: {
  src: string; alt: string; shape?: keyof typeof SHAPES; className?: string; ratio?: string
}) {
  const reduce = useReducedMotion()
  const s = SHAPES[shape]
  // Watch the unclipped wrapper: a fully clipped element never counts as "in view".
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const open = reduce || inView
  return (
    <div ref={ref} className={`relative ${ratio} ${className}`}>
      <motion.div className="absolute inset-0 overflow-hidden"
        initial={{ clipPath: reduce ? s.to : s.from }} animate={{ clipPath: open ? s.to : s.from }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
        <motion.img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover"
          initial={{ scale: reduce ? 1 : 1.15 }} animate={{ scale: open ? 1 : 1.15 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
      </motion.div>
    </div>
  )
}
