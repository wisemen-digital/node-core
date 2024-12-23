import {describe, it} from "node:test";
import {expect} from "expect";
import {WiseDate} from "../wise-date.js";
import {DateRange} from "../date-range.js";
import {FutureInfinityDate} from "../future-infinity-date.js";
import {PastInfinityDate} from "../past-infinity-date.js";
import {InvalidBounds} from "../date-range-errors.js";
import {Inclusivity} from "../inclusivity.js";
import {DateRangeBoundary} from "../date-range-boundary.js";

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

    it('Throws an error when a range is created for [today, yesterday)', () => {
      expect(() =>
        new DateRange(
          new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
          new DateRangeBoundary(WiseDate.yesterday(), Inclusivity.EXCLUSIVE),
        )
      ).toThrow(InvalidBounds)
    })

    it('Throws an error when a range is created for [today, yesterday]', () => {
      expect(() =>
        new DateRange(
          new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
          new DateRangeBoundary(WiseDate.yesterday(), Inclusivity.INCLUSIVE),
        )
      ).toThrow(InvalidBounds)
    })

    it('Creates a range of 1 day [today, today]', () => {
      expect(() =>
        new DateRange(
          new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
          new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        )
      ).not.toThrow()
    })

    it('Creates an empty range of 1 day (today, today)', () => {
      expect(() =>
        new DateRange(
          new DateRangeBoundary(WiseDate.today(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(WiseDate.today(), Inclusivity.EXCLUSIVE),
        )
      ).not.toThrow()
    })

    it('Creates a range of 1 day [today, tomorrow)', () => {
      expect(() =>
        new DateRange(
          new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
          new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
        )
      ).not.toThrow()
    })

    it('Creates a range of 2 days [today, tomorrow]', () => {
      expect(() =>
        new DateRange(
          new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
          new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.INCLUSIVE),
        )
      ).not.toThrow()
    })

    it('Creates a half open range (-infinity, today]', () => {
      expect(() =>
        new DateRange(
          new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        )
      ).not.toThrow()
    })

    it('Creates a half open range [today, +infinity)', () => {
      expect(() =>
        new DateRange(
          new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
          new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
        )
      ).not.toThrow()
    })
  })

  describe('years', () => {
    it('returns 0 years for [today,today]', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
      )
      expect(range.years).toBe(0)
    })

    it('returns 1 year for [today,today + 1 year]', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.today().add(1,'year'), Inclusivity.INCLUSIVE),
      )
      expect(range.years).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.years).toBe(Infinity)
    })
  })

  describe('months', () => {
    it('returns 0 months for [today,today]', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
      )
      expect(range.months).toBe(0)
    })

    it('returns 1 months for [1st of january, 1st of february)', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate('2024-01-01'), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new WiseDate('2024-02-01'), Inclusivity.EXCLUSIVE),
      )
      expect(range.months).toBe(1)
    })

    it('returns 1 month for [1st of january, 31st of january]', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate('2024-01-01'), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new WiseDate('2024-01-31'), Inclusivity.INCLUSIVE),
      )
      expect(range.months).toBe(1)
    })

    it('returns 0 months for (1st of january, 31st of january]', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate('2024-01-01'), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new WiseDate('2024-01-31'), Inclusivity.INCLUSIVE),
      )
      expect(range.months).toBe(0)
    })

    it('returns 0 months for [1st of january, 31st of january)', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate('2024-01-01'), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new WiseDate('2024-01-31'), Inclusivity.EXCLUSIVE),
      )
      expect(range.months).toBe(0)
    })

    it('returns 1 month for [today,today + 1 month]', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.today().add(1,'month'), Inclusivity.INCLUSIVE),
      )
      expect(range.months).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.months).toBe(Infinity)
    })
  })

  describe('quarters', () => {
    it('returns 0 quarters for [today,today]', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
      )
      expect(range.quarters).toBe(0)
    })

    it('returns 1 quarter for [today,today + 3 months]', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.today().add(3, 'months'), Inclusivity.INCLUSIVE),
      )
      expect(range.quarters).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.quarters).toBe(Infinity)
    })
  })

  describe('weeks', () => {
    it('returns 0 weeks for [today,today]', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
      )
      expect(range.weeks).toBe(0)
    })

    it('returns 1 week for [today,today + 1 week]', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.today().add(1, 'week'), Inclusivity.INCLUSIVE),
      )
      expect(range.weeks).toBe(1)
    })

    it('returns 1 week for [today,today + 6 days]', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.today().add(6, 'days'), Inclusivity.INCLUSIVE),
      )
      expect(range.weeks).toBe(1)
    })

    it('returns 0 weeks for [today,today + 6 days)', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.today().add(6, 'days'), Inclusivity.EXCLUSIVE),
      )
      expect(range.weeks).toBe(0)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.weeks).toBe(Infinity)
    })
  })

  describe('days', () => {
    it('returns 0 days for (today,today)', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(WiseDate.today(), Inclusivity.EXCLUSIVE),
      )
      expect(range.days).toBe(0)
    })

    it('returns 1 days for [today,today]', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
      )
      expect(range.days).toBe(1)
    })

    it('returns 2 days for [today, tomorrow]', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.INCLUSIVE),
      )
      expect(range.days).toBe(2)
    })

    it('returns 1 day for [today, tomorrow)', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
      )
      expect(range.days).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.days).toBe(Infinity)
    })
  })

  describe('isEmpty', () =>{
    it('An infinite range is not empty (-infinity, +infinity)', () => {
      const range = new DateRange(
        new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.isEmpty).toBe(false)
    })

    it('An half open range is not empty (-infinity, today]', () => {
      const range = new DateRange(
        new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
      )
      expect(range.isEmpty).toBe(false)
    })

    it('An half open range is not empty [today, +infinity)', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.isEmpty).toBe(false)
    })

    it('A 1 day range is not empty [today, today]', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
      )
      expect(range.isEmpty).toBe(false)
    })

    it('A 1 day range is empty (today, today)', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.isEmpty).toBe(true)
    })

    it('A 1 day range is empty (today, today]', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
      )
      expect(range.isEmpty).toBe(true)
    })

    it('A 1 day range is empty [today, today)', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.isEmpty).toBe(true)
    })

    it('A 2 day range is empty (today, tomorrow)', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
      )
      expect(range.isEmpty).toBe(true)
    })

    it('A future infinity range is not empty (+infinity, +infinity)', () => {
      const range = new DateRange(
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.isEmpty).toBe(false)
    })

    it('A past infinity range is not empty (-infinity, -infinity)', () => {
      const range = new DateRange(
        new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.isEmpty).toBe(false)
    })
  })

  describe('contains', () => {
    it('an infinite range contains everything (-infinity, +infinity)', () => {
      const range = new DateRange(
        new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.contains(new PastInfinityDate())).toBe(true)
      expect(range.contains(new WiseDate())).toBe(true)
      expect(range.contains(new FutureInfinityDate())).toBe(true)
    })

    it('[today, today] contains today', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
      )
      expect(range.contains(new WiseDate())).toBe(true)
    })

    it('[today, today] does not contain dates after today', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.contains(WiseDate.tomorrow())).toBe(false)
      expect(range.contains(new FutureInfinityDate())).toBe(false)
    })

    it('[today, today] does not contain dates before today', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.contains(WiseDate.yesterday())).toBe(false)
      expect(range.contains(new PastInfinityDate())).toBe(false)
    })

    it('[today, today) does not contain today', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.contains(new WiseDate())).toBe(false)
    })


    it('(today, today] does not contain today', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
      )
      expect(range.contains(new WiseDate())).toBe(false)
    })


    it('(today, today) does not contain today', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.contains(new WiseDate())).toBe(false)
    })

    it('(today, today) does not contain days after today', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.contains(WiseDate.tomorrow())).toBe(false)
      expect(range.contains(new FutureInfinityDate())).toBe(false)
    })

    it('(today, today) does not contain days before today', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
      )
      expect(range.contains(WiseDate.yesterday())).toBe(false)
      expect(range.contains(new PastInfinityDate())).toBe(false)
    })

    it('(today, tomorrow] does not contain today', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.INCLUSIVE),
      )
      expect(range.contains(new WiseDate())).toBe(false)
    })

    it('(today, tomorrow] contains tomorrow', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.INCLUSIVE),
      )
      expect(range.contains(WiseDate.tomorrow())).toBe(true)
    })

    it('[today, tomorrow) does contains today', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
      )
      expect(range.contains(new WiseDate())).toBe(true)
    })

    it('[today, tomorrow) does not contain tomorrow', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
      )
      expect(range.contains(WiseDate.tomorrow())).toBe(false)
    })

    it('(today, tomorrow) does not contain tomorrow', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
      )
      expect(range.contains(WiseDate.tomorrow())).toBe(false)
    })

    it('(today, tomorrow) does not contain today', () => {
      const range = new DateRange(
        new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
      )
      expect(range.contains(new WiseDate())).toBe(false)
    })
  })

  describe('overlaps', () => {
    it('two infinite ranges overlap', () => {
      const first = new DateRange(
        new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      const second = new DateRange(
        new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )

      expect(first.overlaps(second)).toBe(true)
      expect(second.overlaps(first)).toBe(true)
    })

    it('a date range overlaps with an infinite range', () => {
      const first = new DateRange(
        new DateRangeBoundary(WiseDate.yesterday(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
      )
      const second = new DateRange(
        new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )

      expect(first.overlaps(second)).toBe(true)
      expect(second.overlaps(first)).toBe(true)
    })

    it('an empty date range overlaps with an infinite range', () => {
      const first = new DateRange(
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
      )
      const second = new DateRange(
        new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )

      expect(first.overlaps(second)).toBe(true)
      expect(second.overlaps(first)).toBe(true)
    })

    it('(today,today) does not overlap with (today,today)', () => {
      const first = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(WiseDate.today(), Inclusivity.EXCLUSIVE),
      )
      const second = new DateRange(
        new DateRangeBoundary(WiseDate.today(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(WiseDate.today(), Inclusivity.EXCLUSIVE),
      )

      expect(first.overlaps(second)).toBe(false)
      expect(second.overlaps(first)).toBe(false)
    })
  })

  describe('overlap', () => {
    it('overlap between (-infinity, +infinity) and (-infinity, +infinity) is (-infinity, +infinity)', () => {
      const first = new DateRange(
        new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      const second = new DateRange(
        new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
        new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
      )
      const overlap = first.overlap(second)
      expect(overlap.startDate.date.isPastInfinity()).toBe(true)
      expect(overlap.startDate.inclusivity).toBe(Inclusivity.EXCLUSIVE)
      expect(overlap.endDate.date.isFutureInfinity()).toBe(true)
      expect(overlap.endDate.inclusivity).toBe(Inclusivity.EXCLUSIVE)
    });
  })
})
