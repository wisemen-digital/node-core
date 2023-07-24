import {WiseDate} from "./date";
import {InvalidBounds, NoOverlap} from "./date-range-errors";
import {DateRangeBound} from "./date-range-bound";

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

    if(lowerBound.isBefore(upperBound)) {
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

  public contains(date: WiseDate,): boolean {
    let isAfterLowerBound: boolean
    if(this.lowerBoundMode === DateRangeBound.INCLUSIVE) {
      isAfterLowerBound =  date.isSameOrAfter(this._lowerBound)
    } else {
      isAfterLowerBound = date.isAfter(this._lowerBound)
    }

    let isBeforeUpperBound: boolean
    if(this.upperBoundMode === DateRangeBound.INCLUSIVE) {
      isBeforeUpperBound =  date.isSameOrBefore(this._upperBound)
    } else {
      isBeforeUpperBound =  date.isBefore(this._upperBound)
    }

    return isAfterLowerBound && isBeforeUpperBound
  }

  public overlaps(otherRange: DateRange) {
    let lowerBoundIsBeforeOtherUpperBound: boolean
    if(this.lowerBoundMode === DateRangeBound.INCLUSIVE &&
      otherRange.upperBoundMode === DateRangeBound.INCLUSIVE) {
      lowerBoundIsBeforeOtherUpperBound = this._lowerBound.isSameOrBefore(otherRange._upperBound)
    } else {
      lowerBoundIsBeforeOtherUpperBound = this._lowerBound.isBefore(otherRange._upperBound)
    }

    let upperBoundIsAfterOtherLowerBound: boolean
    if(this.upperBoundMode === DateRangeBound.INCLUSIVE &&
      otherRange.lowerBoundMode === DateRangeBound.INCLUSIVE) {
      upperBoundIsAfterOtherLowerBound = this._upperBound.isSameOrAfter(otherRange._lowerBound)
    } else {
      upperBoundIsAfterOtherLowerBound = this._upperBound.isSame(otherRange._lowerBound)
    }

    return lowerBoundIsBeforeOtherUpperBound && upperBoundIsAfterOtherLowerBound
  }

  public overlap(otherRange: DateRange): DateRange {
    if(!this.overlaps(otherRange)) throw new NoOverlap(this, otherRange)

    let lowerBoundMode: DateRangeBound
    let lowerBound: WiseDate
    if(this._lowerBound.isSame(otherRange._lowerBound)) {
      lowerBoundMode = (this.lowerBoundMode === DateRangeBound.EXCLUSIVE ||
        otherRange.lowerBoundMode === DateRangeBound.EXCLUSIVE)
      ? DateRangeBound.EXCLUSIVE : DateRangeBound.INCLUSIVE
      lowerBound = this._lowerBound.clone()
    } else if(this._lowerBound.isBefore(otherRange._lowerBound)) {
      lowerBoundMode = otherRange.lowerBoundMode
      lowerBound = otherRange._lowerBound.clone()
    } else {
      lowerBoundMode = this.lowerBoundMode
      lowerBound = this._lowerBound.clone()
    }


    let upperBoundMode: DateRangeBound
    let upperBound: WiseDate
    if(this._upperBound.isSame(otherRange._upperBound)) {
      upperBoundMode = (this.upperBoundMode === DateRangeBound.EXCLUSIVE ||
        otherRange.upperBoundMode === DateRangeBound.EXCLUSIVE)
        ? DateRangeBound.EXCLUSIVE : DateRangeBound.INCLUSIVE
      upperBound = this._lowerBound.clone()
    } else if(this._upperBound.isBefore(otherRange._upperBound)) {
      upperBoundMode = this.upperBoundMode
      upperBound = this._upperBound.clone()
    } else {
      upperBoundMode = otherRange.upperBoundMode
      upperBound = otherRange._upperBound.clone()
    }

    return new DateRange(lowerBound, upperBound, lowerBoundMode, upperBoundMode)
  }
}
