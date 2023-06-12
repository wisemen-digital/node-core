import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Time } from '../time.js'
import {
  InvalidHours,
  InvalidMinutes,
  InvalidSeconds,
  InvalidTimeString
} from '../time-error.js'

describe('Time class', () => {
  describe('isValidTimeString', () => {
    it('When sending null, it should return false', () => {
      expect(Time.isValidTimeString(null)).toBe(false)
    })

    it('When sending undefined, it should return false', () => {
      expect(Time.isValidTimeString(undefined)).toBe(false)
    })

    it('When sending an empty string, it should return false', () => {
      expect(Time.isValidTimeString('')).toBe(false)
    })

    it('When sending an invalid time string, it should return false', () => {
      expect(Time.isValidTimeString('24:00:00')).toBe(false)
      expect(Time.isValidTimeString('00:60:00')).toBe(false)
      expect(Time.isValidTimeString('00:00:60')).toBe(false)
      expect(Time.isValidTimeString('0:0:0')).toBe(false)
      expect(Time.isValidTimeString('1:1:1')).toBe(false)
    })

    it('When sending a valid time string, it should return true', () => {
      expect(Time.isValidTimeString('23:59:59')).toBe(true)
      expect(Time.isValidTimeString('00:00:00')).toBe(true)
      expect(Time.isValidTimeString('10:10:10')).toBe(true)
    })
  })

  describe('hoursBetween', () => {
    it('When sending times with a difference less than an hour, it should return 0', () => {
      const midnight = Time.fromString('00:00:00')
      const afterMidnight = Time.fromString('00:59:59')

      expect(Time.hoursBetween(midnight, midnight)).toBe(0)
      expect(Time.hoursBetween(midnight, afterMidnight)).toBe(0)
    })

    it('When sending times, the order should not matter', () => {
      const twoAM = Time.fromString('02:00:00')
      const fourAM = Time.fromString('04:00:00')

      expect(Time.hoursBetween(twoAM, fourAM)).toBe(2)
      expect(Time.hoursBetween(fourAM, twoAM)).toBe(2)
    })

    it('When sending times a with a difference more than an hour, it returns the right amount of hours', () => {
      let time1 = Time.fromString('02:59:59')
      let time2 = Time.fromString('04:00:00')

      expect(Time.hoursBetween(time1, time2)).toBe(1)

      time1 = Time.fromString('02:30:00')
      time2 = Time.fromString('05:29:59')
      expect(Time.hoursBetween(time1, time2)).toBe(2)
    })
  })

  describe('minutesBetween', () => {
    it('When sending times with a difference less than a minute, it should return 0', () => {
      const midnight = Time.fromString('00:00:59')
      const afterMidnight = Time.fromString('00:00:00')

      expect(Time.minutesBetween(midnight, midnight)).toBe(0)
      expect(Time.minutesBetween(midnight, afterMidnight)).toBe(0)
    })

    it('When sending times, the order should not matter', () => {
      const twoAM = Time.fromString('00:34:00')
      const fourAM = Time.fromString('00:40:00')

      expect(Time.minutesBetween(twoAM, fourAM)).toBe(6)
      expect(Time.minutesBetween(fourAM, twoAM)).toBe(6)
    })

    it('When sending times a with a difference more than a minute, it returns the right amount of minutes', () => {
      let time1 = Time.fromString('03:30:59')
      let time2 = Time.fromString('04:00:00')

      expect(Time.minutesBetween(time1, time2)).toBe(29)

      time1 = Time.fromString('02:30:00')
      time2 = Time.fromString('05:29:59')
      expect(Time.minutesBetween(time1, time2)).toBe(179)
    })
  })

  describe('secondsBetween', () => {
    it('When sending times with a difference less than a second, it should return 0', () => {
      const midnight = Time.fromString('00:00:00')
      const afterMidnight = Time.fromString('00:00:59')

      expect(Time.secondsBetween(midnight, midnight)).toBe(0)
      expect(Time.secondsBetween(afterMidnight, afterMidnight)).toBe(0)
    })

    it('When sending times, the order should not matter', () => {
      const twoAM = Time.fromString('00:00:20')
      const fourAM = Time.fromString('00:00:40')

      expect(Time.secondsBetween(twoAM, fourAM)).toBe(20)
      expect(Time.secondsBetween(fourAM, twoAM)).toBe(20)
    })

    it('When sending times a with a difference more than a second, it returns the right amount of secods', () => {
      let time1 = Time.fromString('04:00:59')
      let time2 = Time.fromString('04:00:00')

      expect(Time.secondsBetween(time1, time2)).toBe(59)

      time1 = Time.fromString('04:30:59')
      time2 = Time.fromString('04:00:00')
      expect(Time.secondsBetween(time1, time2)).toBe(30 * 60 + 59)

      time1 = Time.fromString('07:30:59')
      time2 = Time.fromString('04:00:00')
      expect(Time.secondsBetween(time1, time2)).toBe(3 * 60 * 60 + 30 * 60 + 59)
    })
  })

  describe('fromString', () => {
    it('When sending an invalid string, it throws an error', () => {
      expect(() => Time.fromString('')).toThrow(InvalidTimeString)
      expect(() => Time.fromString('not_a_time')).toThrow(InvalidTimeString)
      expect(() => Time.fromString('24:00:00')).toThrow(InvalidTimeString)
      expect(() => Time.fromString('00:60:00')).toThrow(InvalidTimeString)
      expect(() => Time.fromString('00:00:60')).toThrow(InvalidTimeString)
      expect(() => Time.fromString('0:0:0')).toThrow(InvalidTimeString)
    })

    it('When sending a valid string, the constructed Time object contains the right values', () => {
      const time = Time.fromString('23:30:00')
      expect(time.getHours()).toBe(23)
      expect(time.getMinutes()).toBe(30)
      expect(time.getSeconds()).toBe(0)
    })
  })

  describe('new Time()', () => {
    it('Throws an error when invalid values are provided', () => {
      expect(() => new Time(24, 0, 0)).toThrow(InvalidHours)
      expect(() => new Time(-1, 0, 0)).toThrow(InvalidHours)
      expect(() => new Time(NaN, 0, 0)).toThrow(InvalidHours)
      expect(() => new Time(Infinity, 0, 0)).toThrow(InvalidHours)

      expect(() => new Time(0, 60, 0)).toThrow(InvalidMinutes)
      expect(() => new Time(0, -1, 0)).toThrow(InvalidMinutes)
      expect(() => new Time(0, NaN, 0)).toThrow(InvalidMinutes)
      expect(() => new Time(0, Infinity, 0)).toThrow(InvalidMinutes)

      expect(() => new Time(0, 0, 60)).toThrow(InvalidSeconds)
      expect(() => new Time(0, 0, -1)).toThrow(InvalidSeconds)
      expect(() => new Time(0, 0, NaN)).toThrow(InvalidSeconds)
      expect(() => new Time(0, 0, Infinity)).toThrow(InvalidSeconds)
    })

    it('When creating a time with valid values, it creates the correct time', () => {
      const time = new Time(23, 59, 59)
      expect(time.getHours()).toBe(23)
      expect(time.getMinutes()).toBe(59)
      expect(time.getSeconds()).toBe(59)

      const midnight = new Time(0, 0, 0)
      expect(midnight.getHours()).toBe(0)
      expect(midnight.getMinutes()).toBe(0)
      expect(midnight.getSeconds()).toBe(0)
    })
  })

  describe('toString', () => {
    it('When converting a Time to a string, it should return the correct format', () => {
      expect(new Time(23, 59, 59).toString()).toBe('23:59:59')
      expect(new Time(0, 1, 2).toString()).toBe('00:01:02')
      expect(Time.fromString('05:23:58').toString()).toBe('05:23:58')
    })
  })

  describe('isBefore', () => {
    it('When comparing times, it should determine the order correctly', () => {
      const time = Time.fromString('10:10:10')
      const otherTime = Time.fromString('20:20:20')

      expect(time.isBefore(time)).toBe(false)
      expect(time.isBefore(otherTime)).toBe(true)
      expect(otherTime.isBefore(time)).toBe(false)
    })
  })

  describe('isBeforeOrEqual', () => {
    it('When comparing times, it should determine the order correctly', () => {
      const time = Time.fromString('10:10:10')
      const otherTime = Time.fromString('20:20:20')

      expect(time.isBeforeOrEqual(time)).toBe(true)
      expect(time.isBeforeOrEqual(otherTime)).toBe(true)
      expect(otherTime.isBeforeOrEqual(time)).toBe(false)
    })
  })

  describe('isAfter', () => {
    it('When comparing times, it should determine the order correctly', () => {
      const time = Time.fromString('10:10:10')
      const otherTime = Time.fromString('20:20:20')

      expect(time.isAfter(time)).toBe(false)
      expect(time.isAfter(otherTime)).toBe(false)
      expect(otherTime.isAfter(time)).toBe(true)
    })
  })

  describe('isAfterOrEqual', () => {
    it('When comparing times, it should determine the order correctly', () => {
      const time = Time.fromString('10:10:10')
      const otherTime = Time.fromString('20:20:20')

      expect(time.isAfterOrEqual(time)).toBe(true)
      expect(time.isAfterOrEqual(otherTime)).toBe(false)
      expect(otherTime.isAfterOrEqual(time)).toBe(true)
    })
  })

  describe('equals', () => {
    it('When comparing times, it should determine the equality correctly', () => {
      const time = Time.fromString('10:10:10')
      const otherTime = Time.fromString('20:20:20')

      expect(time.equals(time)).toBe(true)
      expect(time.equals(otherTime)).toBe(false)
      expect(otherTime.equals(time)).toBe(false)
    })
  })

  // describe('fromDto', () => {
  //   it.each([
  //     { invalidDto: new TimeDto() },
  //     { invalidDto: plainToInstance(TimeDto, { hours: -1, minutes: 0, seconds: 0 }) },
  //     { invalidDto: plainToInstance(TimeDto, { hours: 0, minutes: -1, seconds: 0 }) },
  //     { invalidDto: plainToInstance(TimeDto, { hours: 0, minutes: 0, seconds: -1 }) },
  //     { invalidDto: plainToInstance(TimeDto, { hours: 24, minutes: 0, seconds: 0 }) },
  //     { invalidDto: plainToInstance(TimeDto, { hours: 0, minutes: 60, seconds: 0 }) },
  //     { invalidDto: plainToInstance(TimeDto, { hours: 0, minutes: 0, seconds: 60 }) }
  //   ])('Throws an error when an invalid dto is given', ({ invalidDto }) => {
  //     expect(() => Time.fromDto(invalidDto)).toThrow(TimeError)
  //   })
  //
  //   it.each([
  //     { invalidDto: plainToInstance(TimeDto, { hours: 0, minutes: 0, seconds: 0 }) },
  //     { invalidDto: plainToInstance(TimeDto, { hours: 23, minutes: 0, seconds: 0 }) },
  //     { invalidDto: plainToInstance(TimeDto, { hours: 0, minutes: 59, seconds: 0 }) },
  //     { invalidDto: plainToInstance(TimeDto, { hours: 0, minutes: 0, seconds: 59 }) },
  //     { invalidDto: plainToInstance(TimeDto, { hours: 23, minutes: 59, seconds: 59 }) },
  //     { invalidDto: plainToInstance(TimeDto, { hours: 1, minutes: 1, seconds: 1 }) },
  //     { invalidDto: plainToInstance(TimeDto, { hours: 12, minutes: 40, seconds: 20 }) }
  //   ])('Creates a time object from a valid time DTO', ({ invalidDto }) => {
  //     expect(() => Time.fromDto(invalidDto)).not.toThrow()
  //   })
  // })
})
