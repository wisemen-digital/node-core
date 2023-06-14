import { describe, it, before, after } from 'node:test'
import moment from 'moment'
import { expect } from 'expect'
import { PlanningEventGenerator } from '../planning-event-generator.js'
import { createRecurringEvent } from './recurring-event.sample.js'

describe('PlanningEventGenerator', () => {
  describe('generateFor', () => {
    it('should throw an error when an invalid period is given', async function () {
      const generator = new PlanningEventGenerator()
      const from = moment()
      const until = moment(from).subtract(2, 'days')
      const event = await createRecurringEvent()
      expect(() => generator.generateFor([event], from, until)).toThrow()
    })

    it('should return an empty array when the event is before the given period', async function () {
      const generator = new PlanningEventGenerator()
      const from = moment()
      const until = moment(from).add(2, 'days')
      const event = await createRecurringEvent({
        startDate: moment(from).subtract(2, 'weeks').format('YYYY-MM-DD'),
        endDate: moment(from).subtract(1, 'weeks').format('YYYY-MM-DD')
      })
      const generatedEvents = generator.generateFor([event], from, until)

      expect(generatedEvents).toHaveLength(0)
    })

    it('should return an empty array when the event is after the given period', async function () {
      const generator = new PlanningEventGenerator()
      const from = moment()
      const until = moment(from).add(2, 'days')
      const event = await createRecurringEvent({
        startDate: moment(from).add(1, 'weeks').format('YYYY-MM-DD'),
        endDate: moment(from).add(2, 'weeks').format('YYYY-MM-DD')
      })

      const generatedEvents = generator.generateFor([event], from, until)

      expect(generatedEvents).toHaveLength(0)
    })

    it('should return an empty array when the period falls between two generation candidates', async function () {
      const generator = new PlanningEventGenerator()
      const from = moment('2023-01-10', 'YYYY-MM-DD')
      const until = moment('2023-01-12', 'YYYY-MM-DD')
      const event = await createRecurringEvent({
        startDate: '2023-01-9',
        endDate: '2023-01-16'
      })

      const generatedEvents = generator.generateFor([event], from, until)
      expect(generatedEvents).toHaveLength(0)
    })

    it('should generate events after the start date', async function () {
      const generator = new PlanningEventGenerator()
      const from = moment('2023-01-10', 'YYYY-MM-DD')
      const until = moment('2023-01-18', 'YYYY-MM-DD')
      const event = await createRecurringEvent({
        startDate: '2023-01-9',
        endDate: '2023-01-16'
      })

      const generatedEvents = generator.generateFor([event], from, until)
      expect(generatedEvents).toHaveLength(1)
      expect(generatedEvents).toStrictEqual(expect.arrayContaining([
        expect.objectContaining({
          startDate: event.endDate,
          endDate: event.endDate
        })
      ]))
    })

    it('should generate events before the end date', async function () {
      const generator = new PlanningEventGenerator()
      const from = moment('2023-01-10', 'YYYY-MM-DD')
      const until = moment('2023-01-18', 'YYYY-MM-DD')
      const event = await createRecurringEvent({
        startDate: '2023-01-12',
        endDate: '2023-01-19'
      })

      const generatedEvents = generator.generateFor([event], from, until)

      expect(generatedEvents).toHaveLength(1)
      expect(generatedEvents).toStrictEqual(expect.arrayContaining([
        expect.objectContaining({
          startDate: event.startDate,
          endDate: event.startDate
        })
      ]))
    })

    it('should generate multiple events', async function () {
      const generator = new PlanningEventGenerator()
      const from = moment('2023-01-11', 'YYYY-MM-DD')
      const until = moment('2023-01-20', 'YYYY-MM-DD')
      const event = await createRecurringEvent({
        isRecurring: true,
        weeksPeriod: 1,
        startDate: '2023-01-12',
        endDate: '2023-01-19'
      })

      const generatedEvents = generator.generateFor([event], from, until)

      expect(generatedEvents).toHaveLength(2)
      expect(generatedEvents).toStrictEqual(expect.arrayContaining([
        expect.objectContaining({
          startDate: event.startDate,
          endDate: event.startDate
        }),
        expect.objectContaining({
          startDate: event.endDate,
          endDate: event.endDate
        })
      ]))
    })

    it('generates events for infinitely recurring events', async function () {
      const generator = new PlanningEventGenerator()
      const from = moment('2023-01-10', 'YYYY-MM-DD')
      const until = moment('2023-01-18', 'YYYY-MM-DD')
      const event = await createRecurringEvent({
        startDate: '2023-01-9',
        endDate: null
      })

      const generatedEvents = generator.generateFor([event], from, until)

      expect(generatedEvents).toHaveLength(1)
      expect(generatedEvents).toStrictEqual(expect.arrayContaining([
        expect.objectContaining({
          startDate: '2023-01-16',
          endDate: '2023-01-16'
        })
      ]))
    })
  })
})
