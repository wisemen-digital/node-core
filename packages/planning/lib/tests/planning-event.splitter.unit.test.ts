import { describe, it } from 'node:test'
import moment from 'moment'
import { expect } from 'expect'
import {Time} from "@wisemen/time";
import {YYYY_MM_DD} from "../constants.js";
import {PlanningEventSplitter} from "../planning-event.splitter.js";
import {createPlanningEvent} from "./utils/planning-event.sample.js";
import {createRecurringEvent} from "./utils/recurring-event.sample.js";

describe('PlanningEventSplitter Unit Test', function () {
  describe('.split', function () {
    it('should return the original event if the events do not overlap', async function () {
      const splitTarget = await createPlanningEvent({
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().format(YYYY_MM_DD)
      })
      const event = await createPlanningEvent({
        startDate: moment().add(1, 'day').format(YYYY_MM_DD),
        endDate: moment().add(1, 'day').format(YYYY_MM_DD)
      })

      const splitResult = PlanningEventSplitter.split(splitTarget, event)
      expect(splitResult).toHaveLength(1)
      expect(splitResult[0]).toBe(splitTarget)
    })

    it('should return nothing if non-recurring events overlap completely', async function () {
      const splitTarget = await createPlanningEvent({
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().format(YYYY_MM_DD),
        startTime: new Time('09:00:00'),
        endTime: new Time('11:00:00')
      })
      const event = await createPlanningEvent({
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().format(YYYY_MM_DD),
        startTime: new Time('09:00:00'),
        endTime: new Time('11:00:00')
      })

      const splitResult = PlanningEventSplitter.split(splitTarget, event)
      expect(splitResult).toHaveLength(0)
    })

    it('should return nothing if recurring events overlap completely', async function () {
      const splitTarget = await createRecurringEvent({
        weeksPeriod: 1,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(5, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('09:00:00'),
        endTime: new Time('11:00:00')
      })
      const event = await createRecurringEvent({
        weeksPeriod: 1,
        startDate: moment().format(YYYY_MM_DD),
        endDate: moment().add(5, 'weeks').format(YYYY_MM_DD),
        startTime: new Time('09:00:00'),
        endTime: new Time('11:00:00')
      })

      const splitResult = PlanningEventSplitter.split(splitTarget, event)
      expect(splitResult).toHaveLength(0)
    })

    it('should shorten an event if the times overlap', async function () {
      const today = moment().format(YYYY_MM_DD)
      const splitTarget = await createPlanningEvent({
        startDate: today,
        endDate: today,
        startTime: new Time('08:00:00'),
        endTime: new Time('10:00:00')
      })
      const event = await createPlanningEvent({
        startDate: today,
        endDate: today,
        startTime: new Time('09:00:00'),
        endTime: new Time('10:00:00')
      })

      const splitResult = PlanningEventSplitter.split(splitTarget, event)
      expect(splitResult).toHaveLength(1)
      expect(splitResult[0]).toMatchObject({
        startDate: today,
        endDate: today,
        startTime: new Time('08:00:00'),
        endTime: new Time('09:00:00')
      })
    })

    it('should split the event in a head and tail an event if the timeslot envelops another timeslot', async function () {
      const today = moment().format(YYYY_MM_DD)
      const splitTarget = await createPlanningEvent({
        startDate: today,
        endDate: today,
        startTime: new Time('08:00:00'),
        endTime: new Time('11:00:00')
      })
      const event = await createPlanningEvent({
        startDate: today,
        endDate: today,
        startTime: new Time('09:00:00'),
        endTime: new Time('10:00:00')
      })

      const splitResult = PlanningEventSplitter.split(splitTarget, event)
      expect(splitResult).toHaveLength(2)
      expect(splitResult).toEqual(expect.arrayContaining([
        expect.objectContaining({
          startDate: today,
          endDate: today,
          startTime: new Time('08:00:00'),
          endTime: new Time('09:00:00')
        }),
        expect.objectContaining({
          startDate: today,
          endDate: today,
          startTime: new Time('10:00:00'),
          endTime: new Time('11:00:00')
        })
      ]))
    })

    it('should set an end date on the event when the overlap starts in the lifetime of the open event', async function () {
      const today = moment().format(YYYY_MM_DD)
      const splitTarget = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: today,
        endDate: null,
        startTime: new Time('08:00:00'),
        endTime: new Time('11:00:00')
      })

      const event = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment(today, YYYY_MM_DD)
          .add(4, 'weeks')
          .format(YYYY_MM_DD),
        endDate: null,
        startTime: new Time('08:00:00'),
        endTime: new Time('11:00:00')
      })

      const splitResult = PlanningEventSplitter.split(splitTarget, event)
      expect(splitResult).toHaveLength(1)
      expect(splitResult).toEqual(expect.arrayContaining([
        expect.objectContaining({
          startDate: today,
          endDate: moment(today, YYYY_MM_DD)
            .add(2, 'weeks')
            .format(YYYY_MM_DD),
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        })
      ]))
    })

    it('should split an event in a head and tail when open event envelops the new event', async function () {
      const today = moment().format(YYYY_MM_DD)
      const splitTarget = await createRecurringEvent({
        isRecurring: true,
        weeksPeriod: 2,
        startDate: today,
        endDate: null,
        startTime: new Time('08:00:00'),
        endTime: new Time('11:00:00')
      })

      const event = await createRecurringEvent({
        isRecurring: true,
        weeksPeriod: 2,
        startDate: moment(today, YYYY_MM_DD)
          .add(4, 'weeks')
          .format(YYYY_MM_DD),
        endDate: moment(today, YYYY_MM_DD)
          .add(8, 'weeks')
          .format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('11:00:00')
      })

      const splitResult = PlanningEventSplitter.split(splitTarget, event)
      expect(splitResult).toHaveLength(2)
      expect(splitResult).toEqual(expect.arrayContaining([
        expect.objectContaining({
          startDate: today,
          endDate: moment(today, YYYY_MM_DD)
            .add(2, 'weeks')
            .format(YYYY_MM_DD),
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        }),
        expect.objectContaining({
          startDate: moment(today, YYYY_MM_DD)
            .add(10, 'weeks')
            .format(YYYY_MM_DD),
          endDate: null,
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        })
      ]))
    })

    it('should split the open event into multiple events to account for the overlap period', async function () {
      const today = moment().format(YYYY_MM_DD)
      const splitTarget = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: today,
        endDate: null,
        startTime: new Time('08:00:00'),
        endTime: new Time('11:00:00')
      })

      const event = await createRecurringEvent({
        weeksPeriod: 5,
        startDate: moment(today, YYYY_MM_DD)
          .add(4, 'weeks')
          .format(YYYY_MM_DD),
        endDate: moment(today, YYYY_MM_DD)
          .add(14, 'weeks')
          .format(YYYY_MM_DD),
        startTime: new Time('08:00:00'),
        endTime: new Time('11:00:00')
      })

      const splitResult = PlanningEventSplitter.split(splitTarget, event)
      expect(splitResult).toHaveLength(6)
      expect(splitResult).toEqual(expect.arrayContaining([
        // Head
        expect.objectContaining({
          startDate: today,
          endDate: moment(today, YYYY_MM_DD)
            .add(2, 'weeks')
            .format(YYYY_MM_DD),
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        }),
        // Overlaps
        expect.objectContaining({
          startDate: moment(today, YYYY_MM_DD)
            .add(6, 'weeks')
            .format(YYYY_MM_DD),
          endDate: moment(today, YYYY_MM_DD)
            .add(6, 'weeks')
            .format(YYYY_MM_DD),
          weeksPeriod: 10,
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        }),
        expect.objectContaining({
          startDate: moment(today, YYYY_MM_DD)
            .add(8, 'weeks')
            .format(YYYY_MM_DD),
          endDate: moment(today, YYYY_MM_DD)
            .add(8, 'weeks')
            .format(YYYY_MM_DD),
          weeksPeriod: 10,
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        }),
        expect.objectContaining({
          startDate: moment(today, YYYY_MM_DD)
            .add(10, 'weeks')
            .format(YYYY_MM_DD),
          endDate: moment(today, YYYY_MM_DD)
            .add(10, 'weeks')
            .format(YYYY_MM_DD),
          weeksPeriod: 10,
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        }),
        expect.objectContaining({
          startDate: moment(today, YYYY_MM_DD)
            .add(12, 'weeks')
            .format(YYYY_MM_DD),
          endDate: moment(today, YYYY_MM_DD)
            .add(12, 'weeks')
            .format(YYYY_MM_DD),
          weeksPeriod: 10,
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        }),
        // Tail
        expect.objectContaining({
          startDate: moment(today, YYYY_MM_DD)
            .add(16, 'weeks')
            .format(YYYY_MM_DD),
          endDate: null,
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        })
      ]))
    })

    it('should split the open event into multiple events to account for the overlap period and the time overlap', async function () {
      const today = moment().format(YYYY_MM_DD)
      const splitTarget = await createRecurringEvent({
        weeksPeriod: 1,
        startDate: today,
        endDate: null,
        startTime: new Time('08:00:00'),
        endTime: new Time('11:00:00')
      })

      const event = await createRecurringEvent({
        weeksPeriod: 2,
        startDate: moment(today, YYYY_MM_DD)
          .add(2, 'weeks')
          .format(YYYY_MM_DD),
        endDate: moment(today, YYYY_MM_DD)
          .add(6, 'weeks')
          .format(YYYY_MM_DD),
        startTime: new Time('09:00:00'),
        endTime: new Time('10:00:00')
      })

      const splitResult = PlanningEventSplitter.split(splitTarget, event)
      expect(splitResult).toHaveLength(5)
      expect(splitResult).toEqual(expect.arrayContaining([
        // Head
        expect.objectContaining({
          startDate: today,
          endDate: moment(today, YYYY_MM_DD)
            .add(1, 'weeks')
            .format(YYYY_MM_DD),
          weeksPeriod: 1,
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        }),
        // Overlaps
        expect.objectContaining({
          startDate: moment(today, YYYY_MM_DD)
            .add(2, 'weeks')
            .format(YYYY_MM_DD),
          endDate: moment(today, YYYY_MM_DD)
            .add(6, 'weeks')
            .format(YYYY_MM_DD),
          weeksPeriod: 2,
          startTime: new Time('08:00:00'),
          endTime: new Time('09:00:00')
        }),
        expect.objectContaining({
          startDate: moment(today, YYYY_MM_DD)
            .add(2, 'weeks')
            .format(YYYY_MM_DD),
          endDate: moment(today, YYYY_MM_DD)
            .add(6, 'weeks')
            .format(YYYY_MM_DD),
          weeksPeriod: 2,
          startTime: new Time('10:00:00'),
          endTime: new Time('11:00:00')
        }),
        expect.objectContaining({
          startDate: moment(today, YYYY_MM_DD)
            .add(3, 'weeks')
            .format(YYYY_MM_DD),
          endDate: moment(today, YYYY_MM_DD)
            .add(5, 'weeks')
            .format(YYYY_MM_DD),
          weeksPeriod: 2,
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        }),
        // Tail
        expect.objectContaining({
          startDate: moment(today, YYYY_MM_DD)
            .add(7, 'weeks')
            .format(YYYY_MM_DD),
          endDate: null,
          weeksPeriod: 1,
          startTime: new Time('08:00:00'),
          endTime: new Time('11:00:00')
        })
      ]))
    })
  })
})
