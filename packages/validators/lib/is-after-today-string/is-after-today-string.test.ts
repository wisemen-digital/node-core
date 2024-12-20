import { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { Time } from '@wisemen/time'
import { IsAfterTodayString } from './is-after-today-string.validator.js'

class TestClass {
  @IsAfterTodayString()
  dateString: string
}

describe('IsAfterTodayString decorator test', () => {
  it('should pass validation when the date is after today', async () => {
    const testInstance = new TestClass()
    testInstance.dateString = dayjs().add(1, 'day').format('YYYY-MM-DD')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the date is today', async () => {
    const testInstance = new TestClass()
    testInstance.dateString = dayjs().format('YYYY-MM-DD')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should fail validation when the date is before today', async () => {
    const testInstance = new TestClass()
    testInstance.dateString = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should fail validation when the date is invalid date string', async () => {
    const testInstance = new TestClass()
    testInstance.dateString = 'invalid-date'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
