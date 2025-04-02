import type { Moment } from 'moment'
import moment from 'moment'
import { PlanningEvent } from './planning-event.js'
import {DAYS_PER_WEEK, Time} from '@wisemen/time'
import {YYYY_MM_DD} from "./constants.js";
import {parseNullableDate} from "./util/parse-nullable-date.js";
import {doDatePeriodsOverlap} from "./util/do-periods-overlap.js";
import {PlanningEventOverlapValidator} from "./planning-event-overlap-validator.js";
import {Timeslot} from "./util/timeslot.js";
import { lcm } from './util/lcm.js';

interface SplitResult {
  head: PlanningEvent | null
  overlap: PlanningEvent
  tail: PlanningEvent | null
}

/**
 * The open event splitter is responsible for splitting an open event based
 * on another overlapping event. The result of the split is an array of open events
 * from which the overlap has been cut out.
 * If the events do not overlap, the original event is returned
 * This class disregards planning exceptions on events at the moment
 *
 * @example
 * Open events are split
 *  1. Date splitting: by date range
 *      [ |  | ]  =>  [head][overlap][tail]
 *  2. Periodically: only overlapping periods are considered
 *     Open event          X  X  X  X  X  X
 *     Overlapping event   Y     Y     Y
 *     Split open events   A  B  A  B  A  B
 *  3. Time splitting: Timeslots are intersected to split the event
 *      [ |  | ]  =>  [head][overlap][tail]
 */
export class PlanningEventSplitter {
  private readonly openEventStartDate: Moment
  private readonly openEventEndDate: Moment | null
  private readonly daysInOpenEventPeriod: number
  private readonly overlappingEventStartDate: Moment
  private readonly overlappingEventEndDate: Moment | null
  private readonly daysInOverlappingEventPeriod: number

  private constructor (openEvent: PlanningEvent, overlappingEvent: PlanningEvent) {
    this.openEventStartDate = moment(openEvent.startDate, YYYY_MM_DD)
    this.openEventEndDate = parseNullableDate(openEvent.endDate, YYYY_MM_DD)
    this.daysInOpenEventPeriod = (openEvent.weeksPeriod ?? 0) * DAYS_PER_WEEK

    this.overlappingEventStartDate = moment(overlappingEvent.startDate, YYYY_MM_DD)
    this.overlappingEventEndDate =
      parseNullableDate(overlappingEvent.endDate, YYYY_MM_DD)
    this.daysInOverlappingEventPeriod = (overlappingEvent.weeksPeriod ?? 0) * DAYS_PER_WEEK
  }

  /**
   * Split an open event into smaller open events based on an overlapping event
   * If the events do not overlap, the original event is returned.
   * @param openEvent the open event to split, is not changed in this call
   * @param overlappingEvent the event to split with, must overlap with openEvent
   */
  public static split (openEvent: PlanningEvent, overlappingEvent: PlanningEvent): PlanningEvent[] {
    if (!PlanningEventOverlapValidator.overlap(openEvent, overlappingEvent)) {
      return [openEvent]
    }

    const splitter = new PlanningEventSplitter(openEvent, overlappingEvent)

    let timeSplitTarget = openEvent
    const newOpenEvents: Array<PlanningEvent | null> = []
    if (openEvent.isRecurring) {
      const { head, overlap, tail } = splitter.splitByDate(openEvent, overlappingEvent)
      newOpenEvents.push(head, tail)
      timeSplitTarget = overlap

      if (overlappingEvent.isRecurring) {
        const [splitOverlapEvent, nonOverlappingEvents] =
          splitter.splitByPeriod(overlap, overlappingEvent)

        newOpenEvents.push(...nonOverlappingEvents)
        timeSplitTarget = splitOverlapEvent
      }
    }

    const { head, overlap: _, tail } = splitter.splitByTime(timeSplitTarget, overlappingEvent)
    newOpenEvents.push(head, tail)
    return newOpenEvents.filter(event => event !== null) as PlanningEvent[]
  }

  private splitByDate (
    openEvent: PlanningEvent,
    overlappingEvent: PlanningEvent
  ): SplitResult {
    // Cut the head which is the period before the overlap
    const head = this.splitDateHead(openEvent)

    // Cut the main part which is the overlap between the
    // event and the start and end date
    const overlap = this.splitDateOverlap(openEvent, overlappingEvent)

    // Cut the tail part which is the remainder after the overlap
    const tail = this.splitDateTail(openEvent, overlap)
    return { head, overlap, tail }
  }

  /**
   * Split an event bases on the period overlaps
   * e.g. an overlap between a 2-weekly and 5-weekly event will
   * split the 2-weekly event into 5 10-weekly events
   */
  private splitByPeriod (
    event: PlanningEvent,
    overlappingEvent: PlanningEvent
  ): [PlanningEvent, PlanningEvent[]] {
    const newPeriod = lcm(
      event.weeksPeriod as number,
      overlappingEvent.weeksPeriod as number
    )
    const splitOverlapEvents = this.splitForPeriod(event, newPeriod)
    return this.findOverlappingSplitEvent(splitOverlapEvents, overlappingEvent)
  }

