import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useScrollVelocity } from '../lib/useVelocity'
import { useBeat } from '../lib/beat'

/** Speed follows scroll velocity (1x–4x), direction follows scroll direction, stars pulse on the beat. */
export default function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion()
  const vel = useScrollVelocity()
  const beat = useBeat()
  const starOpacity = useTransform(beat, [0, 1], [0.55, 1])
  const x = useMotionValue(0)
  const dir = useRef(1)
  useAnimationFrame((_, delta) => {
    if (reduce) return
    const v = vel.get()
    if (Math.abs(v) > 0.02) dir.current = v > 0 ? 1 : -1
    const speed = 2.5 * (1 + Math.min(3, Math.abs(v) * 6)) // % of half-track per second
    let n = x.get() - dir.current * speed * (delta / 1000)
    if (n <= -50) n += 50
    if (n > 0) n -= 50
    x.set(n)
  })
  const tx = useTransform(x, (v) => `${v}%`)
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-line py-6" aria-hidden>
      <motion.div className="flex gap-16 whitespace-nowrap w-max" style={{ x: tx }}>
        {row.concat(row).map((t, i) => (
          <span key={i} className="display t-2 flex items-center gap-16">
            {t}<motion.span className="text-gold text-2xl" style={{ opacity: starOpacity }}>✦</motion.span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
