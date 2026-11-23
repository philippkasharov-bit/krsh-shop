import { useScroll, useSpring, useTransform, useVelocity, type MotionValue } from 'motion/react'

/** Scroll speed in px/s → -1..1 (4000 px/s is full speed). */
export const mapVelocity = (pxPerS: number) => Math.max(-1, Math.min(1, pxPerS / 4000))

/** Smoothed page scroll velocity, -1 (fast up) .. 1 (fast down). */
export function useScrollVelocity(): MotionValue<number> {
  const { scrollY } = useScroll()
  const raw = useVelocity(scrollY)
  const mapped = useTransform(raw, mapVelocity)
  return useSpring(mapped, { stiffness: 120, damping: 30 })
}
