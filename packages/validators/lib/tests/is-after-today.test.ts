import { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsAfterTodayString } from '../is-after-today.js'

class TestClass {
  @IsAfterTodayString()
  date: string
}

describe('IsAfterTodayString decorator', () => {
  describe('IsAfterTodayString decorator Test', () => {
    it('should pass validation when the date is after today', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().add(1, 'day').format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })

    it('should fail validation when the date is before today', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })

    it('should fail validation when the date is the same as today', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })
  })
})
