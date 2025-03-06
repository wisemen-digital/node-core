import {SECONDS_PER_HOUR, SECONDS_PER_MINUTE, TimeZone} from './constants.js'
import { InvalidBounds, InvalidHours, InvalidMinutes, InvalidSeconds, InvalidTimeString } from './time-error.js'
import {PlainTimeObject} from "./plain-time-object.type.js";
import {Inclusivity} from "./inclusivity.js";
import dayjs from "dayjs";
import UTC from 'dayjs/plugin/utc.js'
import TZ from 'dayjs/plugin/timezone.js'

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
    return Math.abs(first.toSeconds() - second.toSeconds())
  }

  public static min (firstTime: Time, secondTime: Time): Time {
    if (firstTime.isBefore(secondTime)) return firstTime
    return secondTime
  }

  public static max (firstTime: Time, secondTime: Time): Time {
    if (firstTime.isAfter(secondTime)) return firstTime
    return secondTime
  }

  private hours: number
  private minutes: number
  private seconds: number

  /** @throws TimeError */
  public constructor (timeString: string)
  public constructor (date: Date)
  public constructor (timeObject: PlainTimeObject)
  public constructor (hours: number, minutes: number, seconds: number)
  public constructor (
    target: number | string | PlainTimeObject | Date,
    minutes: number = 0,
    seconds: number= 0
  ) {
    let hours: number
    if(typeof target === 'string') {
      if (!Time.isValidTimeString(target)) {
        throw new InvalidTimeString(target)
      }
      [hours, minutes, seconds] = target.split(':').map(v => parseInt(v))
    } else if(typeof target === 'number') {
      hours = target
    } else if (target instanceof Date) {
      hours = target.getHours()
      minutes = target.getMinutes()
      seconds = target.getSeconds()
    } else {
      hours = target.hours
      minutes = target.minutes
      seconds = target.seconds
    }

    this.setHours(hours)
    this.setMinutes(minutes)
    this.setSeconds(seconds)
  }

  public toString (): string {
    const hours = this.hours.toString().padStart(2, '0')
    const minutes = this.minutes.toString().padStart(2, '0')
    const seconds = this.seconds.toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  public isBefore (other: Time): boolean {
    return this.toSeconds() < other.toSeconds()
  }

  public isBeforeOrEqual (other: Time): boolean {
    return this.isBefore(other) || this.equals(other)
  }

  public isAfter (other: Time): boolean {
    return this.toSeconds() > other.toSeconds()
  }

  public isAfterOrEqual (other: Time): boolean {
    return this.isAfter(other) || this.equals(other)
  }

  /**
   * @param lowerBound must be before or same as upperBound
   * @param upperBound must be after or same as lowerBound
   * @throws InvalidBounds
   */
  public isBetween (lowerBound: Time, upperBound: Time, inclusivity: Inclusivity = '[]'): boolean {
    if (lowerBound.isAfter(upperBound)) {
      throw new InvalidBounds(lowerBound, upperBound)
    }

    switch (inclusivity){
      case "[]": return this.isAfterOrEqual(lowerBound) && this.isBeforeOrEqual(upperBound)
      case "[)": return this.isAfterOrEqual(lowerBound) && this.isBefore(upperBound)
      case "(]": return this.isAfter(lowerBound) && this.isBeforeOrEqual(upperBound)
      case "()": return this.isAfter(lowerBound) && this.isBefore(upperBound)
      default:   return inclusivity
    }
  }

  public equals (other: Time): boolean {
    return this.hours === other.hours &&
      this.minutes === other.minutes &&
      this.seconds === other.seconds
  }

  public getHours (): number {
    return this.hours
  }

  public getMinutes (): number {
    return this.minutes
  }

  public getSeconds (): number {
    return this.seconds
  }

  public toPlainObject (): PlainTimeObject {
    return {
      hours: this.getHours(),
      minutes: this.getMinutes(),
      seconds: this.getSeconds()
    }
  }

  public copy(): Time {
    return new Time(this.hours, this.minutes, this.seconds)
  }

  public combine(withDate: Date, timeZone: TimeZone): Date {
    const date = dayjs(withDate).format('YYYY-MM-DD')
    return dayjs.tz(`${date} ${this.toString()}`, 'YYYY-MM-DD HH:mm:ss', timeZone).toDate()
  }

  private setHours (hours: number): void {
    if (!this.isValidHours(hours)) {
      throw new InvalidHours(hours)
    }
    this.hours = hours
  }

  private setMinutes (minutes: number): void {
    if (!this.isValidMinutes(minutes)) {
      throw new InvalidMinutes(minutes)
    }
    this.minutes = minutes
  }

  private setSeconds (seconds: number): void {
    if (!this.isValidSeconds(seconds)) {
      throw new InvalidSeconds(seconds)
    }
    this.seconds = seconds
  }

  private toSeconds (): number {
    let totalSeconds = this.hours * SECONDS_PER_HOUR
    totalSeconds += this.minutes * SECONDS_PER_MINUTE
    totalSeconds += this.seconds
    return totalSeconds
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
