import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Monetary } from '../monetary.js'
import { Currency } from '../currency.enum.js'

describe('Monetary class', () => {
  describe('Monetary calculations', () => {
    it('adds monetaries', () => {
      const p1 = new Monetary(350, Currency.USD, 2)
      const p2 = new Monetary(150, Currency.USD, 2)
      const r = p1.add(p2)

      expect(r.equals(new Monetary(500, Currency.USD, 2))).toBe(true)
    })

    it('subtracts monetaries', () => {
      const p1 = new Monetary(350, Currency.USD, 2)
      const p2 = new Monetary(150, Currency.USD, 2)
      const r = p1.subtract(p2)

      expect(r.equals(new Monetary(200, Currency.USD, 2))).toBe(true)
    })

    it('multiplies and rounds monetary', () => {
      const p1 = new Monetary(350, Currency.USD, 2)
      const r = p1.multiply(1.05).round()

      expect(r.equals(new Monetary(368, Currency.USD, 2))).toBe(true)
    })
  })

  describe('Monetary comparisons', () => {
    it('compares monetaries', () => {
      const p1 = new Monetary(350, Currency.USD, 2)
      const p2 = new Monetary(150, Currency.USD, 2)
      const p3 = new Monetary(350, Currency.USD, 2)

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
      const p1 = new Monetary(350, Currency.USD, 2)
      const r = p1.toString()

      expect(r).toBe('3.50 USD')
    })

    it('converts monetary to string with precision 4', () => {
      const p1 = new Monetary(35000, Currency.USD, 4)
      const r = p1.toString()

      expect(r).toBe('3.5000 USD')
    })
  })

  describe('Monetary rounding', () => {
    it('rounds values as expected', () => {
      const price = new Monetary({
        amount: 1000,
        currency: Currency.EUR,
        precision: 2
      })

      expect(price.isRounded()).toBe(true)

      const discountedPrice = price.multiply(0.9999)

      expect(discountedPrice.isRounded()).toBe(false)

      expect(discountedPrice.round().amount).toBe(1000) // -> 10 euros
      expect(discountedPrice.floor().amount).toBe(999) // -> 9.99 euros
      expect(discountedPrice.ceil().amount).toBe(1000)// -> 10 euros
    })
  })
})
