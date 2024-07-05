import { describe, it } from 'node:test'
import { expect } from 'expect'
import dayjs from 'dayjs'
import { DateTimeRange } from '../date-time-range.js'
import exp from 'node:constants'

describe('DateTimeRange class', () => {
  describe('constructor', () => {
    it('Throw error when upperbound is after lowerbound', () => {
      const lowerBound = dayjs('2024-01-01 17:00:00')
      const upperBound = dayjs('2024-01-01 08:00:00')

      expect(() => new DateTimeRange(lowerBound, upperBound, '[]')).toThrow()
    })
  })

  describe('contains', () => {
    const lowerBound = dayjs('2024-01-01 08:00:00')
    const upperBound = dayjs('2024-01-01 17:00:00')
    const dateBetweenBounds = dayjs('2024-01-01 12:00:00')
    const dateBeforeLowerBound = dayjs('2024-01-01 07:59:59')
    const dateAfterLowerBound = dayjs('2024-01-01 17:00:01')
    
    it('Closed range []', () => {
      const range = new DateTimeRange(lowerBound, upperBound, '[]')

      expect(range.contains(lowerBound)).toBeTruthy()
      expect(range.contains(upperBound)).toBeTruthy()
      expect(range.contains(dateBetweenBounds)).toBeTruthy()
      expect(range.contains(dateBeforeLowerBound)).toBeFalsy()
      expect(range.contains(dateAfterLowerBound)).toBeFalsy()
    })

    it('Open range ()', () => {
      const range = new DateTimeRange(lowerBound, upperBound, '()')

      expect(range.contains(lowerBound)).toBeFalsy()
      expect(range.contains(upperBound)).toBeFalsy()
      expect(range.contains(dateBetweenBounds)).toBeTruthy()
      expect(range.contains(dateBeforeLowerBound)).toBeFalsy()
      expect(range.contains(dateAfterLowerBound)).toBeFalsy()
    })

    it('Closed-Open range [)', () => {
      const range = new DateTimeRange(lowerBound, upperBound, '[)')

      expect(range.contains(lowerBound)).toBeTruthy()
      expect(range.contains(upperBound)).toBeFalsy()
      expect(range.contains(dateBetweenBounds)).toBeTruthy()
      expect(range.contains(dateBeforeLowerBound)).toBeFalsy()
      expect(range.contains(dateAfterLowerBound)).toBeFalsy()
    })

    it('Open-Closed range ()', () => {
      const range = new DateTimeRange(lowerBound, upperBound, '(]')

      expect(range.contains(lowerBound)).toBeFalsy()
      expect(range.contains(upperBound)).toBeTruthy()
      expect(range.contains(dateBetweenBounds)).toBeTruthy()
      expect(range.contains(dateBeforeLowerBound)).toBeFalsy()
      expect(range.contains(dateAfterLowerBound)).toBeFalsy()
    })

    it('infinity upperbound', () => {
      const range = new DateTimeRange(lowerBound, null, '[]')

      expect(range.contains(lowerBound)).toBeTruthy()
      expect(range.contains(upperBound)).toBeTruthy()
      expect(range.contains(dateBetweenBounds)).toBeTruthy()
      expect(range.contains(dateBeforeLowerBound)).toBeFalsy()
      expect(range.contains(dateAfterLowerBound)).toBeTruthy()
    })

    it('infinity lowerbound', () => {
      const range = new DateTimeRange(null, upperBound, '[]')

      expect(range.contains(lowerBound)).toBeTruthy()
      expect(range.contains(upperBound)).toBeTruthy()
      expect(range.contains(dateBetweenBounds)).toBeTruthy()
      expect(range.contains(dateBeforeLowerBound)).toBeTruthy()
      expect(range.contains(dateAfterLowerBound)).toBeFalsy()
    })
  })
})

