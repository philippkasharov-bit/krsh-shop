import { describe, expect, it } from 'vitest'
import { sanitizeCart, sanitizeWish } from './store'

describe('sanitizeCart', () => {
  it('drops unknown ids and sizes not valid for the product', () => {
    const out = sanitizeCart([
      { id: 0, size: 'M', qty: 2 },      // Strobe Jacket, valid
      { id: 0, size: 9, qty: 1 },        // old numeric shoe size
      { id: 12, size: '40', qty: 1 },    // Strobe Sneaker, valid
      { id: 99, size: 'M', qty: 1 },     // unknown id
      { id: 14, size: 'One size', qty: 1 },
      null,
    ])
    expect(out).toEqual([
      { id: 0, size: 'M', qty: 2 },
      { id: 12, size: '40', qty: 1 },
      { id: 14, size: 'One size', qty: 1 },
    ])
  })
  it('returns [] for non-arrays', () => {
    expect(sanitizeCart('x')).toEqual([])
    expect(sanitizeCart(null)).toEqual([])
  })
})

describe('sanitizeWish', () => {
  it('keeps only known numeric ids', () => {
    expect(sanitizeWish([1, 99, 'a', 3])).toEqual([1, 3])
    expect(sanitizeWish({})).toEqual([])
  })
})
