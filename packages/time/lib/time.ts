import {SECONDS_PER_HOUR, SECONDS_PER_MINUTE, TimeZone} from './constants.js'
import { InvalidBounds, InvalidHours, InvalidMinutes, InvalidSeconds, InvalidTimeString } from './time-error.js'
import {PlainTimeObject} from "./plain-time-object.type.js";
import {InclusivityString} from "./inclusivity.js";
import dayjs from "dayjs";
import UTC from 'dayjs/plugin/utc.js'
import TZ from 'dayjs/plugin/timezone.js'
import { TimeUnit } from './units.js';
import { exhaustiveCheck } from './exhaustive-check.helper.js';

dayjs.extend(UTC)
dayjs.extend(TZ)

export class Time {
  public static STRING_FORMAT = 'hh:mm:ss'
  public static MIN_HOURS = 0
  public static MAX_HOURS = 23
  public static MIN_MINUTES = 0
  public static MAX_MINUTES = 59
  public static MIN_SECONDS = 0
  public static MAX_SECONDS = 59

  public static isValidTimeString (timeString?: string | null): boolean {
    if (timeString == null) return false
    return /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(timeString)
  }

  /**
   * Get the absolute floored amount of hours between
   * two times
   */
  public static hoursBetween (first: string, second: string): number
  public static hoursBetween (first: Time, second: Time): number
  public static hoursBetween (first: Time | string, second: Time | string): number {
    const differenceInSeconds = Time.secondsBetween(first, second)
    return Math.floor(differenceInSeconds / SECONDS_PER_HOUR)
  }

  /**
   * Get the absolute floored amount of minutes between
   * two times. Includes the hours difference.
   */
  public static minutesBetween (first: string, second: string): number
  public static minutesBetween (first: Time, second: Time): number
  public static minutesBetween (first: Time | string, second: Time | string): number {
    const differenceInSeconds = Time.secondsBetween(first, second)
    return Math.floor(differenceInSeconds / SECONDS_PER_MINUTE)
  }

  /**
   * Get the absolute floored amount of seconds between
   * two times. Includes the hours and minutes differences.
   */
  public static secondsBetween (first: string, second: string): number
  public static secondsBetween (first: Time, second: Time): number
  public static secondsBetween (first: Time | string, second: Time | string): number
  public static secondsBetween (first: Time | string, second: Time | string): number {
    if (typeof first === 'string') {
      first = new Time(first)
    }
    if (typeof second === 'string') {
      second = new Time(second)
    }
    return Math.abs(first.absoluteSeconds - second.absoluteSeconds)
  }

  public static min (firstTime: Time, secondTime: Time): Time {
    if (firstTime.isBefore(secondTime)) return firstTime
    return secondTime
  }

  public static max (firstTime: Time, secondTime: Time): Time {
    if (firstTime.isAfter(secondTime)) return firstTime
    return secondTime
  }

  private absoluteSeconds: number

  /** @throws TimeError */
  public constructor (timeString: string)
  public constructor (date: Date)
  public constructor (timeObject: PlainTimeObject)
  public constructor (absoluteSeconds: number)
  public constructor (hours: number, minutes: number, seconds: number)
  public constructor (
    target: number | string | PlainTimeObject | Date,
    minutes?: number,
    seconds?: number
  ) {
    let absoluteSeconds: number
    if(typeof target === 'string') {
      if (!Time.isValidTimeString(target)) {
        throw new InvalidTimeString(target)
      }
      const [hours, minutes, seconds] = target.split(':').map(v => parseInt(v))
      absoluteSeconds = this.calculateAbsoluteSeconds(hours, minutes, seconds)
    } else if(typeof target === 'number' && minutes === undefined && seconds === undefined) {
      absoluteSeconds = target
    } else if(typeof target === 'number' && minutes !== undefined && seconds !== undefined) {
      absoluteSeconds = this.calculateAbsoluteSeconds(target, minutes, seconds)
    } else if (target instanceof Date) {
      absoluteSeconds = this.calculateAbsoluteSeconds(target.getHours(), target.getMinutes(), target.getSeconds())
    } else if (typeof target === 'object') {
      absoluteSeconds = this.calculateAbsoluteSeconds(target.hours, target.minutes, target.seconds)
    } else {
      throw new Error('Invalid arguments')
    }

    this.validateAbsoluteSeconds(absoluteSeconds)

    this.absoluteSeconds = absoluteSeconds
  }

