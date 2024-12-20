import test, { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { IsString, validate } from 'class-validator'
import { expect } from 'expect'
import { IsNullableWhen } from './is-nullable-when.validator.js'

class TestClass {
  @IsString()
  @IsNullableWhen((obj: TestClass) => obj.condition)
  value: unknown | null

  condition: boolean
}

describe('IsNullableWhen decorator test', () => {
  it('should pass validation when the nullable condition is met and value is null', async () => {
    const testInstance = new TestClass()

    testInstance.value = null
    testInstance.condition = true

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the nullable condition is met and value is not null', async () => {
    const testInstance = new TestClass()

    testInstance.value = '1'
    testInstance.condition = true

    const errors = await validate(testInstance)

    console.log(errors)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the nullable condition is not met and value is not null', async () => {
    const testInstance = new TestClass()

    testInstance.value = '1'
    testInstance.condition = false

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the nullable condition is not met and value is not null, and apply other decorator', async () => {
    const testInstance = new TestClass()

    testInstance.value = 1
    testInstance.condition = false

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })


  it('should fail validation when the nullable condition is not met and value is null', async () => {
    const testInstance = new TestClass()

    testInstance.value = null
    testInstance.condition = false

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
