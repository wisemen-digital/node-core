import assert from 'assert'
import moment, { Moment } from 'moment'
import { YYYY_MM_DD } from './constants.js'
import { parseNullableDate } from './util/parse-nullable-date.js'
import { PlanningEvent } from './planning-event.js'
import {PlanningException} from "./planning-exceptions.js";
import { gcd, lcm } from './util/lcm.js'
import { xgcd } from './util/xgcd.js'

export class PlanningEventOverlapValidator {
  /**
   * Validate that two events overlap
   * @return true if the events overlap
   */
  public static overlap (event: PlanningEvent, overlapCandidate: PlanningEvent): boolean {
    const validator = new PlanningEventOverlapValidator(event, overlapCandidate)

    if (!validator.areOnTheSameWeekday()) return false
    if (!validator.haveOverlappingDates()) return false
    if (!validator.haveOverlappingTimePeriods(event, overlapCandidate)) return false

    if (!overlapCandidate.isRecurring && !event.isRecurring) {
      return true // The preceding checks validate that the events overlap
    } else if (!overlapCandidate.isRecurring && event.isRecurring) {
      return validator.doesEventOverlapWithRecurringEvent(overlapCandidate, event)
    } else if (overlapCandidate.isRecurring && !event.isRecurring) {
      return validator.doesEventOverlapWithRecurringEvent(event, overlapCandidate)
    } else /* Both are recurring */ {
      return validator.doRecurringEventsOverlap(event, overlapCandidate)
    }
  }

  private readonly eventStart: Moment
  private readonly eventEnd: Moment | null
  private readonly eventPeriod: number
  private readonly candidateStart: Moment
  private readonly candidateEnd: Moment | null
  private readonly candidatePeriod: number

  private constructor (event: PlanningEvent, overlapCandidate: PlanningEvent) {
    this.eventStart = moment(event.startDate, YYYY_MM_DD)
    this.eventEnd = parseNullableDate(event.endDate, YYYY_MM_DD)
    this.eventPeriod = event.weeksPeriod ?? 0

    this.candidateStart = moment(overlapCandidate.startDate, YYYY_MM_DD)
    this.candidateEnd = parseNullableDate(overlapCandidate.endDate, YYYY_MM_DD)
    this.candidatePeriod = overlapCandidate.weeksPeriod ?? 0
  }


  private areOnTheSameWeekday (): boolean {
    return this.eventStart.isoWeekday() === this.candidateStart.isoWeekday()
  }

  private haveOverlappingDates (): boolean {
    const haveOverlappingPeriods =
      (this.eventEnd === null || (this.candidateStart.isSameOrBefore(this.eventEnd))) &&
      (this.candidateEnd === null || (this.candidateEnd.isSameOrAfter(this.eventStart)))
    if (!haveOverlappingPeriods) return false

    const weeksBetweenStarts = Math.abs(this.eventStart.diff(this.candidateStart, 'weeks'))
    const samePeriods = this.eventPeriod === 0 && this.candidatePeriod === 0
    const periodsOverlap = weeksBetweenStarts % gcd(this.eventPeriod, this.candidatePeriod) === 0
    return samePeriods || periodsOverlap
  }

  private haveOverlappingTimePeriods (
    event: PlanningEvent,
    overlapCandidate: PlanningEvent
  ): boolean {
    return overlapCandidate.startTime.isBefore(event.endTime) &&
      overlapCandidate.endTime.isAfter(event.startTime)
  }

  /**
   * Verify that the recurring event does not have an exception
   * for the date of the event (i.e. they overlap).
   * @param event a non recurring event
   * @param recurringEvent the recurring event
   * @pre the events overlap when not considering exceptions
   */
  private doesEventOverlapWithRecurringEvent (
    event: PlanningEvent,
    recurringEvent: PlanningEvent
  ): boolean {
    const exceptions = recurringEvent.exceptions as PlanningException[]
    const exceptionExistsOnEventDate = exceptions
      .some(exception => exception.exceptionDate === event.startDate)
    return !exceptionExistsOnEventDate
  }