  /**
   * Split an event based on the times of the event.
   * Dates are completely disregarded.
   * @param openEvent an open event
   * @param overlappingEvent the event which overlaps in time with the open event
   */
  private splitByTime (
    openEvent: PlanningEvent,
    overlappingEvent: PlanningEvent
  ): SplitResult {
    const overlapTimeslot = this.getOverlap(
      { startTime: openEvent.startTime, endTime: openEvent.endTime },
      { startTime: overlappingEvent.startTime, endTime: overlappingEvent.endTime }
    )

    let headTimeslot: Timeslot | null
    if (openEvent.startTime.isSame(overlappingEvent.startTime)) {
      headTimeslot = null
    } else {
      headTimeslot = { startTime: openEvent.startTime, endTime: overlapTimeslot.startTime }
    }

    let tailTimeslot: Timeslot | null
    if (openEvent.endTime.isSame(overlappingEvent.endTime)) {
      tailTimeslot = null
    } else {
      tailTimeslot = { startTime: overlapTimeslot.endTime, endTime: openEvent.endTime }
    }

    return {
      head: (headTimeslot !== null) ? this.createCloneWithTimeslot(openEvent, headTimeslot) : null,
      overlap: this.createCloneWithTimeslot(openEvent, overlapTimeslot),
      tail: (tailTimeslot !== null) ? this.createCloneWithTimeslot(openEvent, tailTimeslot) : null
    }
  }

  /**
   * Split an event into multiple events with the new given period
   * @param event is a recurring event with a period
   * @param newPeriod must a period >= event.weeksPeriod and a multiple of the old period
   * @example
   *  Take an event with a period of 2: [  X  X  X  X ...
   *  Then give the new period of 4:    [  X  Y  X  Y ...
   *  where X and Y both have a period of 4
   */
  private splitForPeriod (event: PlanningEvent, newPeriod: number): PlanningEvent[] {
    const oldPeriod = event.weeksPeriod as number
    const splitAmount = newPeriod / oldPeriod // should be a whole division
    const newStartDate = moment(event.startDate, YYYY_MM_DD)
    const eventEnd = (event.endDate === null) ? null : moment(event.endDate, YYYY_MM_DD)
    const daysInNewPeriod = newPeriod * DAYS_PER_WEEK

    const splitEvents: PlanningEvent[] = []
    while (
      (newStartDate.isSameOrBefore(event.endDate) || event.endDate === null) &&
      splitEvents.length < splitAmount
    ) {
      const newEndDate = this.calculateEndDate(eventEnd, newStartDate, daysInNewPeriod)
      const newEvent = this.createEventWithNewPeriod(
        newPeriod,
        newStartDate,
        newEndDate,
        event
      )

      splitEvents.push(newEvent)
      newStartDate.add(oldPeriod, 'weeks')
    }

    return splitEvents
  }

  /**
   * Find which events of a given list overlap with a given event.
   * The overlap is limited to overlap where the start date
   * is a reachable date from the overlapping event
   * @param splitOverlapEvents the list of events to search in
   * @param overlappingEvent the overlapping event
   * @return a tuple [overlapping, non-overlapping]
   */
  private findOverlappingSplitEvent (
    splitOverlapEvents: PlanningEvent[],
    overlappingEvent: PlanningEvent
  ): [PlanningEvent, PlanningEvent[]] {
    const nonOverlapping: PlanningEvent[] = []
    let overlapping: PlanningEvent | null = null

    const overlapStart = moment(overlappingEvent.startDate, YYYY_MM_DD)
    const overlapPeriod = overlappingEvent.weeksPeriod as number

    splitOverlapEvents.forEach(event => {
      const eventStart = moment(event.startDate, YYYY_MM_DD)
      const daysBetween = overlapStart.diff(eventStart, 'days')
      if (daysBetween % (overlapPeriod * DAYS_PER_WEEK) === 0) {
        if (overlapping !== null) throw new Error('Only one overlap expected')
        overlapping = event
      } else {
        nonOverlapping.push(event)
      }
    })

    if (overlapping === null) throw new Error('Expected at least one overlap')

    return [overlapping, nonOverlapping]
  }

  private splitDateHead (openEvent: PlanningEvent): PlanningEvent | null {
    if (this.openEventStartDate.isSameOrAfter(this.overlappingEventStartDate)) return null

    const daysBetweenStarts = this.overlappingEventStartDate
      .diff(this.openEventStartDate, 'days', true)

    let periodsUntilEndCandidate: number
    if (daysBetweenStarts % this.daysInOpenEventPeriod === 0) {
      periodsUntilEndCandidate = Math.floor(daysBetweenStarts / this.daysInOpenEventPeriod) - 1
    } else {
      periodsUntilEndCandidate = Math.floor(daysBetweenStarts / this.daysInOpenEventPeriod)
    }

    const endCandidate = this.openEventStartDate.clone()
      .add(periodsUntilEndCandidate * this.daysInOpenEventPeriod, 'days')

    let headEndDate: Moment = endCandidate
    if (this.openEventEndDate !== null) {
      headEndDate = moment.min(this.openEventEndDate, endCandidate)
    }

    const head = this.cloneEvent(openEvent)
    head.endDate = headEndDate.format(YYYY_MM_DD)
    return head
  }

