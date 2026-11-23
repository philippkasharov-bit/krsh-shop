import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/** Gold dot + spring ring that turns into a label over targets; buttons pull toward it (MOTION-SPEC "Cursor"). */
export default function Cursor() {
  const reduce = useReducedMotion()
  const [fine, setFine] = useState(false)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 320, damping: 28 }), ry = useSpring(y, { stiffness: 320, damping: 28 })

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const ok = mq.matches && !reduce
    setFine(ok)
    if (!ok) return
    document.documentElement.classList.add('has-cursor')
    let mag: HTMLElement | null = null
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY)
      const t = (e.target as HTMLElement).closest<HTMLElement>('a,button,[data-cursor],input,select,textarea,label')
      setActive(!!t)
      setLabel(t?.dataset.cursor ?? (t?.tagName === 'A' ? 'View' : ''))
      const m = (e.target as HTMLElement).closest<HTMLElement>('.btn,[data-magnetic]')
      if (mag && mag !== m) { mag.style.transform = ''; mag = null }
      if (m) {
        const r = m.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2), dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
        m.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`
        m.style.transition = 'transform 240ms var(--ease-out)'
        mag = m
      }
    }
    const leave = () => { x.set(-100); y.set(-100) }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [reduce, x, y])

  if (!fine) return null
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120]">
      <motion.div className="absolute h-1.5 w-1.5 -ml-[3px] -mt-[3px] rounded-full bg-gold" style={{ x, y }} />
      <motion.div className="absolute -ml-4 -mt-4 grid h-8 w-8 place-items-center rounded-full border border-gold/70 mix-blend-difference"
        style={{ x: rx, y: ry }} animate={{ scale: active ? (label ? 2.2 : 1.6) : 1 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }}>
        <span className="font-mono text-[4px] uppercase tracking-[0.2em] text-gold">{label}</span>
      </motion.div>
    </div>
  )
}
