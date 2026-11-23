import { describe, expect, it } from 'vitest'
import { beatPhase, BEAT_MS } from './beat'
import { mapVelocity } from './useVelocity'

describe('beat clock', () => {
  it('128 BPM is a 468.75 ms beat', () => expect(BEAT_MS).toBeCloseTo(468.75))
  it('phase starts at 0, is 0.5 mid-beat and wraps', () => {
    expect(beatPhase(0)).toBe(0)
    expect(beatPhase(234.375)).toBeCloseTo(0.5)
    expect(beatPhase(468.75)).toBeCloseTo(0)
    expect(beatPhase(703.125)).toBeCloseTo(0.5)
  })
})

describe('mapVelocity', () => {
  it('maps px/s to -1..1, clamped', () => {
    expect(mapVelocity(0)).toBe(0)
    expect(mapVelocity(4000)).toBe(1)
    expect(mapVelocity(-9000)).toBe(-1)
    expect(mapVelocity(2000)).toBeCloseTo(0.5)
  })
})
