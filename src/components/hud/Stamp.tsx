import { motion, useTransform } from 'motion/react'
import { useBeat } from '../../lib/beat'

/** Rotating circular "Drop 01" stamp that slams in and pulses on the beat. */
export default function Stamp({ text = 'Drop 01 · Season 01 · Made after dark · ', className = '' }: { text?: string; className?: string }) {
  const beat = useBeat()
  const scale = useTransform(beat, [0, 1], [1, 1.04])
  const id = 'stamp-' + text.length
  return (
    <motion.div aria-hidden className={`pointer-events-none h-32 w-32 ${className}`}
      initial={{ scale: 1.4, rotate: -20, opacity: 0 }} whileInView={{ scale: 1, rotate: -8, opacity: 1 }} viewport={{ once: true }}
      transition={{ duration: 0.48, ease: [0.34, 1.56, 0.64, 1] }}>
      <motion.svg viewBox="0 0 120 120" className="h-full w-full spin-60" style={{ scale }}>
        <defs><path id={id} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
        <circle cx="60" cy="60" r="56" fill="none" stroke="var(--color-gold)" strokeWidth="1" />
        <circle cx="60" cy="60" r="34" fill="none" stroke="var(--color-gold)" strokeWidth="0.6" strokeDasharray="2 3" />
        <text fontFamily="var(--font-mono)" fontSize="8.4" letterSpacing="2.2" fill="var(--color-gold)"><textPath href={`#${id}`}>{text.toUpperCase()}</textPath></text>
        <text x="60" y="66" textAnchor="middle" fontFamily="var(--font-display)" fontSize="18" fill="var(--color-gold)">PH</text>
      </motion.svg>
    </motion.div>
  )
}
