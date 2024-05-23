import {WiseDate} from "./wise-date.js";
import {InvalidBounds, NoOverlap} from "./date-range-errors.js";
import {DateRangeBound, intersect, isInclusive} from "./date-range-bound.js";
import {BoundedDate} from "./bounded-date.js";

export class DateRange {
  private readonly _lowerBound: WiseDate
  private readonly _upperBound: WiseDate
  private readonly lowerBoundMode: DateRangeBound
  private readonly upperBoundMode: DateRangeBound

  constructor(
    lowerBound: WiseDate,
    upperBound: WiseDate,
  )
  constructor(
    lowerBound: WiseDate,
    upperBound: WiseDate,
    boundMode: DateRangeBound
  )
  constructor(
    lowerBound: WiseDate,
    upperBound: WiseDate,
    lowerBoundMode: DateRangeBound,
    upperBoundMode: DateRangeBound
  )
  constructor(
    lowerBound: WiseDate,
    upperBound: WiseDate,
    lowerBoundOrBoundsMode: DateRangeBound = DateRangeBound.INCLUSIVE,
    upperBoundMode?: DateRangeBound
  ) {
    if(upperBoundMode === undefined) {
      this.lowerBoundMode = lowerBoundOrBoundsMode
      this.upperBoundMode = lowerBoundOrBoundsMode
    } else {
      this.lowerBoundMode = lowerBoundOrBoundsMode
      this.upperBoundMode = upperBoundMode
    }
    this._upperBound = upperBound
    this._lowerBound = lowerBound

    if(upperBound.isBefore(lowerBound)) {
      throw new InvalidBounds(this)
    }
  }

  public get lowerBound(): WiseDate { return this._lowerBound.clone() }
  public get upperBound(): WiseDate { return this._lowerBound.clone() }

  public get years(): number {
    return  this.upperBound.diff(this.lowerBound, 'years')
  }

  public get months(): number {
    return  this.upperBound.diff(this.lowerBound, 'months')
  }

  public get quarters(): number {
    return  this.upperBound.diff(this.lowerBound, 'quarters')
  }

  public get weeks(): number {
    return  this.upperBound.diff(this.lowerBound, 'weeks')
  }

  public get days(): number {
    return  this.upperBound.diff(this.lowerBound, 'days')
  }

  public isEmpty(): boolean {
    return this.days === 0
  }

  public contains(date: WiseDate): boolean {
    return this.isSameOrAfterLowerBound(date) && this.isSameOrBeforeUpperBound(date)
  }

  public overlaps(otherRange: DateRange): boolean {
    const thisLowerBound = new BoundedDate(this._lowerBound, this.lowerBoundMode)
    const thisUpperBound = new BoundedDate(this._upperBound, this.upperBoundMode)
    const otherLowerBound = new BoundedDate(otherRange._lowerBound, otherRange.lowerBoundMode)
    const otherUpperBound = new BoundedDate(otherRange._upperBound, otherRange.upperBoundMode)

    return thisLowerBound.isSameOrBefore(otherUpperBound) &&
      thisUpperBound.isSameOrAfter(otherLowerBound)
  }

  public overlap(otherRange: DateRange): DateRange {
    if(!this.overlaps(otherRange)) throw new NoOverlap(this, otherRange)

    const thisLowerBound = new BoundedDate(this._lowerBound, this.lowerBoundMode)
    const thisUpperBound = new BoundedDate(this._upperBound, this.upperBoundMode)
    const otherLowerBound = new BoundedDate(otherRange._lowerBound, otherRange.lowerBoundMode)
    const otherUpperBound = new BoundedDate(otherRange._upperBound, otherRange.upperBoundMode)

    const overlapLowerBound = BoundedDate.max(thisLowerBound, otherLowerBound)
    const overlapUpperBound = BoundedDate.min(thisUpperBound, otherUpperBound)

    return new DateRange(overlapLowerBound.date, overlapUpperBound.date,
      overlapLowerBound.bound, overlapUpperBound.bound)
  }

  public diff(otherRange: DateRange): DateRange[] {
    if(!this.overlaps(otherRange)) return []
    return []
  }

  private isSameOrBeforeUpperBound(date: WiseDate) {
    let isBeforeUpperBound: boolean
    if (this.upperBoundMode === DateRangeBound.INCLUSIVE) {
      return date.isSameOrBefore(this._upperBound)
    } else {
      return date.isBefore(this._upperBound)
    }
  }

  private isSameOrAfterLowerBound(date: WiseDate) {
    let isAfterLowerBound: boolean
    if (this.lowerBoundMode === DateRangeBound.INCLUSIVE) {
      return date.isSameOrAfter(this._lowerBound)
    } else {
      return date.isAfter(this._lowerBound)
    }
  }
}
