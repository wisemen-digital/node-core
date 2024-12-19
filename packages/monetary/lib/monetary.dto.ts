import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { MonetaryObject } from "./monetary.object.js";
import { Monetary } from "./monetary.js";

export class MonetaryDto implements MonetaryObject<string, number> {
  @ApiProperty({ type: 'number', example: 499 })
  @IsInt()
  readonly amount: number

  @ApiProperty({ type: 'string', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  readonly currency: string

  @ApiProperty({ type: 'number', example: 2 })
  @IsInt()
  readonly precision: number

  constructor(monetary: Monetary<string, number>) {
    this.amount = monetary.amount
    this.currency = monetary.currency
    this.precision = monetary.precision
  }
}
