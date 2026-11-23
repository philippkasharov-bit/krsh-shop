import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const STEP_IN = 'polygon(0 100%, 25% 100%, 25% 100%, 50% 100%, 50% 100%, 75% 100%, 75% 100%, 100% 100%, 100% 100%, 0 100%)'
const STEP_FULL = 'polygon(0 0, 25% 0, 25% 0, 50% 0, 50% 0, 75% 0, 75% 0, 100% 0, 100% 100%, 0 100%)'
const STEP_OUT = 'polygon(0 0, 25% 0, 25% 0, 50% 0, 50% 0, 75% 0, 75% 0, 100% 0, 100% 0, 0 0)'

/** Stepped wipe over route changes (MOTION-SPEC "Page transition"; ref R2 stepped shapes). */
export default function PageTransition() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const first = useRef(true)
  const [run, setRun] = useState(0)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (!reduce) setRun((n) => n + 1)
  }, [pathname, reduce])
  return (
    <AnimatePresence>
      {run > 0 && (
        <motion.div key={run} aria-hidden className="pointer-events-none fixed inset-0 z-[95] bg-ink-2"
          initial={{ clipPath: STEP_IN }}
          animate={{ clipPath: [STEP_IN, STEP_FULL, STEP_OUT] }}
          transition={{ duration: 1.1, times: [0, 0.45, 1], ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => setRun(0)}>
          <div className="absolute inset-0 grid place-items-center">
            <img src="/brand/logo-dark.webp" alt="" className="h-20 w-20 object-contain opacity-80" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
