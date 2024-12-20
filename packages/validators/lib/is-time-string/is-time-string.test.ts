import { describe, it } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsTimeString } from './is-time-string.validator.js'

class TestClass {
  @IsTimeString()
  timeString: string
}

describe('IsTimeString decorator test', () => {
  it('should pass validation when the time string is a valid time string', async () => {
    const testInstance = new TestClass()

    testInstance.timeString = '12:00:00'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the timestring is invalid', async () => {
    const testInstance = new TestClass()

    testInstance.timeString = 'abc'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
