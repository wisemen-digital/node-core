import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";
import { MonetaryObject } from "./monetary.object.js";
import { Monetary } from "./monetary.js";

export class MonetaryDto<C extends string, P extends number> implements MonetaryObject<C, P> {
  @ApiProperty({ type: 'number', example: 499 })
  @IsInt()
  readonly amount: number

  @ApiProperty({ type: 'string', example: 'EUR' })
  @IsString()
  @IsNotEmpty()
  readonly currency: C

  @ApiProperty({ type: 'number', example: 2 })
  @IsInt()
  readonly precision: P

  constructor (monetary: Monetary<C, P>) {
    this.amount = monetary.amount
    this.currency = monetary.currency
    this.precision = monetary.precision
  }
}
