import { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsSameOrAfterDateString } from './is-same-or-after-date-string.validator.js'

class TestClass {
  @IsSameOrAfterDateString((obj: TestClass) => obj.reference)
  dateString: string

  reference: string
}

describe('IsSameOrAfterTimeString decorator test', () => {
  it('should pass validation when the date string is after the reference', async () => {
    const testInstance = new TestClass()

    testInstance.dateString = dayjs().add(1, 'day').format('YYYY-MM-DD')
    testInstance.reference = dayjs().format('YYYY-MM-DD')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the date string is same the reference', async () => {
    const testInstance = new TestClass()

    testInstance.dateString = dayjs().format('YYYY-MM-DD')
    testInstance.reference = dayjs().format('YYYY-MM-DD')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the date string is before the reference', async () => {
    const testInstance = new TestClass()

    testInstance.dateString = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    testInstance.reference = dayjs().format('YYYY-MM-DD')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should fail validation when the date string is invalid', async () => {
    const testInstance = new TestClass()

    testInstance.dateString = 'invalid'
    testInstance.reference = dayjs().format('YYYY-MM-DD')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