  /**
   * Check if two recurring events overlap
   * @param event a recurring event
   * @param overlapCandidate a recurring event
   * @pre the events overlap when not considering exceptions
   */
  private doRecurringEventsOverlap (
    event: PlanningEvent,
    overlapCandidate: PlanningEvent
  ): boolean {
    const eventRecursInfinitely = event.endDate === null
    const candidateRecursInfinitely = overlapCandidate.endDate === null
    if (eventRecursInfinitely && candidateRecursInfinitely) {
      // Infinitely recurring events overlap at infinity
      // No need to verify that there are exceptions
      return true
    }
    return this.doFiniteRecurringEventsOverlap(event, overlapCandidate)
  }

  /**
   * Check if recurring events with end dates overlap
   * @param event a finite recurring event
   * @param overlapCandidate a finite recurring event
   * @pre the events overlap when not considering exceptions
   */
  private doFiniteRecurringEventsOverlap (
    event: PlanningEvent,
    overlapCandidate: PlanningEvent
  ): boolean {
    // If overlap dates exist, the events overlap
    const overlappingDates = this.getOverlappingDates(event, overlapCandidate)
    return overlappingDates.length !== 0
  }

  /**
   * Generate a list of dates that need to be validated
   * @param event
   * @param overlapCandidate
   * @pre the events overlap when not considering exceptions
   */
  private getOverlappingDates (
    event: PlanningEvent,
    overlapCandidate: PlanningEvent
  ): string[] {
    const datesToValidate = this.generateOverlappingDates(event, overlapCandidate)

    // Filter out dates for which exceptions exist
    const eventExceptions = event.exceptions as PlanningException[]
    const overlapCandidateExceptions = overlapCandidate.exceptions as PlanningException[]

    return datesToValidate.filter(date => {
      if (eventExceptions.some(exception => exception.exceptionDate === date)) return false
      return !overlapCandidateExceptions.some(exception => exception.exceptionDate === date)
    })
  }

  /**
   * Generate the dates that overlap between two recurring events, without
   * considering exceptions
   * @param event a finite recurring event
   * @param overlapCandidate a finite recurring event
   * @pre the events overlap when not considering exceptions
   * @return a list of overlapping dates, formatted as YYYY-MM-DD
   */
  private generateOverlappingDates (
    event: PlanningEvent,
    overlapCandidate: PlanningEvent
  ): string[] {
    const eventPeriod = event.weeksPeriod as number
    const candidatePeriod = overlapCandidate.weeksPeriod as number
    const overlapPeriod = lcm(eventPeriod, candidatePeriod)

    const validationStartDate = this.getFirstOverlappingDate()
    const validationEndDate = this.minEndDate(this.eventEnd, this.candidateEnd).clone()

    const datesToValidate: string[] = []
    while (validationStartDate.isSameOrBefore(validationEndDate)) {
      datesToValidate.push(validationStartDate.clone().format(YYYY_MM_DD))
      validationStartDate.add(overlapPeriod, 'weeks')
    }
    return datesToValidate
  }

  /**
   * Get the first overlapping date between the event and candidate event
   */
  private getFirstOverlappingDate (): Moment {
    const earliestDate = moment.min(this.eventStart, this.candidateStart)
    const earliestPeriod = this.getEarliestPeriod()

    const latestDate = moment.max(this.eventStart, this.candidateStart)
    const latestPeriod = this.getLatestPeriod()

    const weeksBetween = latestDate.diff(earliestDate, 'weeks')

    const offset = this.getOffsetToFirstOverlappingDate(weeksBetween, earliestPeriod, latestPeriod)
    return earliestDate.clone().add(offset, 'weeks')
  }

