import {WiseDate} from "./wise-date.js";
import {InvalidBounds, NoOverlap} from "./date-range-errors.js";
import {
  Inclusivity,
  InclusivityString,
  isInclusive,
  mapToInclusivity
} from "./inclusivity.js";

/**
 * DateRange only works with inclusive ranges internally, except for infinities
 * When an exclusive date is given, this date is mapped to the next or previous inclusive date
 * for the upper and lower bound respectively
 *
 * As a result, empty ranges cannot be represented.
 */
export class DateRange {
  public readonly startDate: WiseDate
  public readonly endDate: WiseDate

  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
  )
  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
    inclusivity: Inclusivity
  )
  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
    inclusivitiy: InclusivityString
  )
  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
    lowerBoundInclusivity: Inclusivity,
    upperBoundInclusivity: Inclusivity
  )
  constructor(
    startDate: WiseDate,
    endDate: WiseDate,
    lowerBoundOrBoundsInclusivity: Inclusivity | InclusivityString = Inclusivity.INCLUSIVE,
    upperBoundInclusivity?: Inclusivity
  ) {
    if (typeof lowerBoundOrBoundsInclusivity === 'string') {
      const [lower, upper] = mapToInclusivity(lowerBoundOrBoundsInclusivity)
      lowerBoundOrBoundsInclusivity = lower
      upperBoundInclusivity = upper
    } else if (upperBoundInclusivity === undefined) {
      upperBoundInclusivity = lowerBoundOrBoundsInclusivity
    }

    if (!isInclusive(lowerBoundOrBoundsInclusivity)) {
      startDate = startDate.add(1, 'day')
    }

    if (!isInclusive(upperBoundInclusivity)) {
      endDate = endDate.subtract(1, 'day')
    }

    if (endDate.isBefore(startDate) && startDate.isAfter(endDate)) {
      throw new InvalidBounds(this)
    }

    this.startDate = startDate
    this.endDate = endDate
  }

  public get years(): number {
    return this.endDate.diff(this.startDate, 'years')
  }

  public get months(): number {
    return this.endDate.diff(this.startDate, 'months')
  }

  public get quarters(): number {
    return this.endDate.diff(this.startDate, 'quarters')
  }

  public get weeks(): number {
    return this.endDate.diff(this.startDate, 'weeks')
  }

  public get days(): number {
    return this.endDate.diff(this.startDate, 'days')
  }

  public contains(date: WiseDate): boolean {
    return date.isSameOrAfter(this.startDate) && date.isSameOrBefore(this.endDate)
  }

  public overlaps(withRange: DateRange): boolean {
    return this.startDate.isSameOrBefore(withRange.endDate) &&
      this.endDate.isSameOrAfter(withRange.startDate)
  }

  public overlap(withRange: DateRange): DateRange {
    if (!this.overlaps(withRange)) throw new NoOverlap(this, withRange)

    const {startDate: startA, endDate: endA} = this
    const {startDate: startB, endDate: endB} = withRange

    return new DateRange(
      WiseDate.max(startA, startB),
      WiseDate.min(endA, endB)
    )
  }

  public diff(withRange: DateRange): DateRange[] {
    if (!this.overlaps(withRange)) {
      return [this]
    }

    const overlap = this.overlap(withRange)
    const difference: DateRange[] = []
    if (overlap.startDate.isAfter(this.startDate)) {
      difference.push(new DateRange(this.startDate, overlap.startDate.subtract(1,'day')))
    }

    if (overlap.endDate.isBefore(this.endDate)) {
      difference.push(new DateRange(overlap.endDate.add(1,'day'), this.endDate))
    }

    return difference
  }

  public isSame(otherRange: DateRange): boolean {
    return this.startDate.isSame(otherRange.startDate)
      && this.endDate.isSame(otherRange.endDate)
  }

  public toString(): string {
    const startInclusivity = this.startDate.isInfinity() ? `(` : '['
    const endInclusivity = this.startDate.isInfinity() ? `)` : ']'
    return startInclusivity + this.startDate.toString() + ', ' + this.endDate.toString() + endInclusivity
  }
}
