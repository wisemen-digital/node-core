import { describe, it } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsValidTimeString } from '../is-valid-time.js'

class TestClass {
  @IsValidTimeString()
  time: string
}

describe('IsValidTimeString decorator', () => {
  describe('IsValidTimeString decorator Test', () => {
    it('should pass validation when the time is in formate hh:mm', async () => {
      const testInstance = new TestClass()

      testInstance.time = '12:00'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })

    it('should fail validation when the time is not in the right format', async () => {
      const testInstance = new TestClass()

      testInstance.time = '1200'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })

    it('should fail validation when the time is not in the 24h range', async () => {
      const testInstance = new TestClass()

      testInstance.time = '25:00'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })
  })
})
