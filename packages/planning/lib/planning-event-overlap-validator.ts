import assert from 'assert'
import moment, { Moment } from 'moment'
import { YYYY_MM_DD } from './constants.js'
import { parseNullableDate } from './util/parse-nullable-date.js'
import { PlanningEvent } from './planning-event.js'
import { xgcd } from './util/xgcd.js'

export class PlanningEventOverlapValidator {
  /**
   * Validate that two events overlap
   * @return true if the events overlap
   */
  public static overlap (event: PlanningEvent, candidate: PlanningEvent): boolean {
    return PlanningEventOverlapValidator.getFirstOverlapDate(event, candidate) != null
  }

  /**
   * Get the first date when the two events overlap
   * @return the first date when the two events overlap, or null if they don't overlap
   */
    public static getFirstOverlapDate (event: PlanningEvent, candidate: PlanningEvent): Moment | null {
      const validator = new PlanningEventOverlapValidator(event, candidate)
  
      if (!validator.areOnTheSameWeekday()) return null
      if (!validator.haveOverlappingTimePeriods()) return null
  
      return validator.getFirstOverlappingDate() ?? null
    }

  private readonly event: PlanningEvent
  private readonly eventStart: Moment
  private readonly eventEnd: Moment | null
  private readonly eventPeriod: number
  private readonly candidate: PlanningEvent
  private readonly candidateStart: Moment
  private readonly candidateEnd: Moment | null
  private readonly candidatePeriod: number

  private constructor (event: PlanningEvent, candidate: PlanningEvent) {
    this.event = event
    this.eventStart = moment(event.startDate, YYYY_MM_DD)
    this.eventEnd = parseNullableDate(event.endDate, YYYY_MM_DD)
    this.eventPeriod = event.weeksPeriod ?? 1

    this.candidate = candidate
    this.candidateStart = moment(candidate.startDate, YYYY_MM_DD)
    this.candidateEnd = parseNullableDate(candidate.endDate, YYYY_MM_DD)
    this.candidatePeriod = candidate.weeksPeriod ?? 1
  }


  private areOnTheSameWeekday (): boolean {
    return this.eventStart.isoWeekday() === this.candidateStart.isoWeekday()
  }

  private haveOverlappingTimePeriods (): boolean {
    return this.candidate.startTime.isBefore(this.event.endTime) &&
      this.candidate.endTime.isAfter(this.event.startTime)
  }

  /**
   * Get the first date when the two events overlap 
   */
  private getFirstOverlappingDate (): Moment | undefined {
    const gen = this.getOverlappingDates()
    const first = gen.next()

    return first.value
  }

  /**
   * Generate dates on which the two events overlap
   */
  private * getOverlappingDates (): Generator<Moment> {
    for (const date of this.generateOverlappingDates()) {
      if (this.event.exceptions.some(exception => date.isSame(exception.exceptionDate))) continue
      if (this.candidate.exceptions.some(exception => date.isSame(exception.exceptionDate))) continue

      yield date
    }
  }

  /**
   * Generate dates on which the two events overlap, not considering exceptions
   */
  private * generateOverlappingDates (): Generator<Moment> {
    const weeksBetween = this.candidateStart.diff(this.eventStart, 'weeks')
    const gen = this.generateOverlappingOffsets(this.eventPeriod, this.candidatePeriod, weeksBetween)

    for (const offset of gen) {
      const date = this.eventStart.clone().add(offset, 'weeks')

      if (this.eventEnd != null && date.isAfter(this.eventEnd) || this.candidateEnd != null && date.isAfter(this.candidateEnd)) {
        return
      }

      yield date
    }
  }

  /**
   * Generate the overlapping offsets of both events, relative to event
   * @param eventPeriod the period of the earliest event
   * @param candidateEventPeriod the period of the later event
   * @param weekOffset offset between the two events start date (positive if candidate event starts after event, negative if candidate starts before event)
   * @see {@link https://math.stackexchange.com/questions/1656120/formula-to-find-the-first-intersection-of-two-arithmetic-progressions explanation}
   */
  private * generateOverlappingOffsets (
    eventWeekPeriod: number,
    candidateWeekPeriod: number,
    weekOffset: number
  ): Generator<number> {
    // Represent both events as integer sequences:
    // 𝐴𝑛 = 𝐴1+(𝑛−1)𝑑  (with 𝑛 ∈ ℕ ) For the earliest event
    // 𝐵𝑚 = 𝐵1+(𝑚−1)𝐷  (with 𝑚 ∈ ℕ ) For the later event
    const A1 = 0
    const B1 = weekOffset
    const d = eventWeekPeriod
    const D = candidateWeekPeriod

    // 𝐴𝑛 = 𝐵𝑚 <=> −𝑑𝑛 + 𝐷𝑚 = 𝐴1 − 𝐵1 + 𝐷 − 𝑑
    // Interpretation as Linear Diophantine Equation
    // 𝑎𝑋 + 𝑏𝑌 = 𝑐  (𝑋, 𝑌 ∈ ℤ) where (𝑛,𝑚) = (𝑋,𝑌)
    const c = A1 - B1 + D - d

    // General solution: (𝑋,𝑌) = (𝑋ℎ + 𝑋𝑝,𝑌ℎ + 𝑌𝑝) = (𝑐𝑢/𝑔 + 𝑡𝐷/𝑔 , 𝑐𝑣/𝑔 + 𝑡𝑑/𝑔)
    // With [𝑔, 𝑢 , 𝑣] = extended gcd(-𝑑,𝐷)  (from: −𝑑𝑢 + 𝐷𝑣 = gcd(-𝑑,𝐷))
    const [g, u, v] = xgcd(-d, D)
    const lcm = d * D / g

    // And with 𝑡 = max{⌊−𝑐𝑢/𝐷⌋ + 1, ⌊−𝑐𝑣/𝑑⌋ + 1} (solved for the first positive solution for (𝑋,𝑌))
    const t = Math.max(Math.floor(-c * u / D) + 1, Math.floor(-c * v / d) + 1)

    // Then 𝑋 = 𝑐𝑢/𝑔 + 𝑡𝐷/𝑔
    const X = (c * u / g) + (t * D / g)

    // Then 𝑌 = 𝑐𝑣/𝑔 + 𝑡𝑑/𝑔
    const Y = (c * v / g) + (t * d / g)

    // If (𝑋,𝑌) is not an integer solution, there is no integer solution
    if (X % 1 !== 0 || Y % 1 !== 0) return

    // Now with (𝑛,𝑚) = (𝑋,𝑌), fill into integer sequence formulae
    const firstSolution = A1 + (X - 1) * d
    const secondSolution = B1 + (Y - 1) * D

    assert(firstSolution === secondSolution)
    
    let offset = firstSolution
    while (true) {
      yield offset
      offset += lcm
    }
  }
}
