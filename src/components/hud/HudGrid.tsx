import { useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useScrollVelocity } from '../../lib/useVelocity'

/** Hairline HUD grid with mono coordinates: draws in, drifts 4px toward the cursor, skews with scroll speed (ref R3). */
export default function HudGrid({ label = '', className = '' }: { label?: string; className?: string }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0), my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 80, damping: 20 }), y = useSpring(my, { stiffness: 80, damping: 20 })
  const vel = useScrollVelocity()
  const skewY = useTransform(vel, [-1, 1], [-2, 2])
  useEffect(() => {
    if (reduce) return
    const on = (e: PointerEvent) => { mx.set((e.clientX / window.innerWidth - 0.5) * 8); my.set((e.clientY / window.innerHeight - 0.5) * 8) }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [reduce, mx, my])
  return (
    <motion.div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={reduce ? undefined : { x, y, skewY }}>
      <motion.div className="absolute inset-0 origin-left"
        style={{ backgroundImage: 'linear-gradient(to right, rgb(243 238 230 / .07) 1px, transparent 1px), linear-gradient(to bottom, rgb(243 238 230 / .07) 1px, transparent 1px)', backgroundSize: '120px 120px' }}
        initial={{ clipPath: 'inset(0 100% 0 0)' }} whileInView={{ clipPath: 'inset(0 0% 0 0)' }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
      <span className="absolute left-3 top-3 font-mono text-[9px] tracking-[0.2em] text-ivory/35">{label || 'N 51°31′ · E 13°24′'}</span>
      <span className="absolute right-3 bottom-3 font-mono text-[9px] tracking-[0.2em] text-ivory/35">PH/26 · 128 BPM</span>
    </motion.div>
  )
}
