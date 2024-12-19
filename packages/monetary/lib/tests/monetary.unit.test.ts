import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Monetary } from '../monetary.js'

describe('Monetary class', () => {
  describe('Monetary calculations', () => {
    it('adds monetaries', () => {
      const p1 = new Monetary(350, 'USD', 2)
      const p2 = new Monetary(150, 'USD', 2)
      const r = p1.add(p2)

      expect(r.equals(new Monetary(500, 'USD', 2))).toBe(true)
    })

    it('subtracts monetaries', () => {
      const p1 = new Monetary(350, 'USD', 2)
      const p2 = new Monetary(150, 'USD', 2)
      const r = p1.subtract(p2)

      expect(r.equals(new Monetary(200, 'USD', 2))).toBe(true)
    })

    it('multiplies and round monetary', () => {
      const p1 = new Monetary(350, 'USD', 2)
      const r = p1.multiply(1.05).round()

      expect(r.equals(new Monetary(368, 'USD', 2))).toBe(true)
    })
  })

  describe('Monetary comparisons', () => {
    it('adds monetaries', () => {
      const p1 = new Monetary(350, 'USD', 2)
      const p2 = new Monetary(150, 'USD', 2)
      const p3 = new Monetary(350, 'USD', 2)
      
      expect(p1.equals(p1)).toBe(true)
      expect(p1.equals(p2)).toBe(false)
      expect(p1.equals(p3)).toBe(true)

      expect (p1 > p2).toBe(true)
      expect (p1 < p2).toBe(false)
      expect (p1 >= p2).toBe(true)
      expect (p1 <= p2).toBe(false)

      expect (p1 > p3).toBe(false)
      expect (p1 < p3).toBe(false)
      expect (p1 >= p3).toBe(true)
      expect (p1 <= p3).toBe(true)
    })
  })

  describe('Monetary to string', () => {
    it('converts monetary to string with precision 2', () => {
      const p1 = new Monetary(350, 'USD', 2)
      const r = p1.toString()

      expect(r).toBe('3.50 USD')
    })

    it('converts monetary to string', () => {
      const p1 = new Monetary(35000, 'USD', 4)
      const r = p1.toString()

      expect(r).toBe('3.5000 USD')
    })
  })
})
