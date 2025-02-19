import { describe, it } from 'node:test'
import moment from 'moment'
import { expect } from 'expect'
import { YYYY_MM_DD } from '../constants.js'
import { Time } from '@wisemen/time'
import {PlanningEventOverlapValidator} from "../planning-event-overlap-validator.js";
import {createPlanningEvent} from "./utils/planning-event.sample.js";
import {createRecurringEvent} from "./utils/recurring-event.sample.js";
import {createPlanningEventException} from "./utils/planning-exception.sample.js";

describe('PlanningPlanningEventOverlapValidator', () => {
  describe('.validate', () => {
    it('should return false when events are not on the same weekday', async function () {
      const event1 = await createPlanningEvent({
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().format(YYYY_MM_DD)
      })
      const event2 = await createPlanningEvent({
        startDate: moment().add(1, 'day').format(YYYY_MM_DD),
        endDate: moment().add(1, 'day').format(YYYY_MM_DD)
      })

      expect(PlanningEventOverlapValidator.overlap(event1, event2)).toBe(false)
    })

    it('should return false when events periods do not overlap', async function () {
      const event1 = await createPlanningEvent({
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(1, 'week').format(YYYY_MM_DD)
      })
      const event2 = await createPlanningEvent({
        startDate: moment().add(2, 'weeks').format(YYYY_MM_DD),
        endDate: moment().add(3, 'weeks').format(YYYY_MM_DD)
      })

      expect(PlanningEventOverlapValidator.overlap(event1, event2)).toBe(false)
    })

    it('should return false when events are not active at the same time', async function () {
      const event1 = await createPlanningEvent({
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00')
      })
      const event2 = await createPlanningEvent({
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().format(YYYY_MM_DD),
        startTime: new Time('09:00:00'),
        endTime: new Time('10:00:00')
      })

      expect(PlanningEventOverlapValidator.overlap(event1, event2)).toBe(false)
      expect(PlanningEventOverlapValidator.overlap(event2, event1)).toBe(false)
    })

    it('should return true when a non recurring and recurring event overlap', async function () {
      const event = await createPlanningEvent({
        startDate: moment().add(1, 'weeks').format(YYYY_MM_DD),
        endDate: moment().add(1, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00')
      })
      const recurringEvent = await createRecurringEvent({
        weeksPeriod: 1,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(1, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00')
      })

      expect(PlanningEventOverlapValidator.overlap(event, recurringEvent)).toBe(true)
      expect(PlanningEventOverlapValidator.overlap(recurringEvent, event)).toBe(true)
    })

    it('should return false when a non recurring and recurring event do not overlap', async function () {
      const event = await createPlanningEvent({
        startDate: moment().add(1, 'week').format(YYYY_MM_DD),
        endDate: moment().add(1, 'week').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00')
      })
      const recurringEvent = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(2, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00')
      })

      recurringEvent.exceptions = []

      expect(PlanningEventOverlapValidator.overlap(event, recurringEvent)).toBe(false)
      expect(PlanningEventOverlapValidator.overlap(recurringEvent, event)).toBe(false)
    })

    it('should return false when a non recurring and recurring event overlap, but the recurring event has an exception', async function () {
      const event = await createPlanningEvent({
        startDate: moment().add(1, 'week').format(YYYY_MM_DD),
        endDate: moment().add(1, 'week').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00')
      })
      const recurringEvent = await createRecurringEvent({
        weeksPeriod: 1,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(1, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00'),
        exceptions: [createPlanningEventException({
          exceptionDate: moment().add(1, 'week').format(YYYY_MM_DD)
        })]
      })

      expect(PlanningEventOverlapValidator.overlap(event, recurringEvent)).toBe(false)
      expect(PlanningEventOverlapValidator.overlap(recurringEvent, event)).toBe(false)
    })

    it('should return true when infinite events overlap at infinity', async function () {
      const event1 = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().add(1, 'week').format(YYYY_MM_DD),
        endDate: null,
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00')
      })
      const event2 = await createRecurringEvent({
        weeksPeriod: 5,
        startDate: moment().format(YYYY_MM_DD),
        endDate: null,
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00')
      })

      expect(PlanningEventOverlapValidator.overlap(event1, event2)).toBe(true)
      expect(PlanningEventOverlapValidator.overlap(event2, event1)).toBe(true)
    })

    it('should return true when parallel infinite events align', async function () {
      const event1 = await createRecurringEvent({
        weeksPeriod: 4,
        startDate: moment().add(2, 'week').format(YYYY_MM_DD),
        endDate: null,
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00')
      })
      const event2 = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().format(YYYY_MM_DD),
        endDate: null,
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00')
      })

      expect(PlanningEventOverlapValidator.overlap(event1, event2)).toBe(true)
      expect(PlanningEventOverlapValidator.overlap(event2, event1)).toBe(true)
    })

    it('should return false when parallel infinite events do not align', async function () {
      const event1 = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().add(1, 'week').format(YYYY_MM_DD),
        endDate: null,
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00')
      })
      const event2 = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().format(YYYY_MM_DD),
        endDate: null,
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00')
      })

      expect(PlanningEventOverlapValidator.overlap(event1, event2)).toBe(false)
      expect(PlanningEventOverlapValidator.overlap(event2, event1)).toBe(false)
    })

    it('should return false when parallel recurring events do not align', async function () {
      const event1 = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().add(1, 'week').format(YYYY_MM_DD),
        endDate: moment().add(5, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00')
      })
      const event2 = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(6, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00')
      })

      expect(PlanningEventOverlapValidator.overlap(event1, event2)).toBe(false)
      expect(PlanningEventOverlapValidator.overlap(event2, event1)).toBe(false)
    })

    it('should return true when parallel recurring events align', async function () {
      const event1 = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().add(2, 'week').format(YYYY_MM_DD),
        endDate: moment().add(6, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00')
      })
      const event2 = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(6, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00')
      })

      expect(PlanningEventOverlapValidator.overlap(event1, event2)).toBe(true)
      expect(PlanningEventOverlapValidator.overlap(event2, event1)).toBe(true)
    })

    it('should return true when finite recurring events overlap', async function () {
      const event1 = await createRecurringEvent({
        weeksPeriod: 5,
        startDate: moment().add(1, 'week').format(YYYY_MM_DD),
        endDate: moment().add(6, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00')
      })
      const event2 = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(6, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00')
      })

      expect(PlanningEventOverlapValidator.overlap(event1, event2)).toBe(true)
      expect(PlanningEventOverlapValidator.overlap(event2, event1)).toBe(true)
    })

    it('should return false when finite recurring events overlap, but they have exceptions on the overlaps', async function () {
      const event1 = await createRecurringEvent({
        weeksPeriod: 4,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(8, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00'),
        exceptions: [
          createPlanningEventException({ exceptionDate: moment().format(YYYY_MM_DD) } ),
          createPlanningEventException({ exceptionDate: moment().add(4, 'weeks').format(YYYY_MM_DD) } ),
        ]
      })
      const event2 = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(8, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00'),
        exceptions: [
          createPlanningEventException({ exceptionDate: moment().add(8, 'weeks').format(YYYY_MM_DD) } ),
        ]
      })

      expect(PlanningEventOverlapValidator.overlap(event1, event2)).toBe(false)
      expect(PlanningEventOverlapValidator.overlap(event2, event1)).toBe(false)
    })

    it('should return true when finite recurring events overlap, and only some dates have exceptions', async function () {
      const event1 = await createRecurringEvent({
        weeksPeriod: 4,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(8, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00'),
        exceptions: [
          createPlanningEventException({ exceptionDate: moment().format(YYYY_MM_DD) } ),
        ]
      })

      const event2 = createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(8, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00'),
        exceptions: [
          createPlanningEventException({ exceptionDate: moment().add(8, 'weeks').format(YYYY_MM_DD) } ),
        ]
      })

      expect(PlanningEventOverlapValidator.overlap(event1, event2)).toBe(true)
      expect(PlanningEventOverlapValidator.overlap(event2, event1)).toBe(true)
    })
  })
})
