import {describe, it} from "node:test";
import {expect} from "expect";
import {WiseDate} from "../wise-date.js";
import {FutureInfinityDate} from "../future-infinity-date.js";
import {PastInfinityDate} from "../past-infinity-date.js";
import dayjs from "dayjs";

describe('WiseDate', () => {
  describe('relative order of dates', () => {
    describe('today relative to others', () => {
      it('respects ordering of today relative to tomorrow', () => {
        expect(WiseDate.today().isBefore(WiseDate.tomorrow())).toBe(true)
        expect(WiseDate.today().isAfter(WiseDate.tomorrow())).toBe(false)
        expect(WiseDate.today().isSame(WiseDate.tomorrow())).toBe(false)
      })

      it('respects ordering of today relative to today', () => {
        expect(WiseDate.today().isBefore(WiseDate.today())).toBe(false)
        expect(WiseDate.today().isAfter(WiseDate.today())).toBe(false)
        expect(WiseDate.today().isSame(WiseDate.today())).toBe(true)
      })

      it('respects ordering of today relative to yesterday', () => {
        expect(WiseDate.today().isBefore(WiseDate.yesterday())).toBe(false)
        expect(WiseDate.today().isAfter(WiseDate.yesterday())).toBe(true)
        expect(WiseDate.today().isSame(WiseDate.yesterday())).toBe(false)
      })

      it('respects ordering of today relative to future infinity', () => {
        expect(WiseDate.today().isBefore(new FutureInfinityDate())).toBe(true)
        expect(WiseDate.today().isAfter(new FutureInfinityDate())).toBe(false)
        expect(WiseDate.today().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of today relative to past infinity', () => {
        expect(WiseDate.today().isBefore(new PastInfinityDate())).toBe(false)
        expect(WiseDate.today().isAfter(new PastInfinityDate())).toBe(true)
        expect(WiseDate.today().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('yesterday relative to others', () => {
      it('respects ordering of yesterday relative to tomorrow', () => {
        expect(WiseDate.yesterday().isBefore(WiseDate.tomorrow())).toBe(true)
        expect(WiseDate.yesterday().isAfter(WiseDate.tomorrow())).toBe(false)
        expect(WiseDate.yesterday().isSame(WiseDate.tomorrow())).toBe(false)
      })

      it('respects ordering of yesterday relative to today', () => {
        expect(WiseDate.yesterday().isBefore(WiseDate.today())).toBe(true)
        expect(WiseDate.yesterday().isAfter(WiseDate.today())).toBe(false)
        expect(WiseDate.yesterday().isSame(WiseDate.today())).toBe(false)
      })

      it('respects ordering of yesterday relative to yesterday', () => {
        expect(WiseDate.yesterday().isBefore(WiseDate.yesterday())).toBe(false)
        expect(WiseDate.yesterday().isAfter(WiseDate.yesterday())).toBe(false)
        expect(WiseDate.yesterday().isSame(WiseDate.yesterday())).toBe(true)
      })

      it('respects ordering of yesterday relative to future infinity', () => {
        expect(WiseDate.yesterday().isBefore(new FutureInfinityDate())).toBe(true)
        expect(WiseDate.yesterday().isAfter(new FutureInfinityDate())).toBe(false)
        expect(WiseDate.yesterday().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of yesterday relative to past infinity', () => {
        expect(WiseDate.yesterday().isBefore(new PastInfinityDate())).toBe(false)
        expect(WiseDate.yesterday().isAfter(new PastInfinityDate())).toBe(true)
        expect(WiseDate.yesterday().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('tomorrow relative to others', () => {
      it('respects ordering of tomorrow relative to tomorrow', () => {
        expect(WiseDate.tomorrow().isBefore(WiseDate.tomorrow())).toBe(false)
        expect(WiseDate.tomorrow().isAfter(WiseDate.tomorrow())).toBe(false)
        expect(WiseDate.tomorrow().isSame(WiseDate.tomorrow())).toBe(true)
      })

      it('respects ordering of tomorrow relative to today', () => {
        expect(WiseDate.tomorrow().isBefore(WiseDate.today())).toBe(false)
        expect(WiseDate.tomorrow().isAfter(WiseDate.today())).toBe(true)
        expect(WiseDate.tomorrow().isSame(WiseDate.today())).toBe(false)
      })

      it('respects ordering of tomorrow relative to yesterday', () => {
        expect(WiseDate.tomorrow().isBefore(WiseDate.yesterday())).toBe(false)
        expect(WiseDate.tomorrow().isAfter(WiseDate.yesterday())).toBe(true)
        expect(WiseDate.tomorrow().isSame(WiseDate.yesterday())).toBe(false)
      })

      it('respects ordering of tomorrow relative to future infinity', () => {
        expect(WiseDate.tomorrow().isBefore(new FutureInfinityDate())).toBe(true)
        expect(WiseDate.tomorrow().isAfter(new FutureInfinityDate())).toBe(false)
        expect(WiseDate.tomorrow().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of tomorrow relative to past infinity', () => {
        expect(WiseDate.tomorrow().isBefore(new PastInfinityDate())).toBe(false)
        expect(WiseDate.tomorrow().isAfter(new PastInfinityDate())).toBe(true)
        expect(WiseDate.tomorrow().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('tomorrow relative to others', () => {
      it('respects ordering of tomorrow relative to tomorrow', () => {
        expect(WiseDate.tomorrow().isBefore(WiseDate.tomorrow())).toBe(false)
        expect(WiseDate.tomorrow().isAfter(WiseDate.tomorrow())).toBe(false)
        expect(WiseDate.tomorrow().isSame(WiseDate.tomorrow())).toBe(true)
      })

      it('respects ordering of tomorrow relative to today', () => {
        expect(WiseDate.tomorrow().isBefore(WiseDate.today())).toBe(false)
        expect(WiseDate.tomorrow().isAfter(WiseDate.today())).toBe(true)
        expect(WiseDate.tomorrow().isSame(WiseDate.today())).toBe(false)
      })

      it('respects ordering of tomorrow relative to yesterday', () => {
        expect(WiseDate.tomorrow().isBefore(WiseDate.yesterday())).toBe(false)
        expect(WiseDate.tomorrow().isAfter(WiseDate.yesterday())).toBe(true)
        expect(WiseDate.tomorrow().isSame(WiseDate.yesterday())).toBe(false)
      })

      it('respects ordering of tomorrow relative to future infinity', () => {
        expect(WiseDate.tomorrow().isBefore(new FutureInfinityDate())).toBe(true)
        expect(WiseDate.tomorrow().isAfter(new FutureInfinityDate())).toBe(false)
        expect(WiseDate.tomorrow().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of tomorrow relative to past infinity', () => {
        expect(WiseDate.tomorrow().isBefore(new PastInfinityDate())).toBe(false)
        expect(WiseDate.tomorrow().isAfter(new PastInfinityDate())).toBe(true)
        expect(WiseDate.tomorrow().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('future infinity relative to others', () => {
      it('respects ordering of future infinity relative to tomorrow', () => {
        expect(new FutureInfinityDate().isBefore(WiseDate.tomorrow())).toBe(false)
        expect(new FutureInfinityDate().isAfter(WiseDate.tomorrow())).toBe(true)
        expect(new FutureInfinityDate().isSame(WiseDate.tomorrow())).toBe(false)
      })

      it('respects ordering of future infinity relative to today', () => {
        expect(new FutureInfinityDate().isBefore(WiseDate.today())).toBe(false)
        expect(new FutureInfinityDate().isAfter(WiseDate.today())).toBe(true)
        expect(new FutureInfinityDate().isSame(WiseDate.today())).toBe(false)
      })

      it('respects ordering of future infinity relative to yesterday', () => {
        expect(new FutureInfinityDate().isBefore(WiseDate.yesterday())).toBe(false)
        expect(new FutureInfinityDate().isAfter(WiseDate.yesterday())).toBe(true)
        expect(new FutureInfinityDate().isSame(WiseDate.yesterday())).toBe(false)
      })

      it('respects ordering of future infinity relative to future infinity', () => {
        expect(new FutureInfinityDate().isBefore(new FutureInfinityDate())).toBe(false)
        expect(new FutureInfinityDate().isAfter(new FutureInfinityDate())).toBe(true)
        expect(new FutureInfinityDate().isSame(new FutureInfinityDate())).toBe(true)
      })

      it('respects ordering of future infinity relative to past infinity', () => {
        expect(new FutureInfinityDate().isBefore(new PastInfinityDate())).toBe(false)
        expect(new FutureInfinityDate().isAfter(new PastInfinityDate())).toBe(true)
        expect(new FutureInfinityDate().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('past infinity relative to others', () => {
      it('respects ordering of past infinity relative to tomorrow', () => {
        expect(new PastInfinityDate().isBefore(WiseDate.tomorrow())).toBe(true)
        expect(new PastInfinityDate().isAfter(WiseDate.tomorrow())).toBe(false)
        expect(new PastInfinityDate().isSame(WiseDate.tomorrow())).toBe(false)
      })

      it('respects ordering of past infinity relative to today', () => {
        expect(new PastInfinityDate().isBefore(WiseDate.today())).toBe(true)
        expect(new PastInfinityDate().isAfter(WiseDate.today())).toBe(false)
        expect(new PastInfinityDate().isSame(WiseDate.today())).toBe(false)
      })

      it('respects ordering of past infinity relative to yesterday', () => {
        expect(new PastInfinityDate().isBefore(WiseDate.yesterday())).toBe(true)
        expect(new PastInfinityDate().isAfter(WiseDate.yesterday())).toBe(false)
        expect(new PastInfinityDate().isSame(WiseDate.yesterday())).toBe(false)
      })

      it('respects ordering of past infinity relative to future infinity', () => {
        expect(new PastInfinityDate().isBefore(new FutureInfinityDate())).toBe(true)
        expect(new PastInfinityDate().isAfter(new FutureInfinityDate())).toBe(false)
        expect(new PastInfinityDate().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of past infinity relative to past infinity', () => {
        expect(new PastInfinityDate().isBefore(new PastInfinityDate())).toBe(true)
        expect(new PastInfinityDate().isAfter(new PastInfinityDate())).toBe(false)
        expect(new PastInfinityDate().isSame(new PastInfinityDate())).toBe(true)
      })
    })
  })
})
