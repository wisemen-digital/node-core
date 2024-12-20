import { describe, it, before, after } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsMoneyString } from './is-money-string.validator.js'

class TestClass {
  @IsMoneyString()
  money: string
}

describe('IsMoneyString Decorator', () => {
  it('Should not throw validation error when input is valid money string', async () => {
    const testInstance = new TestClass()

    testInstance.money = '1000.00'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })


  it('Should throw validation error when input is invalid money string', async () => {
    const testInstance = new TestClass()

    testInstance.money = 'aa'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
