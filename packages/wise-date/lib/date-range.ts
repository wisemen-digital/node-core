import {WiseDate} from "./wise-date.js";
import {InvalidBounds, NoOverlap} from "./date-range-errors.js";
import {Inclusivity, intersect, isInclusive} from "./inclusivity.js";
import {DateRangeBoundary} from "./date-range-boundary.js";

export class DateRange {
  public readonly startDate: DateRangeBoundary
  public readonly endDate: DateRangeBoundary

  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
  )
  constructor(
    startDate: DateRangeBoundary,
    endDate: DateRangeBoundary,
  )
  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
    inclusivity: Inclusivity
  )
  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
    lowerBoundInclusivity: Inclusivity,
    upperBoundInclusivity: Inclusivity
  )
  constructor(
    startDate: WiseDate | DateRangeBoundary,
    endDate: WiseDate | DateRangeBoundary,
    lowerBoundOrBoundsInclusivity: Inclusivity = Inclusivity.INCLUSIVE,
    upperBoundInclusivity?: Inclusivity
  ) {
    if(startDate instanceof DateRangeBoundary && endDate instanceof DateRangeBoundary) {
      this.startDate = startDate
      this.endDate = endDate
    } else if(upperBoundInclusivity === undefined) {
      this.startDate = new DateRangeBoundary(startDate as WiseDate, lowerBoundOrBoundsInclusivity)
      this.endDate = new DateRangeBoundary(endDate as WiseDate, lowerBoundOrBoundsInclusivity)
    } else {
      this.startDate = new DateRangeBoundary(startDate as WiseDate, lowerBoundOrBoundsInclusivity)
      this.endDate = new DateRangeBoundary(endDate as WiseDate, upperBoundInclusivity)
    }

    if(this.endDate.date.isBefore(this.startDate.date)
      && this.startDate.date.isAfter(this.endDate.date)) {
      throw new InvalidBounds(this)
    }
  }


  public get years(): number {
    const endDate = this.getEffectiveEndDate()
    const startDate = this.getEffectiveStartDate()
    return Math.max(0, endDate.diff(startDate, 'years'))
  }

  public get months(): number {
    const endDate = this.getEffectiveEndDate()
    const startDate = this.getEffectiveStartDate()
    return Math.max(0, endDate.diff(startDate, 'months'))
  }

  public get quarters(): number {
    const endDate = this.getEffectiveEndDate()
    const startDate = this.getEffectiveStartDate()
    return Math.max(0, endDate.diff(startDate, 'quarters'))
  }

  public get weeks(): number {
    const endDate = this.getEffectiveEndDate()
    const startDate = this.getEffectiveStartDate()
    return Math.max(0, endDate.diff(startDate, 'weeks'))
  }

  public get days(): number {
    const endDate = this.getEffectiveEndDate()
    const startDate = this.getEffectiveStartDate()
    return Math.max(0, endDate.diff(startDate, 'days'))
  }

  public get isEmpty(): boolean {
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

  private getEffectiveStartDate(): WiseDate {
    return isInclusive(this.startDate.inclusivity)
      ? this.startDate.date
      : this.startDate.date.add(1, 'day');
  }

  private getEffectiveEndDate(): WiseDate {
    return isInclusive(this.endDate.inclusivity)
      ? this.endDate.date.add(1, 'day')
      : this.endDate.date;
  }
}
