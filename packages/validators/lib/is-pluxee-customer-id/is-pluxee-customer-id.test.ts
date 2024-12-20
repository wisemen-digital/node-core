import { describe, it, before, after } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsValidPluxeeCustomerId } from './is-pluxee-customer-id.validator.js'

function generateValidPluxeeCustomerId (): string {
  const number = Math.floor(Math.random() * 10 ** 10).toString().padStart(10, '0')
  const controlNumber = (parseInt(number) % 97).toString().padStart(2, '0')

  return `${number}${controlNumber}`
}

const invalidPluxeeCustomerId = '12345678901275'

class TestClass {
  @IsValidPluxeeCustomerId()
  number: string
}

describe('IsValidPluxeeCustomerId Decorator', () => {
  it('Should throw validator errors for invalid pluxee customer id', async () => {
    const testInstance = new TestClass()

    testInstance.number = invalidPluxeeCustomerId

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })


  it('Should not throw validator errors for valid pluxee customer id', async () => {
    const testInstance = new TestClass()

    testInstance.number = generateValidPluxeeCustomerId()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  // edge case --> 1902281065 % 97 = 0, checksum is 97
  it('Should not throw error when checksum is 97 but modulo is 0', async () => {
    const testInstance = new TestClass()

    testInstance.number = '190228106597'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  // edge case --> 2587294095 % 97 = 0, checksum is 0
  it('Should not throw error when checksum is 0 and modulo is 0', async () => {
    const testInstance = new TestClass()

    testInstance.number = '258729409500'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })
})
