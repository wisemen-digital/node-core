import {WiseDate} from "./wise-date.js";
import {Inclusivity, intersect, isInclusive} from "./inclusivity.js";

export class DateRangeBoundary {
  public static max(firstDate: DateRangeBoundary, secondDate: DateRangeBoundary): DateRangeBoundary {
    if(firstDate.date.isSame(secondDate.date)) {
      const isAnyDateIsInclusive =
        firstDate.inclusivity === Inclusivity.INCLUSIVE
        || secondDate.inclusivity === Inclusivity.INCLUSIVE
      const inclusivity = isAnyDateIsInclusive? Inclusivity.INCLUSIVE : Inclusivity.EXCLUSIVE;
      return new DateRangeBoundary(firstDate.date, inclusivity)
    } else if(firstDate.date.isAfter(secondDate.date)) {
      return new DateRangeBoundary(firstDate.date, firstDate.inclusivity)
    } else {
      return new DateRangeBoundary(secondDate.date, secondDate.inclusivity)
    }
  }

  public static min(firstDate: DateRangeBoundary, secondDate: DateRangeBoundary): DateRangeBoundary {
    if(firstDate.date.isSame(secondDate.date)) {
      const isAnyDateExclusive =
        firstDate.inclusivity === Inclusivity.INCLUSIVE
        || secondDate.inclusivity === Inclusivity.INCLUSIVE
      const inclusivity = isAnyDateExclusive? Inclusivity.EXCLUSIVE : Inclusivity.INCLUSIVE;
      return new DateRangeBoundary(firstDate.date, inclusivity)
    } else if(firstDate.date.isBefore(secondDate.date)) {
      return new DateRangeBoundary(firstDate.date, firstDate.inclusivity)
    } else {
      return new DateRangeBoundary(secondDate.date, secondDate.inclusivity)
    }
  }

  constructor(
    public readonly date: WiseDate,
    public readonly inclusivity: Inclusivity
  ) {
    this.date = date
    this.inclusivity = date.isInfinity() ? Inclusivity.EXCLUSIVE : inclusivity
  }


  public isSameOrBefore(otherBoundedDate: DateRangeBoundary): boolean {
    if(isInclusive(this.inclusivity) && isInclusive(otherBoundedDate.inclusivity)) {
      return this.date.isSameOrBefore(otherBoundedDate.date)
    } else {
      return this.date.isBefore(otherBoundedDate.date)
    }
  }

  public isSameOrBeforeDate(date: WiseDate): boolean {
    if (isInclusive(this.inclusivity)) {
      return this.date.isSameOrBefore(date)
    } else {
      return this.date.isBefore(date) ||
        (this.date.isFutureInfinity() && date.isFutureInfinity())
    }
  }


  public isSameOrAfter(otherBoundedDate: DateRangeBoundary): boolean {
    if(isInclusive(this.inclusivity)&& isInclusive(otherBoundedDate.inclusivity)) {
      return this.date.isSameOrAfter(otherBoundedDate.date)
    } else {
      return this.date.isAfter(otherBoundedDate.date)
    }
  }

  public isSameOrAfterDate(date: WiseDate): boolean {
    if (isInclusive(this.inclusivity)) {
      return this.date.isSameOrAfter(date)
    } else {
      return this.date.isAfter(date)  ||
        (this.date.isPastInfinity() && date.isPastInfinity())
    }
  }
}
