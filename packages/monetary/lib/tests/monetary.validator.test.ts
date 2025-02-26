import { describe, it } from 'node:test'
import { MonetaryDto, MonetaryDtoBuilder } from '../monetary.dto.js'
import { IsMonetary } from '../monetary.validator.js'
import { Currency } from '../currency.enum.js'
import { IsObject, validate, ValidateNested } from 'class-validator'
import { expect } from 'expect'
import { Type } from 'class-transformer'

describe('Monetary validator tests', () => {
  class Test {
    @IsMonetary({maxPrecision: 4, allowedCurrencies: new Set<Currency>([Currency.EUR])})
    foo: MonetaryDto
  }

  it('does not have errors for a valid object', async () => {
    const dto = new Test()
    dto.foo = new MonetaryDtoBuilder().build()

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    })

    expect(errors).toHaveLength(0)
  })
})
