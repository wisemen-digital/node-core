import {WiseDate} from "./wise-date.js";
import {DateRangeBound, intersect, isInclusive} from "./date-range-bound.js";

export class BoundedDate {

  public static max(firstDate: BoundedDate, secondDate: BoundedDate): BoundedDate {
    if(firstDate._date.isSame(secondDate._date)) {
      return new BoundedDate(firstDate.date, intersect(firstDate.bound, secondDate.bound))
    } else if(firstDate._date.isAfter(secondDate._date)) {
      return new BoundedDate(firstDate.date, firstDate.bound)
    } else {
      return new BoundedDate(secondDate.date, secondDate.bound)
    }
  }

  public static min(firstDate: BoundedDate, secondDate: BoundedDate): BoundedDate {
    if(firstDate._date.isSame(secondDate._date)) {
      return new BoundedDate(firstDate.date, intersect(firstDate.bound, secondDate.bound))
    } else if(firstDate._date.isBefore(secondDate._date)) {
      return new BoundedDate(firstDate.date, firstDate.bound)
    } else {
      return new BoundedDate(secondDate.date, secondDate.bound)
    }
  }

  private readonly _date: WiseDate
  private readonly _bound: DateRangeBound
  constructor(date: WiseDate, bound: DateRangeBound) {
    this._date = date
    this._bound = bound
  }

  public get bound(): DateRangeBound {
    return this._bound
  }

  public get date(): WiseDate {
    return this._date.clone()
  }

  public isSameOrBefore(otherBoundedDate: BoundedDate): boolean {
    if(isInclusive(this._bound) && isInclusive(otherBoundedDate._bound)) {
      return this._date.isSameOrBefore(otherBoundedDate._date)
    } else {
      return this._date.isBefore(otherBoundedDate._date)
    }
  }

  public isSameOrAfter(otherBoundedDate: BoundedDate): boolean {
    if(isInclusive(this.bound)&& isInclusive(otherBoundedDate.bound)) {
      return this._date.isSameOrAfter(otherBoundedDate._date)
    } else {
      return this._date.isSame(otherBoundedDate._date)
    }
  }
}
