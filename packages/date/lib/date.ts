import dayjs, {Dayjs} from "dayjs";
import {InvalidDate} from "./invalid-date";
import {DateUnit, DiffDateUnit, GetDateUnit, ReachableDateUnit} from "./units";
import {PlainDateObject} from "./plain-date-object";
import {Month} from "./month";
import {FutureInfinityDate} from "./future-infinity-date";
import {PastInfinityDate} from "./past-infinity-date";


export class WiseDate {
  private static _futureInfinity = new FutureInfinityDate()
  private static _pastInfinity = new PastInfinityDate()

  public static today(): WiseDate {
    return new WiseDate(dayjs())
  }

  public static tomorrow(): WiseDate {
    return new WiseDate(dayjs().add(1,'day'))
  }

  public static yesterday(): WiseDate {
    return new WiseDate(dayjs().subtract(1,'day'))
  }

  public static futureInfinity(): WiseDate {
    return this._futureInfinity
  }

  public static pastInfinity(): WiseDate {
    return this._pastInfinity
  }

  public static fromString(stringDate: string, format: string): WiseDate {
    return new WiseDate(dayjs(stringDate, format, true))
  }

  public static fromPlainObject(date: PlainDateObject): WiseDate {
    const {year, month, day} = date
    return new WiseDate(year,month,day)
  }

  public static create(year: number, month: number, day: number): WiseDate {
    return new WiseDate(year,month,day)
  }

  private date: Dayjs

  protected constructor(dayjs: Dayjs)
  protected constructor(year: number, month: number, day: number)
  protected constructor(dayjsOrYear: Dayjs | number, month?: number | Month, day?: number) {
    if(dayjsOrYear instanceof Dayjs) {
      this.date = dayjsOrYear.startOf('day')
    } else {
      this.date = dayjs({year: dayjsOrYear, month: (month as number | Month) - 1, day})
    }

    if(!this.date.isValid()) {
      throw new InvalidDate(this)
    }
  }

  public isSame(otherDate: WiseDate, unit?: DateUnit): boolean {
    return this.date.isSame(otherDate.date, unit)
  }

  public isAfter(otherDate: WiseDate, unit?: DateUnit): boolean {
    if(otherDate.isFutureInfinity()) return false
    else if (otherDate.isPastInfinity()) return true
    return this.date.isAfter(otherDate.date, unit)
  }

  public isSameOrAfter(otherDate: WiseDate, unit?: DateUnit): boolean {
    return this.isAfter(otherDate, unit) || this.isSame(otherDate, unit)
  }

  public isBefore(otherDate: WiseDate, unit?: DateUnit): boolean {
    if(otherDate.isPastInfinity()) return false
    else if (otherDate.isFutureInfinity()) return true
    return this.date.isBefore(otherDate.date, unit)
  }

  public isSameOrBefore(otherDate: WiseDate, unit?: DateUnit): boolean {
    return this.isBefore(otherDate, unit) || this.isSame(otherDate, unit)
  }

  public startOf(unit: ReachableDateUnit): WiseDate {
    return new WiseDate(this.date.startOf(unit))
  }

  public endOf(unit: ReachableDateUnit): WiseDate {
    return new WiseDate(this.date.startOf(unit))
  }

  public get year(): number {
    return this.date.get('year')
  }

  public get month(): number {
    return this.date.get('month') + 1
  }

  public get dayOfMonth(): number {
    return this.date.get('day')
  }

  public get day(): number {
    return this.dayOfMonth
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
    return new WiseDate(this.date.add(amount,unit))
  }

  public subtract(amount: number, unit: DateUnit): WiseDate {
    return new WiseDate(this.date.subtract(amount,unit))
  }

  public diff(withOther: WiseDate, unit: DiffDateUnit, asFloat: boolean = false): number {
    if(withOther.isFutureInfinity() || withOther.isPastInfinity()) {
      return Infinity
    } else {
      return this.date.diff(withOther.date,unit, asFloat)
    }
  }

  public format(template: string): string {
    return this.date.format(template)
  }

  public clone(): WiseDate {
    return new WiseDate(this.date.clone())
  }

  public toPlainObject(): PlainDateObject {
    return {
      year: this.year,
      month: this.month + 1,
      day: this.day
    }
  }

  public toDate(): Date {
    return new Date(this.date.valueOf())
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
    return this.isPastInfinity() || this.isFutureInfinity()
  }
}
