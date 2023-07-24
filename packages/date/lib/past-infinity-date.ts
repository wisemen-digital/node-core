import {WiseDate} from "./date";
import dayjs, {Dayjs} from "dayjs";
import {DateUnit, DiffDateUnit, ReachableDateUnit} from "./units";
import {PlainDateObject} from "./plain-date-object";

export class PastInfinityDate extends WiseDate {
  constructor() {
    super(dayjs(new Date(-8640000000000000)));
  }


  isSame(otherDate: WiseDate, _unit?: DateUnit): boolean {
    return otherDate instanceof PastInfinityDate
  }

  isAfter(_otherDate: WiseDate, _unit?: DateUnit): boolean {
    return false
  }

  isSameOrAfter(_otherDate: WiseDate, _unit?: DateUnit): boolean {
    return this.isSame(_otherDate,_unit)
  }

  isBefore(_otherDate: WiseDate, _unit?: DateUnit): boolean {
    return true
  }

  isSameOrBefore(otherDate: WiseDate, unit?: DateUnit): boolean {
    return true
  }

  startOf(_unit: ReachableDateUnit): WiseDate {
    return this
  }

  endOf(unit: ReachableDateUnit): WiseDate {
    return this
  }

  get year(): number {
    return -Infinity;
  }

  get month(): number {
    return -Infinity;
  }

  get dayOfMonth(): number {
    return -Infinity;
  }

  get day(): number {
    return -Infinity;
  }

  get weekOfYear(): number {
    return -Infinity;
  }

  get dayOfYear(): number {
    return -Infinity;
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

  add(amount: number, unit: DateUnit): WiseDate {
    return this
  }

  subtract(amount: number, unit: DateUnit): WiseDate {
    return this
  }

  diff(withOther: WiseDate, unit: DiffDateUnit, asFloat: boolean = false): number {
    return Infinity;
  }

  format(template: string): string {
    return 'past infinity';
  }

  clone(): WiseDate {
    return this;
  }

  toPlainObject(): PlainDateObject {
    return {
      year: -Infinity,
      month: -Infinity,
      day: -Infinity
    }
  }

  toString(): String {
    return 'past infinity';
  }

  isFutureInfinity(): boolean {
    return false;
  }

  isPastInfinity(): boolean {
    return true;
  }
}
