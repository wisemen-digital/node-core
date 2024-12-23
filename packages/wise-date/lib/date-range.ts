import {WiseDate} from "./wise-date.js";
import {InvalidBounds, NoOverlap} from "./date-range-errors.js";
import {Inclusivity, intersect, isInclusive} from "./inclusivity.js";
import {DateRangeBoundary} from "./date-range-boundary.js";

export class DateRange {
  public readonly startDate: DateRangeBoundary
  public readonly endDate: DateRangeBoundary

  private readonly _lowerBound: WiseDate
  private readonly _upperBound: WiseDate
  private readonly lowerBoundMode: Inclusivity
  private readonly upperBoundMode: Inclusivity

  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
  )
  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
    boundMode: Inclusivity
  )
  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
    lowerBoundMode: Inclusivity,
    upperBoundMode: Inclusivity
  )
  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
    lowerBoundOrBoundsMode: Inclusivity = Inclusivity.INCLUSIVE,
    upperBoundMode?: Inclusivity
  ) {
    if(upperBoundMode === undefined) {
      this.startDate = new DateRangeBoundary(startDate, lowerBoundOrBoundsMode)
      this.endDate = new DateRangeBoundary(endDate, lowerBoundOrBoundsMode)

      this.lowerBoundMode = lowerBoundOrBoundsMode
      this.upperBoundMode = lowerBoundOrBoundsMode
    } else {
      this.startDate = new DateRangeBoundary(startDate, lowerBoundOrBoundsMode)
      this.endDate = new DateRangeBoundary(endDate, upperBoundMode)

      this.lowerBoundMode = lowerBoundOrBoundsMode
      this.upperBoundMode = upperBoundMode
    }

    this._upperBound = endDate
    this._lowerBound = startDate

    if(endDate.isBefore(startDate)) {
      throw new InvalidBounds(this)
    }
  }


  public get years(): number {
    return  this.endDate.date.diff(this.startDate.date, 'years')
  }

  public get months(): number {
    return  this.endDate.date.diff(this.startDate.date, 'months')
  }

  public get quarters(): number {
    return  this.endDate.date.diff(this.startDate.date, 'quarters')
  }

  public get weeks(): number {
    return  this.endDate.date.diff(this.startDate.date, 'weeks')
  }

  public get days(): number {
    return  this.endDate.date.diff(this.startDate.date, 'days')
  }

  public isEmpty(): boolean {
    return this.days === 0
  }

  public contains(date: WiseDate): boolean {
    return this.isSameOrAfterStartDate(date) && this.isSameOrBeforeEndDate(date)
  }

  public overlaps(withRange: DateRange): boolean {
    return this.startDate.isSameOrBefore(withRange.endDate) &&
      this.endDate.isSameOrAfter(withRange.startDate)
  }

  public overlap(otherRange: DateRange): DateRange {
    if(!this.overlaps(otherRange)) throw new NoOverlap(this, otherRange)

    const overlapLowerBound = DateRangeBoundary.max(this.startDate, otherRange.startDate)
    const overlapUpperBound = DateRangeBoundary.min(this.endDate, otherRange.endDate)

    return new DateRange(overlapLowerBound.date, overlapUpperBound.date,
      overlapLowerBound.inclusivity, overlapUpperBound.inclusivity)
  }

  public diff(otherRange: DateRange): DateRange[] {
    if(!this.overlaps(otherRange)) return []
    return []
  }

  private isSameOrBeforeEndDate(date: WiseDate) {
    return this.endDate.isSameOrAfterDate(date)
  }

  private isSameOrAfterStartDate(date: WiseDate) {
    return this.startDate.isSameOrBeforeDate(date)
  }
}
