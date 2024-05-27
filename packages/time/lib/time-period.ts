import {Inclusivity} from "./inclusivity.js";
import {Time} from "./time.js";
import {InvalidBounds, TimeError} from "./time-error.js";

export class TimePeriod {
  private inclusivity: Inclusivity
  private lowerBound: Time
  private upperBound: Time

  /**
   * Construct a time period between to time points
   * @param from must be before or equal to until
   * @param until must be after or equal to from
   * @param inclusivity used to specify inclusive or exclusive boundaries, defaults to
   *                    inclusive for both boundaries
   */
  constructor(from: Time, until: Time, inclusivity: Inclusivity = '[]') {
    if(from.isAfter(until)) {
      throw new InvalidBounds(from,until)
    }

    this.lowerBound = from
    this.upperBound = until
    this.inclusivity = inclusivity
  }

  /**
   * Get the hours between the lower bound and upper bound of this time period.
   * Ignores inclusivity of the time period
   */
  get hours(): number {
    return Time.hoursBetween(this.lowerBound, this.upperBound)
  }

  /**
   * Get the total minutes between the lower bound and upper bound of this time period.
   * Ignores inclusivity of the time period
   */
  get minutes(): number {
    return Time.minutesBetween(this.lowerBound, this.upperBound)
  }

  /**
   * Get the total seconds between the lower bound and upper bound of this time period.
   * Ignores inclusivity of the time period
   */
  get seconds(): number {
    return Time.secondsBetween(this.lowerBound, this.upperBound)
  }

  /**
   * Check whether the given time lies within this time period
   */
  covers(time: Time): boolean {
    switch (this.inclusivity) {
    case "[]": return this.lowerBound.isBeforeOrEqual(time) && time.isBeforeOrEqual(this.upperBound)
    case "[)": return this.lowerBound.isBeforeOrEqual(time) && time.isBefore(this.upperBound)
    case "(]": return this.lowerBound.isBefore(time) && time.isBeforeOrEqual(this.upperBound)
    case "()": return this.lowerBound.isBefore(time) && time.isBefore(this.upperBound)
    default: return this.inclusivity
    }
  }

  overlapsWith(period: TimePeriod) {
    return this.covers(period.lowerBound) || this.covers(period.upperBound)
  }

}
