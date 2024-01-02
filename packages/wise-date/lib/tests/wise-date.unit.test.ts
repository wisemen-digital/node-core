import {describe, it} from "node:test";
import {expect} from "expect";
import {Time} from "@appwise/time";
import {WiseDate} from "../wise-date.js";
import {FutureInfinityDate} from "../future-infinity-date.js";
import {PastInfinityDate} from "../past-infinity-date.js";
import dayjs from "dayjs";

describe('WiseDate', () => {
  describe('constructor', () => {
    it('defaults to today', () => {
      expect(new WiseDate().isSame(WiseDate.today())).toBe(true)
    });

    it('constructs a date from dayjs', () => {
      expect(() => new WiseDate(dayjs())).not.toThrow()
    });

    it('constructs a date from Date', () => {
      expect(() => new WiseDate(new Date())).not.toThrow()
    });

    it('constructs a date from a string', () => {
      expect(() => new WiseDate('2022-01-01','YYYY-MM-DD')).not.toThrow()
      expect(() => new WiseDate('2022-01-01')).not.toThrow()

      expect(() => new WiseDate('not a date string','YYYY-MM-DD')).toThrow()
      expect(() => new WiseDate('not a date string')).toThrow()
    });

    it('constructs a date from a plain time object', () => {
      expect(dayjs('2022-02-31', 'YYYY-MM-DD', true).isValid()).toBe(false)
      expect(() => new WiseDate({year: 2022, month: 1, day: 1})).not.toThrow()
      expect(() => new WiseDate({year: 2022, month: 2, day: 30})).toThrow()
    });
  })

  describe('today', () => {
    it('respects ordering of dates', () => {
      expect(WiseDate.today().isBefore(WiseDate.tomorrow())).toBe(true)
      expect(WiseDate.today().isAfter(WiseDate.tomorrow())).toBe(false)
      expect(WiseDate.today().isSame(WiseDate.tomorrow())).toBe(false)

      expect(WiseDate.today().isBefore(WiseDate.yesterday())).toBe(false)
      expect(WiseDate.today().isAfter(WiseDate.yesterday())).toBe(true)
      expect(WiseDate.today().isSame(WiseDate.yesterday())).toBe(false)

      expect(WiseDate.today().isBefore(WiseDate.today())).toBe(false)
      expect(WiseDate.today().isAfter(WiseDate.today())).toBe(false)
      expect(WiseDate.today().isSame(WiseDate.today())).toBe(true)

      expect(WiseDate.today().isBefore(new FutureInfinityDate())).toBe(true)
      expect(WiseDate.today().isAfter(new FutureInfinityDate())).toBe(false)
      expect(WiseDate.today().isSame(new FutureInfinityDate())).toBe(false)

      expect(WiseDate.today().isBefore(new PastInfinityDate())).toBe(false)
      expect(WiseDate.today().isAfter(new PastInfinityDate())).toBe(true)
      expect(WiseDate.today().isSame(new PastInfinityDate())).toBe(false)
    })
  })
})
