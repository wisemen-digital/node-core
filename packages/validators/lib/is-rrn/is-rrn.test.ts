import { describe, it, before, after } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsRRN } from './is-rrn.validator.js'
import dayjs from 'dayjs'

class TestClass {
  @IsRRN()
  rrn: string
}

describe('IsRRN Decorator', () => {
  it('Should not throw validator errors for valid rrn', async () => {
    const testInstance = new TestClass()

    testInstance.rrn = 'invalid=rrn'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('Should throw validator errors for invalid rrn', async () => {
    const testInstance = new TestClass()

    testInstance.rrn = '88062684571'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })
})
