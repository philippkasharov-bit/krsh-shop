import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE } from '../lib/motion'

export function AccordionItem({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className="border-b border-line">
      <h3>
        <button className="flex w-full items-center justify-between py-6 text-left display text-2xl" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          {title}<span className="font-mono text-gold text-xl transition-transform duration-500" style={{ transform: open ? 'rotate(45deg)' : 'none' }} aria-hidden>+</span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={id} role="region" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }} className="overflow-hidden">
            <motion.div className="pb-8 text-ivory-dim leading-relaxed max-w-2xl" initial={{ y: 8 }} animate={{ y: 0 }} transition={{ duration: 0.48, ease: EASE }}>{children}</motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
