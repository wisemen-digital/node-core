import { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsNullWhen } from './is-null-when.validator.js'

class TestClass {
  @IsNullWhen((obj: TestClass) => obj.reference !== null)
  value: unknown | null

  reference: unknown | null
}

describe('IsNullWhen decorator test', () => {
  it('should pass validation when the value is null, and the reference is not null', async () => {
    const testInstance = new TestClass()

    testInstance.value = null
    testInstance.reference = 1

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the value is null, and the reference is null', async () => {
    const testInstance = new TestClass()

    testInstance.value = null
    testInstance.reference = null

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the value is not null, and the reference is null', async () => {
    const testInstance = new TestClass()

    testInstance.value = 1
    testInstance.reference = 1

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
