import { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { IsString, validate } from 'class-validator'
import { expect } from 'expect'
import { IsNullable } from './is-nullable.validator.js'

class TestClass {
  @IsString()
  @IsNullable()
  value: unknown | null
}

describe('IsNullable decorator test', () => {
  it('should pass validation when the value is null', async () => {
    const testInstance = new TestClass()

    testInstance.value = null

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the value is not null and apply the other decator', async () => {
    const testInstance = new TestClass()

    testInstance.value = 'a'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the value is not null and apply the other decator', async () => {
    const testInstance = new TestClass()

    testInstance.value = 1

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
