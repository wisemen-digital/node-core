import { describe, it } from 'node:test'
import { IsString, validate } from 'class-validator'
import { expect } from 'expect'
import { IsUndefinable } from './is-undefinable.validator.js'

class TestClass {
  @IsString()
  @IsUndefinable()
  value: unknown | undefined
}

describe('IsUndefinable decorator test', () => {
  it('should pass validation when the value is undefined', async () => {
    const testInstance = new TestClass()

    testInstance.value = undefined

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the value is not undefined and apply the other decator', async () => {
    const testInstance = new TestClass()

    testInstance.value = 'a'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the value is not undefined and apply the other decator', async () => {
    const testInstance = new TestClass()

    testInstance.value = 1

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
