import { AnimatePresence, animate, motion, useInView, useReducedMotion, type Variants } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Motion tokens (docs/MOTION-SPEC.md). */
export const EASE = [0.22, 1, 0.36, 1] as const
export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const
export const EASE_SNAP = [0.34, 1.56, 0.64, 1] as const
export const SPRING = { type: 'spring', stiffness: 320, damping: 28 } as const
export const D = { micro: 0.12, small: 0.24, med: 0.48, large: 0.8, scene: 1.2 } as const

/** Letters rise from a mask, 28 ms stagger; words never break mid-word. */
export function SplitReveal({ text, className = '', as = 'h1', delay = 0 }: {
  text: string; className?: string; as?: 'h1' | 'h2' | 'h3' | 'p'; delay?: number
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ staggerChildren: reduce ? 0 : 0.028, delayChildren: delay }}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]" style={{ marginRight: i < words.length - 1 ? '0.26em' : 0 }}>
          {[...w].map((ch, j) => (
            <motion.span key={j} className="inline-block"
              variants={{ hidden: { y: reduce ? 0 : '110%', opacity: reduce ? 0 : 1 }, show: { y: 0, opacity: 1 } } as Variants}
              transition={{ duration: reduce ? 0.2 : 0.9, ease: EASE_OUT }}>{ch}</motion.span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

export function Fade({ children, delay = 0, y = 24, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div className={className} initial={{ opacity: 0, y: reduce ? 0 : y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: reduce ? 0.2 : 1, ease: EASE_OUT, delay }}>
      {children}
    </motion.div>
  )
}

/** Number counts up when it enters the viewport (1200 ms). Non-numeric text is shown as is. */
export function CountUp({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const target = Number(value.replace(/[^\d.]/g, ''))
  const [shown, setShown] = useState(reduce || !target ? value : '0')
  useEffect(() => {
    if (!inView || reduce || !target) return
    const c = animate(0, target, { duration: 1.2, ease: EASE_OUT, onUpdate: (v) => setShown(String(Math.round(v))) })
    return () => c.stop()
  }, [inView, reduce, target])
  return <span ref={ref} className={className} aria-label={value}>{shown}</span>
}

/** Mono label types itself in (18 ms per character) on entering the viewport. */
export function TypeIn({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? text.length : 0)
  useEffect(() => {
    if (!inView || reduce) return
    let i = 0
    const t = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(t) }, 18)
    return () => clearInterval(t)
  }, [inView, reduce, text])
  return <p ref={ref} className={className} aria-label={text}><span aria-hidden>{text.slice(0, n)}<span className="opacity-0">{text.slice(n)}</span></span></p>
}

/** Number/text that rolls up when it grows and down when it shrinks (240 ms). */
export function Roll({ value, className = '' }: { value: string | number; className?: string }) {
  const prev = useRef(value)
  const up = Number(String(value).replace(/[^\d.]/g, '')) >= Number(String(prev.current).replace(/[^\d.]/g, ''))
  useEffect(() => { prev.current = value }, [value])
  return (
    <span className={`relative inline-flex overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={String(value)} className="inline-block" initial={{ y: up ? '100%' : '-100%' }} animate={{ y: 0 }} exit={{ y: up ? '-100%' : '100%' }} transition={{ duration: 0.24, ease: EASE_OUT }}>{value}</motion.span>
      </AnimatePresence>
    </span>
  )
}
