import {describe, it} from "node:test";
import {expect} from "expect";
import {WiseDate} from "../index.js";
import {FutureInfinityDate} from "../index.js";
import {PastInfinityDate} from "../index.js";
import dayjs from "dayjs";
import {Month} from "../month.js";

describe('WiseDate manipulation of date value', () => {
  describe('Future infinity', () => {
    it('Future infinity remains infinity when increasing the date', () => {
      expect(new FutureInfinityDate().add(1,'day').isSame(new FutureInfinityDate())).toBe(true)
      expect(new FutureInfinityDate().add(1,'week').isSame(new FutureInfinityDate())).toBe(true)
      expect(new FutureInfinityDate().add(1,'month').isSame(new FutureInfinityDate())).toBe(true)
      expect(new FutureInfinityDate().add(1,'year').isSame(new FutureInfinityDate())).toBe(true)
    });

    it('Future infinity remains infinity when decreasing the date', () => {
      expect(new FutureInfinityDate().subtract(1,'day').isSame(new FutureInfinityDate())).toBe(true)
      expect(new FutureInfinityDate().subtract(1,'week').isSame(new FutureInfinityDate())).toBe(true)
      expect(new FutureInfinityDate().subtract(1,'year').isSame(new FutureInfinityDate())).toBe(true)
      expect(new FutureInfinityDate().subtract(1,'month').isSame(new FutureInfinityDate())).toBe(true)
    });
  })

  describe('Past infinity', () => {
    it('Past infinity remains infinity when increasing the date', () => {
      expect(new PastInfinityDate().add(1,'day').isSame(new PastInfinityDate())).toBe(true)
      expect(new PastInfinityDate().add(1,'week').isSame(new PastInfinityDate())).toBe(true)
      expect(new PastInfinityDate().add(1,'month').isSame(new PastInfinityDate())).toBe(true)
      expect(new PastInfinityDate().add(1,'year').isSame(new PastInfinityDate())).toBe(true)
    });

    it('Past infinity remains infinity when decreasing the date', () => {
      expect(new PastInfinityDate().subtract(1,'day').isSame(new PastInfinityDate())).toBe(true)
      expect(new PastInfinityDate().subtract(1,'week').isSame(new PastInfinityDate())).toBe(true)
      expect(new PastInfinityDate().subtract(1,'year').isSame(new PastInfinityDate())).toBe(true)
      expect(new PastInfinityDate().subtract(1,'month').isSame(new PastInfinityDate())).toBe(true)
    });
  })

  describe('Non infinite days', () => {
    it('The day increases by one', () => {
      expect(new WiseDate().add(1,'day').isSame(WiseDate.tomorrow())).toBe(true)
      expect(new WiseDate().add(1,'day').isTomorrow()).toBe(true)
      expect(new WiseDate().add(1,'day').dayOfYear).not.toBe(new WiseDate().dayOfYear)
      expect(new WiseDate('2024-01-01').add(1,'day').isSame(new WiseDate('2024-01-02'))).toBe(true)
      expect(new WiseDate(dayjs().endOf('day')).add(1,'day').isTomorrow()).toBe(true)
    });

    it('Increasing the day by one at the end of a week changes the week of the year', () => {
      const endOfWeek = new WiseDate(dayjs().endOf('week'))
      const startOfNextWeek = endOfWeek.add(1,'day')
      expect(endOfWeek.weekOfYear).not.toBe(startOfNextWeek.weekOfYear)
    });

    it('Increasing the day by one overflows to the next week', () => {
      const endOfWeek = new WiseDate(dayjs().startOf('year').endOf('week'))
      const startOfNextWeek = endOfWeek.add(1,'day')
      expect(startOfNextWeek.weekOfYear).toBe(2)
    });

    it('The week increases by one', () => {
      expect(new WiseDate().add(1,'week').isSame(new WiseDate(dayjs().add(1,'week')))).toBe(true)
      expect(new WiseDate().add(1,'week').isSame(new WiseDate())).toBe(false)
      expect(new WiseDate('2024-01-01').add(1,'week').isSame(new WiseDate('2024-01-08'))).toBe(true)
    });

    it('Increasing the week overflows to the next month', () => {
      const endOfMonth = new WiseDate(dayjs().startOf('year').endOf('month'))
      const nextMonth = endOfMonth.add(1,'week')
      expect(endOfMonth.month).not.toBe(nextMonth.month)
      expect(nextMonth.month).toBe(Month.FEBRUARY)
    });

    it('Increasing the week overflows to the next year', () => {
      const endOfYear = new WiseDate(dayjs().endOf('year'))
      const nextYear = endOfYear.add(1,'week')
      expect(endOfYear.year).not.toBe(nextYear.year)
      expect(nextYear.year).toBe(dayjs().year() + 1)
    });

    it('The month increases by one', () => {
      expect(new WiseDate().add(1,'month').isSame(new WiseDate(dayjs().add(1,'month')))).toBe(true)
      expect(new WiseDate().add(1,'month').month).not.toBe(new WiseDate().month)
      expect(new WiseDate(dayjs().startOf('year')).add(1,'month').month).toBe(Month.FEBRUARY)
    });

    it('Increasing the month overflows to the next year', () => {
      const endOfYear = new WiseDate(dayjs().endOf('year'))
      const nextYear = endOfYear.add(1,'month')
      expect(endOfYear.year).not.toBe(nextYear.year)
      expect(nextYear.year).toBe(dayjs().year() + 1)
    });

    it('The year increases by one', () => {
      expect(new WiseDate().add(1,'year').isSame(new WiseDate(dayjs().add(1,'year')))).toBe(true)
      expect(new WiseDate().add(1,'year').year).not.toBe(new WiseDate().year)
      expect(new WiseDate('2024-01-01').add(1,'year').isSame(new WiseDate('2025-01-01'))).toBe(true)
    });
  })
})
