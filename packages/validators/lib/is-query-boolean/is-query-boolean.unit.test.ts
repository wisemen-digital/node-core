import { describe, it } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsQueryBoolean } from './is-query-boolean.js'

class TestClass {
  @IsQueryBoolean()
  boolean: string
}

describe('IsQueryBoolean decorator', () => {
  describe('IsQueryBoolean decorator Test', () => {
    it('should pass validation when the string is true', async () => {
      const testInstance = new TestClass()

      testInstance.boolean = 'true'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })

    it('should pass validation when the string is false', async () => {
      const testInstance = new TestClass()

      testInstance.boolean = 'false'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })

    it('should fail validation when the string is not true or false', async () => {
      const testInstance = new TestClass()

      testInstance.boolean = 'test'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })
  })
})
