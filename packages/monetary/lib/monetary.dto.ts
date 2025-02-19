import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";
import { Monetary } from "./monetary.js";
import { Currency, CurrencyApiProperty } from './currency.enum.js'

export class MonetaryDto {
  @ApiProperty({ type: 'integer', example: 499 })
  @IsInt()
  readonly amount: number

  @CurrencyApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly currency: Currency

  @ApiProperty({ type: 'integer', example: 2 })
  @IsInt()
  readonly precision: number

  constructor (monetary: Monetary) {
    this.amount = monetary.amount
    this.currency = monetary.currency
    this.precision = monetary.precision
  }
}
