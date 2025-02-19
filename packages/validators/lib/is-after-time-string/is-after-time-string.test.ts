import { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsAfterTimeString } from './is-after-time-string.validator.js'
import { Time } from '@wisemen/time'

class TestClass {
  @IsAfterTimeString((obj: TestClass) => obj.reference)
  timeString: string

  reference: string
}

describe('IsAfterTimeString decorator test', () => {
  it('should pass validation when the time is after the reference', async () => {
    const testInstance = new TestClass()

    testInstance.timeString = '12:00:00'
    testInstance.reference = '11:00:00'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the time is before the reference', async () => {
    const testInstance = new TestClass()

    testInstance.timeString = '11:00:00'
    testInstance.reference = '12:00:00'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should fail validation when the time is same as the reference', async () => {
    const testInstance = new TestClass()

    testInstance.timeString = '11:00:00'
    testInstance.reference = '11:00:00'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
