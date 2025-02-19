import {describe, it} from "node:test";
import {expect} from "expect";
import {WiseDate} from "../wise-date.js";
import {DateRange} from "../date-range.js";
import {FutureInfinityDate} from "../future-infinity-date.js";
import {PastInfinityDate} from "../past-infinity-date.js";
import {InvalidBounds} from "../date-range-errors.js";
import {Inclusivity} from "../inclusivity.js";

describe('DateRange unit tests', () => {
  describe('constructor', () => {
    it('Throws an error when a range is created for (+infinity, -infinity)', () => {
      expect(() => new DateRange(
        new FutureInfinityDate(),
        new PastInfinityDate()
      )).toThrow(InvalidBounds)
    })

    it('Creates a range for (+infinity, +infinity)', () => {
      expect(() => new DateRange(
        new FutureInfinityDate(),
        new FutureInfinityDate()
      )).not.toThrow()
    })

    it('Creates a range for (-infinity, -infinity)', () => {
      expect(() => new DateRange(
        new PastInfinityDate(),
        new PastInfinityDate()
      )).not.toThrow()
    })

    it('Creates a range for (-infinity, +infinity)', () => {
      expect(() => new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )).not.toThrow()
    })

    it('Throws an error when a range is created for (today, yesterday)', () => {
      expect(() =>
        new DateRange(WiseDate.today(), WiseDate.yesterday(), Inclusivity.EXCLUSIVE)
      ).toThrow(InvalidBounds)
    })

    it('Throws an error when a range is created for (today, today)', () => {
      expect(() =>
        new DateRange(WiseDate.today(), WiseDate.today(), Inclusivity.EXCLUSIVE)
      ).toThrow(InvalidBounds)
    })

    it('Throws an error when a range is created for (today, tomorrow)', () => {
      expect(() =>
        new DateRange(WiseDate.today(), WiseDate.tomorrow(), Inclusivity.EXCLUSIVE)
      ).toThrow(InvalidBounds)
    })

    it('Throws an error when a range is created for [today, yesterday)', () => {
      expect(() =>
        new DateRange(
          WiseDate.today(),
          WiseDate.yesterday(),
          Inclusivity.INCLUSIVE,
          Inclusivity.EXCLUSIVE
        )
      ).toThrow(InvalidBounds)
    })

    it('Throws an error when a range is created for [today, yesterday]', () => {
      expect(() =>
        new DateRange(
          WiseDate.today(),
          WiseDate.yesterday(),
          Inclusivity.INCLUSIVE,
          Inclusivity.INCLUSIVE
        )
      ).toThrow(InvalidBounds)
    })

    it('Creates a range of 1 day [today, today]', () => {
      expect(() =>
        new DateRange(
          WiseDate.today(),
          WiseDate.today()
        )
      ).not.toThrow()
    })

    it('Creates a range of 1 day [today, tomorrow)', () => {
      let dateRange = new DateRange(
        WiseDate.today(),
        WiseDate.tomorrow(),
        Inclusivity.INCLUSIVE,
        Inclusivity.EXCLUSIVE
      )

      expect(dateRange.startDate.isSame(WiseDate.today())).toBe(true)
      expect(dateRange.endDate.isSame(WiseDate.today())).toBe(true)
    })

    it('Creates a range of 2 days [today, tomorrow]', () => {
      const dateRange = new DateRange(
        WiseDate.today(),
        WiseDate.tomorrow()
      )
      expect(dateRange.startDate.isSame(WiseDate.today())).toBe(true)
      expect(dateRange.endDate.isSame(WiseDate.tomorrow())).toBe(true)
    })

    it('Creates a half open range (-infinity, today]', () => {
      expect(() =>
        new DateRange(
          new PastInfinityDate(),
          WiseDate.today()
        )
      ).not.toThrow()
    })

    it('Creates a half open range [today, +infinity)', () => {
      expect(() =>
        new DateRange(
          WiseDate.today(),
          new FutureInfinityDate(),
        )
      ).not.toThrow()
    })

    it('Creates a date range from an inclusivity string', () => {
      expect(() =>
        new DateRange(
          new WiseDate(),
          new WiseDate(),
          '[]'
        )
      ).not.toThrow()

      expect(() =>
        new DateRange(
          new WiseDate(),
          WiseDate.tomorrow(),
          '[)'
        )
      ).not.toThrow()

      expect(() =>
        new DateRange(
          WiseDate.yesterday(),
          WiseDate.tomorrow(),
          '()'
        )
      ).not.toThrow()

      expect(() =>
        new DateRange(
          WiseDate.yesterday(),
          new WiseDate(),
          '(]'
        )
      ).not.toThrow()
    })
  })

  describe('years', () => {
    it('returns 0 years for [today,today]', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      expect(range.years).toBe(0)
    })

    it('returns 1 year for [today,today + 1 year]', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today().add(1, 'year')
      )
      expect(range.years).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        WiseDate.today(),
        new FutureInfinityDate()
      )
      expect(range.years).toBe(Infinity)
    })
  })

  describe('months', () => {
    it('returns 0 months for [today,today]', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      expect(range.months).toBe(0)
    })

    it('returns 1 months for [1st of january, 1st of february]', () => {
      const range = new DateRange(
        new WiseDate('2024-01-01'),
        new WiseDate('2024-02-01')
      )
      expect(range.months).toBe(1)
    })

    it('returns 0 months for [1st of january, 31st of january]', () => {
      const range = new DateRange(
        new WiseDate('2024-01-01'),
        new WiseDate('2024-01-31')
      )
      expect(range.months).toBe(0)
    })

    it('returns 0 months for (1st of january, 31st of january]', () => {
      const range = new DateRange(
        new WiseDate('2024-01-01'),
        new WiseDate('2024-01-31'),
        '(]'
      )
      expect(range.months).toBe(0)
    })

    it('returns 0 months for [1st of january, 31st of january)', () => {
      const range = new DateRange(
        new WiseDate('2024-01-01'),
        new WiseDate('2024-01-31'),
        '[)'
      )
      expect(range.months).toBe(0)
    })

    it('returns 1 month for [today,today + 1 month]', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today().add(1, 'month')
      )
      expect(range.months).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        WiseDate.today(),
        new FutureInfinityDate()
      )
      expect(range.months).toBe(Infinity)
    })
  })

  describe('quarters', () => {
    it('returns 0 quarters for [today,today]', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      expect(range.quarters).toBe(0)
    })

    it('returns 1 quarter for [today,today + 3 months]', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today().add(3, 'months')
      )
      expect(range.quarters).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        WiseDate.today(),
        new FutureInfinityDate()
      )
      expect(range.quarters).toBe(Infinity)
    })
  })

  describe('weeks', () => {
    it('returns 0 weeks for [today,today]', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      expect(range.weeks).toBe(0)
    })

    it('returns 1 week for [today,today + 1 week]', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today().add(1, 'week')
      )
      expect(range.weeks).toBe(1)
    })

    it('returns 0 weeks for [today,today + 6 days]', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today().add(6, 'days')
      )
      expect(range.weeks).toBe(0)
    })

    it('returns 0 weeks for [today,today + 6 days)', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today().add(6, 'days')
      )
      expect(range.weeks).toBe(0)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        WiseDate.today(),
        new FutureInfinityDate()
      )
      expect(range.weeks).toBe(Infinity)
    })
  })

  describe('days', () => {
    it('returns 0 days for (today,today)', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      expect(range.days).toBe(0)
    })

    it('returns 0 days for [today,today]', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      expect(range.days).toBe(0)
    })

    it('returns 1 day for [today, tomorrow]', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.tomorrow()
      )
      expect(range.days).toBe(1)
    })

    it('returns 1 day for [today, tomorrow)', () => {
      const range = new DateRange(
        WiseDate.today(),
        WiseDate.tomorrow()
      )
      expect(range.days).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        WiseDate.today(),
        new FutureInfinityDate()
      )
      expect(range.days).toBe(Infinity)
    })
  })


  describe('contains', () => {
    it('an infinite range contains everything (-infinity, +infinity)', () => {
      const range = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )
      expect(range.contains(new PastInfinityDate())).toBe(true)
      expect(range.contains(new WiseDate())).toBe(true)
      expect(range.contains(new FutureInfinityDate())).toBe(true)
    })

    it('[today, today] contains today', () => {
      const range = new DateRange(
        new WiseDate(),
        new WiseDate()
      )
      expect(range.contains(new WiseDate())).toBe(true)
    })

    it('[today, today] does not contain dates after today', () => {
      const range = new DateRange(
        new WiseDate(),
        new WiseDate()
      )
      expect(range.contains(WiseDate.tomorrow())).toBe(false)
      expect(range.contains(new FutureInfinityDate())).toBe(false)
    })

    it('[today, today] does not contain dates before today', () => {
      const range = new DateRange(
        new WiseDate(),
        new WiseDate()
      )
      expect(range.contains(WiseDate.yesterday())).toBe(false)
      expect(range.contains(new PastInfinityDate())).toBe(false)
    })

    it('(today, tomorrow] does not contain today', () => {
      const range = new DateRange(
        new WiseDate(),
        WiseDate.tomorrow(),
        '(]'
      )
      expect(range.contains(new WiseDate())).toBe(false)
    })

    it('(today, tomorrow] contains tomorrow', () => {
      const range = new DateRange(
        new WiseDate(),
        WiseDate.tomorrow(),
        '(]'
      )
      expect(range.contains(WiseDate.tomorrow())).toBe(true)
    })

    it('[today, tomorrow) contains today', () => {
      const range = new DateRange(
        new WiseDate(),
        WiseDate.tomorrow(),
        '[)'
      )
      expect(range.contains(new WiseDate())).toBe(true)
    })

    it('[today, tomorrow) does not contain tomorrow', () => {
      const range = new DateRange(
        new WiseDate(),
        WiseDate.tomorrow(),
        '[)'
      )
      expect(range.contains(WiseDate.tomorrow())).toBe(false)
    })
  })

  describe('overlaps', () => {
    it('two infinite ranges overlap', () => {
      const first = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )
      const second = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )

      expect(first.overlaps(second)).toBe(true)
      expect(second.overlaps(first)).toBe(true)
    })

    it('a date range overlaps with an infinite range', () => {
      const first = new DateRange(
        WiseDate.yesterday(),
        WiseDate.tomorrow()
      )
      const second = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )

      expect(first.overlaps(second)).toBe(true)
      expect(second.overlaps(first)).toBe(true)
    })
  })

  describe('overlap', () => {
    it('overlap between (-infinity, +infinity) and (-infinity, +infinity) is (-infinity, +infinity)', () => {
      const first = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )
      const second = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )
      const overlap = first.overlap(second)
      expect(overlap.startDate.isPastInfinity()).toBe(true)
      expect(overlap.endDate.isFutureInfinity()).toBe(true)
    })

    it('overlap between (-infinity, today] and (-infinity, +infinity) is (-infinity, today]', () => {
      const first = new DateRange(
        new PastInfinityDate(),
        WiseDate.today()
      )
      const second = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )

      const overlap = first.overlap(second)
      expect(overlap.startDate.isPastInfinity()).toBe(true)
      expect(overlap.endDate.isSame(WiseDate.today())).toBe(true)
    })

    it('overlap between [today, +infinity) and (-infinity, +infinity) is [today, +infinity)', () => {
      const first = new DateRange(
        WiseDate.today(),
        new FutureInfinityDate()
      )
      const second = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )
      const overlap = first.overlap(second)
      expect(overlap.startDate.isSame(WiseDate.today())).toBe(true)
      expect(overlap.endDate.isFutureInfinity()).toBe(true)
    })

    it('overlap between [today, today] and [today, today] is [today, today]', () => {
      const first = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      const second = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      const overlap = first.overlap(second)
      expect(overlap.startDate.isSame(WiseDate.today())).toBe(true)
      expect(overlap.endDate.isSame(WiseDate.today())).toBe(true)
    })

    it('overlap between [today, today] and [yesterday, tomorrow] is [today,today]', () => {
      const first = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      const second = new DateRange(
        WiseDate.yesterday(),
        WiseDate.tomorrow()
      )
      const overlap = first.overlap(second)
      expect(overlap.startDate.isSame(WiseDate.today())).toBe(true)
      expect(overlap.endDate.isSame(WiseDate.today())).toBe(true)
    })

    it('overlap between [today, today] and (yesterday, tomorrow) is [today,today]', () => {
      const first = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      const second = new DateRange(
        WiseDate.yesterday(),
        WiseDate.tomorrow(),
        '()'
      )
      const overlap = first.overlap(second)
      expect(overlap.startDate.isSame(WiseDate.today())).toBe(true)
      expect(overlap.endDate.isSame(WiseDate.today())).toBe(true)
    })

    it('overlap between [today, today] and [yesterday, tomorrow) is [today,today]', () => {
      const first = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      const second = new DateRange(
        WiseDate.yesterday(),
        WiseDate.tomorrow(),
        '[)'
      )
      const overlap = first.overlap(second)
      expect(overlap.startDate.isSame(WiseDate.today())).toBe(true)
      expect(overlap.endDate.isSame(WiseDate.today())).toBe(true)
    })

    it('overlap between [today, today] and (yesterday, tomorrow] is [today,today]', () => {
      const first = new DateRange(
        WiseDate.today(),
        WiseDate.today()
      )
      const second = new DateRange(
        WiseDate.yesterday(),
        WiseDate.tomorrow(),
        '(]'
      )
      const overlap = first.overlap(second)
      expect(overlap.startDate.isSame(WiseDate.today())).toBe(true)
      expect(overlap.endDate.isSame(WiseDate.today())).toBe(true)
    })

    it('overlap between [today, tomorrow] and [yesterday, tomorrow] is [today,tomorrow]', () => {
      const first = new DateRange(
        WiseDate.today(),
        WiseDate.tomorrow()
      )
      const second = new DateRange(
        WiseDate.yesterday(),
        WiseDate.tomorrow()
      )
      const overlap = first.overlap(second)
      expect(overlap.startDate.isSame(WiseDate.today())).toBe(true)
      expect(overlap.endDate.isSame(WiseDate.tomorrow())).toBe(true)
    })

    it('overlap between [yesterday, tomorrow) and [yesterday, tomorrow] is [yesterday, today]', () => {
      const first = new DateRange(
        WiseDate.yesterday(),
        WiseDate.tomorrow(),
        '[)'
      )

      const second = new DateRange(
        WiseDate.yesterday(),
        WiseDate.tomorrow()
      )
      const overlap = first.overlap(second)
      expect(overlap.startDate.isSame(WiseDate.yesterday())).toBe(true)
      expect(overlap.endDate.isSame(WiseDate.today())).toBe(true)
    })

    it('overlap between (yesterday, tomorrow) and [yesterday, tomorrow] is [today, today]', () => {
      const first = new DateRange(
        WiseDate.yesterday(),
        WiseDate.tomorrow(),
        '()'
      )
      const second = new DateRange(
        WiseDate.yesterday(),
        WiseDate.tomorrow()
      )
      const overlap = first.overlap(second)
      expect(overlap.startDate.isSame(WiseDate.today())).toBe(true)
      expect(overlap.endDate.isSame(WiseDate.today())).toBe(true)
    })
  })

  describe("diff", () => {
    it('diff between (-infinity, +infinity) and (-infinity, +infinity) is none', () => {
      const first = new DateRange(new PastInfinityDate(), new FutureInfinityDate())
      const second = new DateRange(new PastInfinityDate(), new FutureInfinityDate())
      expect(first.diff(second)).toHaveLength(0)
    })

    it('diff between (-infinity, today] and (-infinity, +infinity) is none', () => {
      const first = new DateRange(new PastInfinityDate(), WiseDate.today())
      const second = new DateRange(new PastInfinityDate(), new FutureInfinityDate())
      expect(first.diff(second)).toHaveLength(0)
    })

    it('diff between [today, today] and (-infinity, +infinity) is none', () => {
      const first = new DateRange(WiseDate.today(), WiseDate.today())
      const second = new DateRange(new PastInfinityDate(), new FutureInfinityDate())
      expect(first.diff(second)).toHaveLength(0)
    })

    it('diff between (-infinity, +infinity) and (-infinity, today] is [tomorrow, +infinity)', () => {
      const first = new DateRange(new PastInfinityDate(), new FutureInfinityDate())
      const second = new DateRange(new PastInfinityDate(), WiseDate.today())

      const expectedRange = new DateRange(WiseDate.tomorrow(), new FutureInfinityDate())
      let diff = first.diff(second)

      expect(diff).toHaveLength(1)
      expect(diff[0].isSame(expectedRange)).toBe(true)
    })

    it('diff between (-infinity, +infinity) and [today, +infinity) is (-infinity, yesterday]', () => {
      const first = new DateRange(new PastInfinityDate(), new FutureInfinityDate())
      const second = new DateRange(WiseDate.today(), new FutureInfinityDate())

      const expectedRange = new DateRange(new PastInfinityDate(), WiseDate.yesterday())
      let diff = first.diff(second)

      expect(diff).toHaveLength(1)
      expect(diff[0].isSame(expectedRange)).toBe(true)
    })

    it('diff between (-infinity, +infinity) and [today, today] is (-infinity, yesterday] and [tomorrow, +infinity)', () => {
      const first = new DateRange(new PastInfinityDate(), new FutureInfinityDate())
      const second = new DateRange(WiseDate.today(), WiseDate.today())

      const diff = first.diff(second)

      expect(diff).toHaveLength(2)
      expect(diff[0].isSame(new DateRange(new PastInfinityDate(), WiseDate.yesterday()))).toBe(true)
      expect(diff[1].isSame(new DateRange(WiseDate.tomorrow(), new FutureInfinityDate()))).toBe(true)
    })

    it('diff between [yesterday, tomorrow] and [today, today] is [yesterday, yesterday] and [tomorrow, tomorrow]', () => {
      const first = new DateRange(WiseDate.yesterday(), WiseDate.tomorrow())
      const second = new DateRange(WiseDate.today(), WiseDate.today())

      const diff = first.diff(second)

      expect(diff).toHaveLength(2)
      expect(diff[0].isSame(new DateRange(WiseDate.yesterday(), WiseDate.yesterday()))).toBe(true)
      expect(diff[1].isSame(new DateRange(WiseDate.tomorrow(), WiseDate.tomorrow()))).toBe(true)
    })

    it('diff between [yesterday, today] and [tomorrow, +infinity) is [yesterday, today]', () => {
      const first = new DateRange(WiseDate.yesterday(), WiseDate.today())
      const second = new DateRange(WiseDate.tomorrow(), new FutureInfinityDate())

      const diff = first.diff(second)

      expect(diff).toHaveLength(1)
      expect(diff[0].isSame(first)).toBe(true)
    })
  })
})
