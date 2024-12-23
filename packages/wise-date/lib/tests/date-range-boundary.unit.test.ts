import {describe, it} from "node:test";
import {DateRangeBoundary} from "../date-range-boundary.js";
import {FutureInfinityDate} from "../future-infinity-date.js";
import {Inclusivity} from "../inclusivity.js";
import {expect} from "expect";
import {PastInfinityDate} from "../past-infinity-date.js";
import {WiseDate} from "../wise-date.js";

describe('DateRangeBoundary unit tests', () => {

  describe('constructor', () => {
    it('Overrides the mode to exclusive for infinite dates', () => {
      const futureBoundary = new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.INCLUSIVE)
      expect(futureBoundary.inclusivity).toBe(Inclusivity.EXCLUSIVE)

      const pastBoundary = new DateRangeBoundary(new PastInfinityDate(), Inclusivity.INCLUSIVE)
      expect(pastBoundary.inclusivity).toBe(Inclusivity.EXCLUSIVE)
    })

    it('Creates a new boundary', () => {
      const futureBoundary = new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(futureBoundary.date.isFutureInfinity()).toBe(true)
      expect(futureBoundary.inclusivity).toBe(Inclusivity.EXCLUSIVE)

      const pastBoundary = new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(pastBoundary.date.isPastInfinity()).toBe(true)
      expect(pastBoundary.inclusivity).toBe(Inclusivity.EXCLUSIVE)

      const inclusiveBoundary = new DateRangeBoundary(new WiseDate(),Inclusivity.INCLUSIVE)
      expect(inclusiveBoundary.date.isSame(new WiseDate())).toBe(true)
      expect(inclusiveBoundary.inclusivity).toBe(Inclusivity.INCLUSIVE)

      const exclusiveBoundary = new DateRangeBoundary(new WiseDate(),Inclusivity.EXCLUSIVE)
      expect(exclusiveBoundary.date.isSame(new WiseDate())).toBe(true)
      expect(exclusiveBoundary.inclusivity).toBe(Inclusivity.EXCLUSIVE)
    })
  })

  describe('max', () => {
    it('returns future infinity for two future infinity boundaries', () => {
      expect(
        DateRangeBoundary.max(
          new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE)
        ).date.isFutureInfinity()
      ).toBe(true)
    })

    it('returns past infinity for two past infinity boundaries', () => {
      expect(
        DateRangeBoundary.max(
          new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE)
        ).date.isPastInfinity()
      ).toBe(true)
    })

    it('returns future infinity for future and past infinity boundaries', () => {
      expect(
        DateRangeBoundary.max(
          new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE)
        ).date.isFutureInfinity()
      ).toBe(true)
    })

    it('returns future infinity for future and date boundaries', () => {
      expect(
        DateRangeBoundary.max(
          new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
        ).date.isFutureInfinity()
      ).toBe(true)
    })

    it('returns the latest date boundary', () => {
      expect(
        DateRangeBoundary.max(
          new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
        ).date.isSame(WiseDate.tomorrow())
      ).toBe(true)
    })

    it('returns any boundary for two identical boundaries', () => {
      expect(
        DateRangeBoundary.max(
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
        ).date.isSame(new WiseDate())
      ).toBe(true)
    })

    it('returns a date boundary over a past infinity boundary', () => {
      expect(
        DateRangeBoundary.max(
          new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
        ).date.isSame(new WiseDate())
      ).toBe(true)
    })

    it('returns the inclusive date for two boundaries on the same date', () => {
      expect(
        DateRangeBoundary.max(
          new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
        ).inclusivity
      ).toBe(Inclusivity.INCLUSIVE)
    })
  })

  describe('min', () => {
    it('returns future infinity for two future infinity boundaries', () => {
      expect(
        DateRangeBoundary.min(
          new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE)
        ).date.isFutureInfinity()
      ).toBe(true)
    })

    it('returns past infinity for two past infinity boundaries', () => {
      expect(
        DateRangeBoundary.min(
          new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE)
        ).date.isPastInfinity()
      ).toBe(true)
    })


    it('returns past infinity for future and past infinity boundaries', () => {
      expect(
        DateRangeBoundary.min(
          new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE)
        ).date.isPastInfinity()
      ).toBe(true)
    })

    it('returns date for future and date boundaries', () => {
      expect(
        DateRangeBoundary.min(
          new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
        ).date.isSame(new WiseDate())
      ).toBe(true)
    })

    it('returns the earliest date boundary', () => {
      expect(
        DateRangeBoundary.min(
          new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
        ).date.isSame(new WiseDate())
      ).toBe(true)
    })

    it('returns any boundary for two identical boundaries', () => {
      expect(
        DateRangeBoundary.min(
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
        ).date.isSame(new WiseDate())
      ).toBe(true)
    })

    it('returns past infinity over a date boundary', () => {
      expect(
        DateRangeBoundary.min(
          new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE),
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
        ).date.isSame(new PastInfinityDate())
      ).toBe(true)
    })

    it('returns the exclusive date for two boundaries on the same date', () => {
      expect(
        DateRangeBoundary.min(
          new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE),
          new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
        ).inclusivity
      ).toBe(Inclusivity.EXCLUSIVE)
    })
  })

  describe('isSameOrBefore', () => {
    it('A date is same before future infinity', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const futureInfinity = new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrBefore(futureInfinity)).toBe(true)
    })

    it('A date is same or before a later date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const laterDate = new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrBefore(laterDate)).toBe(true)
    })

    it('A date is same or before the same inclusive date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const laterDate = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrBefore(laterDate)).toBe(true)
    })

    it('A date is not same or before the same but exclusive date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const laterDate = new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrBefore(laterDate)).toBe(false)
    })

    it('A date is before the same but exclusive date which is one day later', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const laterDate = new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrBefore(laterDate)).toBe(true)
    })

    it('A date is not before past infinity', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const pastInfinity = new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrBefore(pastInfinity)).toBe(false)
    })
  })

  describe('isSameOrAfter', () => {
    it('A date is not after future infinity', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const futureInfinity = new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrAfter(futureInfinity)).toBe(false)
    })

    it('A date is not same or after a later date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const laterDate = new DateRangeBoundary(WiseDate.tomorrow(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrAfter(laterDate)).toBe(false)
    })

    it('A date is same or after the same inclusive date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const sameDate = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrAfter(sameDate)).toBe(true)
    })

    it('A date is not same or after the same but exclusive date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const sameDate = new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrAfter(sameDate)).toBe(false)
    })

    it('A date is after the same but exclusive date which is one day earlier', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const earlierDate = new DateRangeBoundary(WiseDate.yesterday(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrAfter(earlierDate)).toBe(true)
    })

    it('A date is always after past infinity', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      const pastInfinity = new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrAfter(pastInfinity)).toBe(true)
    })
  })

  describe('isSameOrBeforeDate', () => {
    it('Future infinity is same as future infinity', () => {
      const date = new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrBeforeDate(new FutureInfinityDate())).toBe(true)
    })

    it('Past infinity is same or before as Past infinity', () => {
      const date = new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrBeforeDate(new PastInfinityDate())).toBe(true)
    })


    it('Past infinity is same or before as Future infinity', () => {
      const date = new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrBeforeDate(new FutureInfinityDate())).toBe(true)
    })

    it('A date is same before future infinity', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrBeforeDate(new FutureInfinityDate())).toBe(true)
    })

    it('An inclusive date is same or before a later date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrBeforeDate(WiseDate.tomorrow())).toBe(true)
    })

    it('An exclusive date is same or before a later date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrBeforeDate(WiseDate.tomorrow())).toBe(true)
    })

    it('A date is same as a date when it is inclusive', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrBeforeDate(new WiseDate())).toBe(true)
    })

    it('A date is not the same or before as a date when it is exclusive', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrBeforeDate(new WiseDate())).toBe(false)
    })

    it('A date is not before past infinity', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrBeforeDate(new PastInfinityDate())).toBe(false)
    })
  })

  describe('isSameOrAfterDate', () => {
    it('Future infinity is same as future infinity', () => {
      const date = new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrAfterDate(new FutureInfinityDate())).toBe(true)
    })

    it('Past infinity is same or after as Past infinity', () => {
      const date = new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrAfterDate(new PastInfinityDate())).toBe(true)
    })

    it('Past infinity is not same or after as Future infinity', () => {
      const date = new DateRangeBoundary(new PastInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrAfterDate(new FutureInfinityDate())).toBe(false)
    })

    it('Future infinity is same or after past infinity', () => {
      const date = new DateRangeBoundary(new FutureInfinityDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrAfterDate(new PastInfinityDate())).toBe(true)
    })


    it('A date is not same or after future infinity', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrAfterDate(new FutureInfinityDate())).toBe(false)
    })

    it('An inclusive date is not same or after a later date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrAfterDate(WiseDate.tomorrow())).toBe(false)
    })

    it('An exclusive date is not same or after a later date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrAfterDate(WiseDate.tomorrow())).toBe(false)
    })

    it('An inclusive date is same or after an earlier date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrAfterDate(WiseDate.yesterday())).toBe(true)
    })

    it('An exclusive date is same or after an earlier date', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrAfterDate(WiseDate.yesterday())).toBe(true)
    })

    it('A date is same as a date when it is inclusive', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrAfterDate(new WiseDate())).toBe(true)
    })

    it('A date is not the same or after as a date when it is exclusive', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.EXCLUSIVE)
      expect(date.isSameOrAfterDate(new WiseDate())).toBe(false)
    })

    it('A date is after past infinity', () => {
      const date = new DateRangeBoundary(new WiseDate(), Inclusivity.INCLUSIVE)
      expect(date.isSameOrAfterDate(new PastInfinityDate())).toBe(true)
    })
  })

})
