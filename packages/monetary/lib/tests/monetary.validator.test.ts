import { describe, it } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { MonetaryDto, MonetaryDtoBuilder } from '../monetary.dto.js'
import { IsMonetary } from '../monetary.validator.js'
import { Currency } from '../currency.enum.js'

describe('Monetary validator tests', () => {
  class Test {
    @IsMonetary({ maxPrecision: 4, allowedCurrencies: new Set<Currency>([Currency.EUR]) })
    foo: MonetaryDto
  }

  it('does not have errors for a valid object', async () => {
    const dto = new Test()

    dto.foo = new MonetaryDtoBuilder().build()

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true
    })

    expect(errors).toHaveLength(0)
  })

  describe('IsMonetaryMinAmountValidator', () => {
    const MIN_AMOUNT = 10

    class MinTest {
      @IsMonetary({
        maxPrecision: 4,
        allowedCurrencies: new Set<Currency>([Currency.EUR]),
        minAmount: MIN_AMOUNT
      })
      foo: MonetaryDto
    }

    it('has errors if amount is lower than min amount', async () => {
      const dto = new MinTest()

      dto.foo = new MonetaryDtoBuilder()
        .withAmount(MIN_AMOUNT - 1)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(1)
    })

    it('has no errors if amount is equal to min amount', async () => {
      const dto = new MinTest()

      dto.foo = new MonetaryDtoBuilder()
        .withAmount(MIN_AMOUNT)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(0)
    })

    it('has no errors if amount is higher than min amount', async () => {
      const dto = new MinTest()

      dto.foo = new MonetaryDtoBuilder()
        .withAmount(MIN_AMOUNT + 1)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(0)
    })
  })

  describe('IsMonetaryMaxAmountValidator', () => {
    const MAX_AMOUNT = 100

    class MaxTest {
      @IsMonetary({
        maxPrecision: 4,
        allowedCurrencies: new Set<Currency>([Currency.EUR]),
        maxAmount: MAX_AMOUNT
      })
      foo: MonetaryDto
    }

    it('has errors if amount is higher than max amount', async () => {
      const dto = new MaxTest()

      dto.foo = new MonetaryDtoBuilder()
        .withAmount(MAX_AMOUNT + 1)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(1)
    })

    it('has no errors if amount is equal to max amount', async () => {
      const dto = new MaxTest()

      dto.foo = new MonetaryDtoBuilder()
        .withAmount(MAX_AMOUNT)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(0)
    })

    it('has no errors if amount is lower than max amount', async () => {
      const dto = new MaxTest()

      dto.foo = new MonetaryDtoBuilder()
        .withAmount(MAX_AMOUNT - 1)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(0)
    })
  })
})
