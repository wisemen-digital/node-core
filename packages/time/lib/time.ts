import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from './constants.js'
import { InvalidBounds, InvalidHours, InvalidMinutes, InvalidSeconds, InvalidTimeString } from './time-error.js'

export class Time {
  public static STRING_FORMAT = 'hh:mm:ss'
  public static MIN_HOURS = 0
  public static MAX_HOURS = 23
  public static MIN_MINUTES = 0
  public static MAX_MINUTES = 59
  public static MIN_SECONDS = 0
  public static MAX_SECONDS = 59

  public static fromString (timeString: string): Time {
    if (!Time.isValidTimeString(timeString)) {
      throw new InvalidTimeString(timeString)
    }
    const [hours, minutes, seconds] = timeString.split(':').map(v => parseInt(v))
    return new Time(hours, minutes, seconds)
  }

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
      first = Time.fromString(first)
    }
    if (typeof second === 'string') {
      second = Time.fromString(second)
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
  public constructor (hours: number, minutes: number, seconds: number) {
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
   * @param lowerBound must be before upperBound
   * @param upperBound must be after lowerBound
   * @throws InvalidBounds
   */
  public isBetween (lowerBound: Time, upperBound: Time): boolean {
    if (lowerBound.isAfterOrEqual(upperBound)) {
      throw new InvalidBounds(lowerBound, upperBound)
    }
    return this.isAfter(lowerBound) && this.isBefore(upperBound)
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
