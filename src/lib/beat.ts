import { useEffect } from 'react'
import { useMotionValue, useReducedMotion, type MotionValue } from 'motion/react'

/** One shared pulse for the whole site: 128 BPM, like a psytrance kick. */
export const BPM = 128
export const BEAT_MS = 60000 / BPM

/** 0..1 position inside the current beat. */
export const beatPhase = (tMs: number, bpm = BPM) => {
  const len = 60000 / bpm
  const p = (tMs % len) / len
  return p > 0.999999 ? 0 : p
}

/** 1 on the kick, easing to 0 before the next one. Use for opacity/scale pulses. */
export const beatPulse = (phase: number) => Math.pow(1 - phase, 3)

let started = 0
/** Motion value with the pulse (1 → 0 each beat). Stays 0 with reduced motion. */
export function useBeat(): MotionValue<number> {
  const v = useMotionValue(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    if (!started) started = performance.now()
    let raf = 0
    const tick = (t: number) => {
      if (!document.hidden) v.set(beatPulse(beatPhase(t - started)))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce, v])
  return v
}
