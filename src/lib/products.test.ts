import { describe, expect, it } from 'vitest'
import { products, bySlug, slugOf, sizesFor, type Line } from './products'

describe('catalog', () => {
  it('has 16 pieces, 4 per line', () => {
    expect(products).toHaveLength(16)
    const lines: Line[] = ['flash', 'street', 'y2k', 'gear']
    for (const l of lines) expect(products.filter((p) => p.line === l)).toHaveLength(4)
  })

  it('prices match spec', () => {
    expect(bySlug('strobe-jacket')!.price).toBe(320)
    expect(bySlug('flyer-tee')!.price).toBe(65)
    expect(bySlug('visor')!.price).toBe(85)
  })

  it('sizesFor apparel/shoe/onesize', () => {
    expect(sizesFor(bySlug('warehouse-hoodie')!)).toEqual(['XS', 'S', 'M', 'L', 'XL'])
    const shoe = sizesFor(bySlug('strobe-sneaker')!)
    expect(shoe).toHaveLength(11)
    expect(shoe[0]).toBe('36')
    expect(shoe[10]).toBe('46')
    expect(sizesFor(bySlug('mini-shoulder-bag')!)).toEqual(['One size'])
  })

  it('has no review or rating fields', () => {
    for (const p of products) {
      expect(p).not.toHaveProperty('reviews')
      expect(p).not.toHaveProperty('rating')
    }
  })

  it('has unique slugs', () => {
    expect(new Set(products.map(slugOf)).size).toBe(16)
  })
})

import { ACCENT_HEX, type LogoSpot } from './products'

describe('two-colour + logo placement', () => {
  it('every piece has a base and a known accent', () => {
    for (const p of products) {
      expect(p.base.length).toBeGreaterThan(0)
      expect(Object.keys(ACCENT_HEX)).toContain(p.accent)
    }
  })
  it('each accent is used at least twice', () => {
    for (const a of Object.keys(ACCENT_HEX)) expect(products.filter((p) => p.accent === a).length).toBeGreaterThanOrEqual(2)
  })
  it('logo spot follows the garment table', () => {
    const want: Record<string, LogoSpot> = {
      'strobe-jacket': 'back', 'night-shell': 'back', 'chrome-puffer': 'back', 'warehouse-hoodie': 'back', 'velour-set': 'back',
      'flyer-tee': 'back', 'baby-tee-2000': 'chest', 'laser-corset-top': 'lower-back', 'chain-mail-tank': 'lower-back',
      'glow-cargo': 'thigh', 'utility-pant': 'thigh', 'low-rise-flare': 'thigh',
      'strobe-sneaker': 'heel', 'court-hi': 'heel', 'mini-shoulder-bag': 'front', 'visor': 'temple',
    }
    for (const [slug, spot] of Object.entries(want)) expect(bySlug(slug)!.logo).toBe(spot)
  })
})
