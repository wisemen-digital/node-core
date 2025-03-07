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

  static from (monetary: Monetary): MonetaryDto {
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