  private splitDateOverlap (
    openEvent: PlanningEvent,
    overlappingEvent: PlanningEvent
  ): PlanningEvent {
    const periodsOverlap = doDatePeriodsOverlap(
      { start: this.openEventStartDate, end: this.openEventEndDate },
      { start: this.overlappingEventStartDate, end: this.overlappingEventEndDate }
    )
    if (!periodsOverlap) throw new Error('Events must overlap')

    const overlap = this.cloneEvent(openEvent)
    overlap.isRecurring = overlappingEvent.isRecurring
    overlap.weeksPeriod = (overlap.isRecurring) ? openEvent.weeksPeriod : null

    // Set the start date of the overlap
    if (this.openEventStartDate.isSameOrAfter(this.overlappingEventStartDate)) {
      overlap.startDate = this.openEventStartDate.clone().format(YYYY_MM_DD)
    } else {
      const daysBetweenStarts =
        this.overlappingEventStartDate.diff(this.openEventStartDate, 'days', true)
      const periodsUntilStartCandidate = Math.ceil(daysBetweenStarts / this.daysInOpenEventPeriod)
      const overlapStartDate = this.openEventStartDate.clone()
        .add(periodsUntilStartCandidate * this.daysInOpenEventPeriod, 'days')

      overlap.startDate = overlapStartDate.format(YYYY_MM_DD)
    }

    // Set the end date of the overlap
    if (this.overlappingEventEndDate === null) {
      overlap.endDate = this.openEventEndDate?.clone().format(YYYY_MM_DD) ?? null
    } else {
      const daysBetween =
        this.overlappingEventEndDate.diff(this.openEventStartDate, 'days', true)
      const periodsUntilEndCandidate = Math.floor(daysBetween / this.daysInOpenEventPeriod)
      const overlapEndDate = this.openEventStartDate.clone()
        .add(periodsUntilEndCandidate * this.daysInOpenEventPeriod, 'days')

      overlap.endDate = overlapEndDate.format(YYYY_MM_DD)
    }

    return overlap
  }

  private splitDateTail (
    openEvent: PlanningEvent,
    overlap: PlanningEvent | null
  ): PlanningEvent | null {
    // no overlap means no tail
    if (overlap === null) return null
    // infinite overlap means no tail
    if (overlap.endDate === null) return null

    // If the event is completely overlapped, there is no tail
    const overlapEnd = moment(overlap.endDate, YYYY_MM_DD)
    if (overlapEnd.isSameOrAfter(this.openEventEndDate)) return null

    const tail = this.cloneEvent(openEvent)

    // The start date is the first date after the end date of the overlap
    const daysBetween = overlapEnd.diff(this.openEventStartDate, 'days', true)
    let periodsUntilStart = Math.ceil(daysBetween / this.daysInOpenEventPeriod)
    if (daysBetween % this.daysInOpenEventPeriod === 0) {
      periodsUntilStart += 1
    }

    const tailStart = this.openEventStartDate.clone()
      .add(periodsUntilStart * this.daysInOpenEventPeriod, 'days')

    tail.startDate = tailStart.format(YYYY_MM_DD)
    tail.endDate = openEvent.endDate
    return tail
  }

  private createEventWithNewPeriod (
    newPeriod: number,
    newStartDate: Moment,
    newEndDate: Moment | null,
    event: PlanningEvent
  ): PlanningEvent {
    const splitEvent = this.cloneEvent(event)
    splitEvent.startDate = newStartDate.format(YYYY_MM_DD)
    splitEvent.endDate = (newEndDate === null) ? null : newEndDate.format(YYYY_MM_DD)
    splitEvent.weeksPeriod = newPeriod
    return splitEvent
  }

  private createCloneWithTimeslot (cloneTarget: PlanningEvent, slot: Timeslot): PlanningEvent {
    const clone = this.cloneEvent(cloneTarget)
    clone.startTime = slot.startTime
    clone.endTime = slot.endTime
    return clone
  }

  private getOverlap (firstSlot: Timeslot, secondSlot: Timeslot): Timeslot {
    return {
      startTime: Time.max(firstSlot.startTime, secondSlot.startTime),
      endTime: Time.min(firstSlot.endTime, secondSlot.endTime)
    }
  }

  private calculateEndDate (
    eventEnd: null | Moment,
    newStartDate: Moment,
    daysInNewPeriod: number
  ): Moment | null {
    if (eventEnd === null) {
      return null
    } else {
      const daysBetween = eventEnd.diff(newStartDate, 'days', true)
      const periodsUntilEndCandidate = Math.floor(daysBetween / daysInNewPeriod)

      return newStartDate.clone()
        .add(periodsUntilEndCandidate * daysInNewPeriod, 'days')
    }
  }

  private cloneEvent (event: PlanningEvent): PlanningEvent {
    const clone = structuredClone(event)
    clone.startTime = event.startTime
    clone.endTime = event.endTime
    return clone
  }
}
