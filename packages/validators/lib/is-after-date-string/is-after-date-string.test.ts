import { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsAfterDateString } from './is-after-date-string.validator.js'

class TestClass {
  @IsAfterDateString((obj: TestClass) => obj.reference)
  dateString: string

  reference: string
}

describe('IsAfterDateString decorator test', () => {
  it('should pass validation when the date is after the reference date', async () => {
    const testInstance = new TestClass()

    testInstance.dateString = dayjs().add(1, 'day').format('YYYY-MM-DD')
    testInstance.reference = dayjs().format('YYYY-MM-DD')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the date is before the reference date', async () => {
    const testInstance = new TestClass()

    testInstance.dateString = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    testInstance.reference = dayjs().format('YYYY-MM-DD')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should fail validation when the date is the same as the reference date', async () => {
    const testInstance = new TestClass()

    testInstance.dateString = dayjs().format('YYYY-MM-DD')
    testInstance.reference = dayjs().format('YYYY-MM-DD')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
