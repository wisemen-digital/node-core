import {WiseDate} from "./wise-date.js";
import dayjs, {Dayjs} from "dayjs";
import {DateUnit, DiffDateUnit, ReachableDateUnit} from "./units.js";
import {PlainDateObject} from "./plain-date-object.js";
import {Duration} from "./duration.js";

export class FutureInfinityDate extends WiseDate {
  constructor() {
    super(dayjs(8.64e15));
  }

  isSame(otherDate: WiseDate, _unit?: DateUnit): boolean {
    return otherDate instanceof FutureInfinityDate
  }

  isAfter(_otherDate: WiseDate, _unit?: DateUnit): boolean {
    return true
  }

  isSameOrAfter(_otherDate: WiseDate, _unit?: DateUnit): boolean {
    return true
  }

  isBefore(_otherDate: WiseDate, _unit?: DateUnit): boolean {
    return false
  }

  isSameOrBefore(otherDate: WiseDate, unit?: DateUnit): boolean {
    return this.isSame(otherDate, unit)
  }

  startOf(_unit: ReachableDateUnit): WiseDate {
    return this
  }

  endOf(unit: ReachableDateUnit): WiseDate {
    return this
  }

  get year(): number {
    return Infinity;
  }

  get month(): number {
    return Infinity;
  }

  get dayOfMonth(): number {
    return Infinity;
  }

  get weekOfYear(): number {
    return Infinity;
  }

  get dayOfYear(): number {
    return Infinity;
  }

  isToday(): boolean {
    return false;
  }

  isTomorrow(): boolean {
    return false;
  }

  isYesterday(): boolean {
    return false;
  }

  public add(duration: Duration)
  public add(amount: number, unit: DateUnit)
  public add(input: Duration | number, unit?: DateUnit): WiseDate {
    return this
  }

  public subtract(duration: Duration)
  public subtract(amount: number, unit: DateUnit)
  public subtract(input: Duration | number, unit?: DateUnit): WiseDate {
    return this
  }

  diff(withOther: WiseDate, unit: DiffDateUnit, precise = false): number {
    return Infinity;
  }

  format(template: string): string {
    return 'future infinity';
  }

  clone(): WiseDate {
    return this;
  }

  toPlainObject(): PlainDateObject {
    return {
      year: Infinity,
      month: Infinity,
      day: Infinity
    }
  }

  toString(): String {
    return 'future infinity';
  }

  isFutureInfinity(): boolean {
    return true;
  }

  isPastInfinity(): boolean {
    return false;
  }

  isInfinity(): boolean {
    return true;
  }
}
