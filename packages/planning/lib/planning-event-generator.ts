import type { Moment } from 'moment'
import moment from 'moment/moment.js'
import { RecurringEvent } from "./recurring-event.js"
import { PlanningEvent } from "./planning-event.js"
import { YYYY_MM_DD } from "./constants.js"

export class PlanningEventGenerator<ExtendedRecurringEvent extends RecurringEvent> {
  public generateFor(
    recurringEvents: ExtendedRecurringEvent[],
    from: Moment,
    until: Moment
  ): ExtendedRecurringEvent[] {
    if (from.isAfter(until)) throw new Error('invalid_parameters')

    const generatedEvents: ExtendedRecurringEvent[] = []
    for (const recurringEvent of recurringEvents) {
      const eventDates = this.generateEventDatesFor(recurringEvent, from, until)
      const events = this.generateEventsOn(eventDates, recurringEvent)
      generatedEvents.push(...events)
    }
    return generatedEvents
  }

  private generateEventDatesFor (
    recurringEvent: RecurringEvent,
    from: Moment,
    until: Moment
  ): string[] {
    const start = this.getFirstDateAfter(from, recurringEvent)
    const end = this.getLastDateBefore(until, recurringEvent)
    return this.generateEventDatesBetweenWithPeriod(start, end, recurringEvent.weeksPeriod)
  }

  private generateEventsOn (
    eventDates: string[],
    event: ExtendedRecurringEvent
  ): ExtendedRecurringEvent[] {
    return eventDates.map(eventDate => this.createCopyOfEventOnDate(event,eventDate))
  }

  private createCopyOfEventOnDate(
    event: ExtendedRecurringEvent, eventDate: string
  ): ExtendedRecurringEvent {
    const generatedEvent = structuredClone(event)
    generatedEvent.startDate = eventDate
    generatedEvent.endDate = eventDate
    generatedEvent.startTime = event.startTime.copy()
    generatedEvent.endTime = event.endTime.copy()
    return generatedEvent;
  }

  private getFirstDateAfter (date: Moment, recurringEvent: RecurringEvent): Moment {
    const eventStart = moment(recurringEvent.startDate, YYYY_MM_DD)
    if (eventStart.isAfter(date)) {
      return eventStart
    } else {
      const weeksBetween = date.diff(eventStart, 'weeks', true)
      const periodsBetween = (weeksBetween) / recurringEvent.weeksPeriod
      const weeksUntilFirstDateAfterFrom = Math.ceil(periodsBetween) * recurringEvent.weeksPeriod
      return eventStart.add(weeksUntilFirstDateAfterFrom, 'weeks')
    }
  }

  private getLastDateBefore (date: Moment, recurringEvent: RecurringEvent): Moment {
    const recursInfinitely = recurringEvent.endDate === null
    const eventEnd = moment(recurringEvent.endDate, YYYY_MM_DD)
    if (recursInfinitely || eventEnd.isAfter(date)) {
      return date
    } else {
      return eventEnd
    }
  }

  private generateEventDatesBetweenWithPeriod (
    start: Moment,
    end: Moment,
    periodInWeeks: number
  ): string[] {
    const eventDate = start.clone()
    const eventDates: string[] = []
    while (eventDate.isSameOrBefore(end)) {
      eventDates.push(moment(eventDate).format(YYYY_MM_DD))
      eventDate.add(periodInWeeks, 'weeks')
    }
    return eventDates
  }
}
