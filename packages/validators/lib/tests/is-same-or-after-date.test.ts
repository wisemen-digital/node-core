import { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsSameOrAfterDateString } from '../is-same-or-after-date.js'

class TestClass {
  @IsSameOrAfterDateString((obj: TestClass) => obj.referenceDate)
  date: string

  referenceDate: string
}

describe('IsSameOrAfterDateString decorator', () => {
  describe('IsSameOrAfterDateString decorator Test', () => {
    it('should pass validation when the date is after the reference date', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().add(1, 'day').format('YYYY-MM-DD')
      testInstance.referenceDate = dayjs().format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })

    it('should fail validation when the date is before the reference date', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      testInstance.referenceDate = dayjs().format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })

    it('should pass validation when the date is the same as the reference date', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().format('YYYY-MM-DD')
      testInstance.referenceDate = dayjs().format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })
  })
})
