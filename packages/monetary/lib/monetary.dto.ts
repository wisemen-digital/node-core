import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt } from 'class-validator'
import { Currency, CurrencyApiProperty } from './currency.enum.js'
import { Monetary } from './monetary.js'

export class MonetaryDto {
  @ApiProperty({ type: 'integer', example: 499 })
  @IsInt()
  amount: number

  @CurrencyApiProperty()
  @IsEnum(Currency)
  currency: Currency

  @ApiProperty({ type: 'integer', example: 2 })
  @IsInt()
  precision: number

  static from (monetary: undefined): undefined
  static from (monetary: null): null
  static from (monetary: Monetary): MonetaryDto
  static from (monetary: undefined | null): undefined | null
  static from (monetary: Monetary | null): MonetaryDto | null
  static from (monetary: Monetary | undefined): MonetaryDto | undefined
  static from (monetary: Monetary | null | undefined): MonetaryDto | null | undefined
  static from (monetary: Monetary | null | undefined): MonetaryDto | null | undefined {
    if (monetary === null) return null
    if (monetary === undefined) return undefined

    return new MonetaryDtoBuilder()
      .withAmount(monetary.amount)
      .withCurrency(monetary.currency)
      .withPrecision(monetary.precision)
      .build()
  }

  parse (): Monetary {
    return new Monetary(this)
  }
}

export class MonetaryDtoBuilder {
  private readonly dto: MonetaryDto

  constructor () {
    this.dto = new MonetaryDto()
    this.dto.amount = 0
    this.dto.currency = Currency.EUR
    this.dto.precision = 4
  }

  withAmount (amount: number): this {
    this.dto.amount = amount

    return this
  }

  withCurrency (currency: Currency): this {
    this.dto.currency = currency

    return this
  }

  withPrecision (precision: number): this {
    this.dto.precision = precision

    return this
  }

  build (): MonetaryDto {
    return this.dto
  }
}
