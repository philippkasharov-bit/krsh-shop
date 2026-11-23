import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { useTitle } from '../lib/seo'

const TITLE = 'Off the path.'

/** 404: the logo's wings flap; title letters scatter away from the cursor (MOTION-SPEC "Other pages"). */
export default function NotFound() {
  useTitle('Not found')
  const reduce = useReducedMotion()
  const ref = useRef<HTMLHeadingElement>(null)
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null)
  return (
    <div className="wrap grid min-h-[100svh] place-content-center pt-24 text-center"
      onPointerMove={(e) => { if (!reduce && e.pointerType === 'mouse') setPt({ x: e.clientX, y: e.clientY }) }} onPointerLeave={() => setPt(null)}>
      <motion.img src="/brand/logo-dark.webp" alt="" aria-hidden className="mx-auto h-28 w-28 object-contain"
        animate={reduce ? undefined : { rotate: [-6, 6, -6], scaleX: [1, 0.9, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} />
      <p className="eyebrow mt-6">Error 404</p>
      <h1 ref={ref} className="display t-mega mt-4" aria-label={TITLE}>
        {[...TITLE].map((ch, i) => <Letter key={i} ch={ch} pt={pt} gold={i >= 4} />)}
      </h1>
      <p className="mt-6 text-ivory-dim">That page wandered off into the forest. The tent shop is still open.</p>
      <Link to="/shop" className="btn btn-gold mx-auto mt-10">Back to the collection</Link>
    </div>
  )
}

function Letter({ ch, pt, gold }: { ch: string; pt: { x: number; y: number } | null; gold: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  let x = 0, y = 0, r = 0
  if (pt && ref.current) {
    const b = ref.current.getBoundingClientRect()
    const dx = b.left + b.width / 2 - pt.x, dy = b.top + b.height / 2 - pt.y
    const d = Math.hypot(dx, dy)
    if (d < 160) { const f = (160 - d) / 160; x = (dx / (d || 1)) * f * 40; y = (dy / (d || 1)) * f * 40; r = f * (dx > 0 ? 18 : -18) }
  }
  return (
    <motion.span ref={ref} aria-hidden className={`inline-block ${gold ? 'text-gold' : ''}`} animate={{ x, y, rotate: r }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
      {ch === ' ' ? ' ' : ch}
    </motion.span>
  )
}
