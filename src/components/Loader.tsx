import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const seen = () => { try { return sessionStorage.getItem('ph-loaded') === '1' } catch { return true } }

/** First-visit loader: logo unfolds, rays turn, then an arch opens onto the site (MOTION-SPEC "Loader"). */
export default function Loader() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => !seen())
  useEffect(() => {
    if (!show) return
    try { sessionStorage.setItem('ph-loaded', '1') } catch { /* private mode */ }
    const t = setTimeout(() => setShow(false), reduce ? 300 : 2000)
    return () => clearTimeout(t)
  }, [show, reduce])
  return (
    <AnimatePresence>
      {show && (
        <motion.div aria-hidden className="fixed inset-0 z-[130] grid place-items-center bg-black"
          exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0 round 0 0 50% 50%)' }}
          initial={{ clipPath: 'inset(0 0 0% 0 round 0)' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <div className="relative h-56 w-56">
            <motion.div className="absolute inset-[18%] rounded-full"
              style={{ background: 'repeating-conic-gradient(from 0deg, rgb(212 166 74 / .55) 0 2deg, transparent 2deg 15deg)', maskImage: 'radial-gradient(circle, transparent 52%, black 54%, black 70%, transparent 72%)' }}
              initial={{ rotate: 0, opacity: 0 }} animate={{ rotate: 90, opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
            <motion.img src="/brand/logo-dark.webp" alt="" className="relative h-full w-full object-contain"
              initial={{ scaleX: 0.6, scaleY: 0.9, opacity: 0, filter: 'blur(8px)' }} animate={{ scaleX: 1, scaleY: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
