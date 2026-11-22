import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

export const EASE = [0.22, 1, 0.36, 1] as const

/** Word-by-word masked rise (technique: React Bits "split text" / Motion stagger). */
export function SplitReveal({ text, className = '', as = 'h1', delay = 0 }: {
  text: string; className?: string; as?: 'h1' | 'h2' | 'h3' | 'p'; delay?: number
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ staggerChildren: reduce ? 0 : 0.07, delayChildren: delay }}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span className="inline-block" style={{ marginRight: i < words.length - 1 ? '0.26em' : 0 }}
            variants={{ hidden: { y: reduce ? 0 : '110%' }, show: { y: 0 } } as Variants}
            transition={{ duration: 1.1, ease: EASE }}>{w}</motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function Fade({ children, delay = 0, y = 24, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div className={className} initial={{ opacity: 0, y: reduce ? 0 : y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: 1, ease: EASE, delay }}>
      {children}
    </motion.div>
  )
}
