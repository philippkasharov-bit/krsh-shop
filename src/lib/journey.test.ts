import { describe, expect, it } from 'vitest'
import { segmentAt, transformFor } from './journey'
import { scenes } from '../data/journey'
import { bySlug } from './products'

describe('segmentAt', () => {
  it('maps progress to scene index and local progress, clamped', () => {
    expect(segmentAt(0, 5)).toEqual({ index: 0, local: 0 })
    expect(segmentAt(0.5, 5)).toEqual({ index: 2, local: 0.5 })
    expect(segmentAt(1, 5)).toEqual({ index: 4, local: 1 })
    expect(segmentAt(-1, 5)).toEqual({ index: 0, local: 0 })
    expect(segmentAt(2, 5)).toEqual({ index: 4, local: 1 })
  })
})

describe('transformFor', () => {
  it('moves per direction', () => {
    expect(transformFor('zoom-in', 1).scale).toBe(1.6)
    expect(transformFor('zoom-out', 1).scale).toBe(1)
    expect(transformFor('zoom-out', 0).scale).toBe(1.6)
    expect(transformFor('side', 0.5).x).toBe('-15%')
    expect(transformFor('down', 1).y).toBe('-10%')
  })
})

describe('scenes data', () => {
  it('has the 5 scenes in spec order with valid product cards', () => {
    expect(scenes.map((s) => s.id)).toEqual(['gate', 'stage', 'market', 'detail', 'tent'])
    expect(scenes.map((s) => s.dir)).toEqual(['zoom-in', 'down', 'side', 'zoom-in', 'zoom-out'])
    for (const s of scenes) for (const c of s.cards) expect(bySlug(c.slug)).toBeTruthy()
  })
  it('tent shows all 16 pieces', () => {
    expect(scenes[4].cards).toHaveLength(16)
  })
})
