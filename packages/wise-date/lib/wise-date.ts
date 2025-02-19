import dayjs from "dayjs";
import {InvalidDate} from "./invalid-date.js";
import {DateUnit, DiffDateUnit, GetDateUnit, ReachableDateUnit} from "./units.js";
import {PlainDateObject} from "./plain-date-object.js";
import {Month} from "./month.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat)

export class WiseDate {
  public static today(): WiseDate {
    return new WiseDate()
  }

  public static tomorrow(): WiseDate {
    return new WiseDate(dayjs().add(1, 'day'))
  }

  public static yesterday(): WiseDate {
    return new WiseDate(dayjs().subtract(1, 'day'))
  }

  public static max(date: WiseDate, otherDate: WiseDate): WiseDate {
    return date.isAfter(otherDate) ? date : otherDate
  }

  public static min(date: WiseDate, otherDate: WiseDate): WiseDate {
    return date.isBefore(otherDate) ? date : otherDate
  }

  private date: dayjs.Dayjs

  /** Defaults to today */
  public constructor()
  /**
   *  Parse a date from a string
   *  @see https://day.js.org/docs/en/display/format
   */
  public constructor(dateString: string, format?: string)
  public constructor(dayjs: dayjs.Dayjs)
  public constructor(dayjs: Date)
  public constructor(plainTimeObject: PlainDateObject)
  public constructor(
    input?: dayjs.Dayjs | string | Date | PlainDateObject,
    format: string = 'YYYY-MM-DD',
  ) {
    if (input === undefined) {
      this.date = dayjs()
    } else if (input instanceof Date) {
      this.date = dayjs(input)
    } else if (dayjs.isDayjs(input)) {
      this.date = input.clone()
    } else if (typeof input === 'string') {
      this.date = dayjs(input, format, true)
    } else {
      this.date = dayjs(`${input.year}-${input.month}-${input.day}`, 'YYYY-M-D', true)
    }

    if (!this.date.isValid()) {
      throw new InvalidDate(this)
    }
    this.date = this.date.startOf('day')
  }

  public isSame(otherDate: WiseDate, unit: DateUnit = 'day'): boolean {
    return this.date.isSame(otherDate.date, unit)
  }

  public isAfter(otherDate: WiseDate, unit: DateUnit = 'day'): boolean {
    if (otherDate.isFutureInfinity()) {
      return false
    } else if (otherDate.isPastInfinity()) {
      return true
    } else {
      return this.date.isAfter(otherDate.date, unit)
    }
  }

  public isSameOrAfter(otherDate: WiseDate, unit: DateUnit = 'day'): boolean {
    return this.isAfter(otherDate, unit) || this.isSame(otherDate, unit)
  }

  public isBefore(otherDate: WiseDate, unit?: DateUnit): boolean {
    if (otherDate.isPastInfinity()) {
      return false
    } else if (otherDate.isFutureInfinity()) {
      return true
    } else {
      return this.date.isBefore(otherDate.date, unit)
    }
  }

  public isSameOrBefore(otherDate: WiseDate, unit: DateUnit = 'day'): boolean {
    return this.isBefore(otherDate, unit) || this.isSame(otherDate, unit)
  }

  public startOf(unit: ReachableDateUnit): WiseDate {
    return new WiseDate(this.date.startOf(unit))
  }

  public endOf(unit: ReachableDateUnit): WiseDate {
    return new WiseDate(this.date.endOf(unit))
  }

  public get year(): number {
    return this.date.get('year')
  }

  public get month(): Month {
    return this.date.get('month') + 1
  }

  public get dayOfMonth(): number {
    return this.date.get('day')
  }

  public get weekOfYear(): number {
    return this.date.week()
  }

  public get dayOfYear(): number {
    return this.date.dayOfYear()
  }

  public isToday(): boolean {
    return this.date.isToday()
  }

  public isTomorrow(): boolean {
    return this.date.isTomorrow()
  }

  public isYesterday(): boolean {
    return this.date.isYesterday()
  }

  public add(amount: number, unit: DateUnit): WiseDate {
    return new WiseDate(this.date.add(amount, unit))
  }

  public subtract(amount: number, unit: DateUnit): WiseDate {
    return new WiseDate(this.date.subtract(amount, unit))
  }

  public diff(withOther: WiseDate, unit: DiffDateUnit, precise = false): number {
    if (withOther.isFutureInfinity() || withOther.isPastInfinity()) {
      return Infinity
    } else {
      return this.date.diff(withOther.date, unit, precise)
    }
  }

  /**
   * @see https://day.js.org/docs/en/display/format
   */
  public format(template: string): string {
    return this.date.format(template)
  }

  public clone(): WiseDate {
    return new WiseDate(this.date)
  }

  public toPlainObject(): PlainDateObject {
    return {
      year: this.year,
      month: this.month,
      day: this.dayOfMonth
    }
  }

  public toDate(): Date {
    return this.date.toDate()
  }

  public toString(): String {
    return this.format('YYYY-MM-DD')
  }

  public isFutureInfinity(): boolean {
    return false
  }

  public isPastInfinity(): boolean {
    return false
  }

  public isInfinity(): boolean {
    return this.isFutureInfinity() || this.isPastInfinity()
  }
}