  public toString (): string {
    const hours = this.getHours().toString().padStart(2, '0')
    const minutes = this.getMinutes().toString().padStart(2, '0')
    const seconds = this.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  public isBefore (other: Time): boolean {
    return this.absoluteSeconds < other.absoluteSeconds
  }

  public isSameOrBefore (other: Time): boolean {
    return this.isBefore(other) || this.isSame(other)
  }

  public isAfter (other: Time): boolean {
    return this.absoluteSeconds > other.absoluteSeconds
  }

  public isSameOrAfter (other: Time): boolean {
    return this.isAfter(other) || this.isSame(other)
  }

  /**
   * @param lowerBound must be before or same as upperBound
   * @param upperBound must be after or same as lowerBound
   * @throws InvalidBounds
   */
  public isBetween (lowerBound: Time, upperBound: Time, inclusivity: InclusivityString = '[]'): boolean {
    if (lowerBound.isAfter(upperBound)) {
      throw new InvalidBounds(lowerBound, upperBound)
    }

    switch (inclusivity){
      case "[]": return this.isSameOrAfter(lowerBound) && this.isSameOrBefore(upperBound)
      case "[)": return this.isSameOrAfter(lowerBound) && this.isBefore(upperBound)
      case "(]": return this.isAfter(lowerBound) && this.isSameOrBefore(upperBound)
      case "()": return this.isAfter(lowerBound) && this.isBefore(upperBound)
      default:   return inclusivity
    }
  }

  public isSame (other: Time): boolean {
    return this.absoluteSeconds === other.absoluteSeconds
  }

  public getHours (absoluteSeconds: number = this.absoluteSeconds): number {
    return Math.floor(absoluteSeconds / SECONDS_PER_HOUR)
  }

  public getMinutes (absoluteSeconds: number = this.absoluteSeconds): number {
    return Math.floor((absoluteSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
  }

  public getSeconds (absoluteSeconds: number = this.absoluteSeconds): number {
    return absoluteSeconds % SECONDS_PER_MINUTE
  }

  public toPlainObject (): PlainTimeObject {
    return {
      hours: this.getHours(),
      minutes: this.getMinutes(),
      seconds: this.getSeconds()
    }
  }

  public copy(): Time {
    return new Time(this.toPlainObject())
  }

  public combine(withDate: Date, timeZone: TimeZone): Date {
    const date = dayjs(withDate).format('YYYY-MM-DD')
    return dayjs.tz(`${date} ${this.toString()}`, 'YYYY-MM-DD HH:mm:ss', timeZone).toDate()
  }

  public subtract(amount: number, unit: TimeUnit): Time {
    const seconds = this.absoluteSeconds - amount * this.secondsInUnit(unit)
    this.validateAbsoluteSeconds(seconds)
    return new Time(seconds)
  }

  public add(amount: number, unit: TimeUnit): Time {
    const seconds = this.absoluteSeconds + amount * this.secondsInUnit(unit)
    this.validateAbsoluteSeconds(seconds)
    return new Time(seconds)
  }

  private secondsInUnit(unit: TimeUnit): number {
    switch (unit) {
      case 'second':
      case 'seconds': 
      case 's':
      return 1
      case 'minute':
      case 'minutes': 
      case 'm':
      return SECONDS_PER_MINUTE
      case 'hour':
      case 'hours': 
      case 'h':
      return SECONDS_PER_HOUR
      default: exhaustiveCheck(unit)
    }
  }

  private calculateAbsoluteSeconds (hours: number, minutes: number, seconds: number): number {
    return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds
  }

  private validateAbsoluteSeconds (absoluteSeconds: number): void {
    const hours = this.getHours(absoluteSeconds)
    const minutes = this.getMinutes(absoluteSeconds)
    const seconds = this.getSeconds(absoluteSeconds)

    if (absoluteSeconds < 0) {
      throw new InvalidSeconds(absoluteSeconds)
    }
    if (!this.isValidHours(hours)) {
      throw new InvalidHours(hours)
    }
    if (!this.isValidMinutes(minutes)) {
      throw new InvalidMinutes(minutes)
    }
    if (!this.isValidSeconds(seconds)) {
      throw new InvalidSeconds(seconds)
    }
  }

  private isValidHours (hours: number): boolean {
    return Time.MIN_HOURS <= hours && hours <= Time.MAX_HOURS
  }

  private isValidMinutes (minutes: number): boolean {
    return Time.MIN_MINUTES <= minutes && minutes <= Time.MAX_MINUTES
  }

  private isValidSeconds (seconds: number): boolean {
    return Time.MIN_SECONDS <= seconds && seconds <= Time.MAX_SECONDS
  }
}