  /**
   * Get the minimum end date of two non-infinite events
   * @pre eventEnd and candidateEnd are not null at the same time
   */
  private minEndDate (
    eventEnd: Moment | null,
    candidateEnd: Moment | null
  ): Moment {
    if (eventEnd === null && candidateEnd === null) {
      throw Error('invalid arguments in private function')
    }
    if (eventEnd === null) return candidateEnd as Moment
    if (candidateEnd === null) return eventEnd
    return moment.min(eventEnd, candidateEnd)
  }

  /**
   * Get the offset between the  start date of the earliest event and
   * the first overlap between both events.
   * @param weeksBetweenStarts weeks between the two events
   * @param earliestEventPeriod the period of the earliest event
   * @param latestEventPeriod the period of the later event
   * @see {@link https://math.stackexchange.com/questions/1656120/formula-to-find-the-first-intersection-of-two-arithmetic-progressions explanation}
   */
  public getOffsetToFirstOverlappingDate (
    weeksBetweenStarts: number,
    earliestEventPeriod: number,
    latestEventPeriod: number
  ): number {
    // Represent both events as integer sequences:
    // 𝐴𝑛 = 𝐴1+(𝑛−1)𝑑  (with 𝑛 ∈ ℕ ) For the earliest event
    // 𝐵𝑚 = 𝐵1+(𝑚−1)𝐷  (with 𝑚 ∈ ℕ ) For the later event
    const A1 = 0
    const B1 = weeksBetweenStarts
    const d = earliestEventPeriod
    const D = latestEventPeriod

    // 𝐴𝑛 = 𝐵𝑚 <=> −𝑑𝑛 + 𝐷𝑚 = 𝐴1 − 𝐵1 + 𝐷 − 𝑑
    // Interpretation as Linear Diophantine Equation
    // 𝑎𝑋 + 𝑏𝑌 = 𝑐  (𝑋, 𝑌 ∈ ℤ) where (𝑛,𝑚) = (𝑋,𝑌)
    const c = A1 - B1 + D - d

    // General solution: (𝑋,𝑌) = (𝑋ℎ + 𝑋𝑝,𝑌ℎ + 𝑌𝑝) = (𝑐𝑢/𝑔 + 𝑡𝐷/𝑔 , 𝑐𝑣/𝑔 + 𝑡𝑑/𝑔)
    // With [𝑔, 𝑢 , 𝑣] = extended gcd(-𝑑,𝐷)  (from: −𝑑𝑢 + 𝐷𝑣 = gcd(-𝑑,𝐷))
    const { g, u, v } = this.extendedGcd(-d, D)

    // And with 𝑡 = max{⌊−𝑐𝑢/𝐷⌋ + 1, ⌊−𝑐𝑣/𝑑⌋ + 1} (solved for the first positive solution for (𝑋,𝑌))
    const t = Math.max(Math.floor(-c * u / D) + 1, Math.floor(-c * v / d) + 1)

    // Then 𝑋 = 𝑐𝑢/𝑔 + 𝑡𝐷/𝑔
    const X = (c * u / g) + (t * D / g)

    // Then 𝑌 = 𝑐𝑣/𝑔 + 𝑡𝑑/𝑔
    const Y = (c * v / g) + (t * d / g)

    // Now with (𝑛,𝑚) = (𝑋,𝑌), fill into integer sequence formulae
    const firstSolution = A1 + (X - 1) * d
    const secondSolution = B1 + (Y - 1) * D

    assert(firstSolution === secondSolution)
    return Math.floor(firstSolution)
  }

  /**
   * Get the extended gcd. This method is a wrapper around xgcd which parses
   * the output to the expected results.
   */
  private extendedGcd (d: number, D: number): { g: number, u: number, v: number } {
    const [g, u, v] = xgcd(d, D)

    return { g, u, v }
  }

  private getEarliestPeriod (): number {
    if (this.eventStart.isBefore(this.candidateStart)) return this.eventPeriod
    return this.candidatePeriod
  }

  private getLatestPeriod (): number {
    if (this.eventStart.isSameOrAfter(this.candidateStart)) return this.eventPeriod
    return this.candidatePeriod
  }
}
