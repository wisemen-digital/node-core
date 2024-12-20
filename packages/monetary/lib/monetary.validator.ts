import { IsObject, ValidateBy, ValidateNested, ValidatorConstraintInterface } from "class-validator";
import { Type } from "class-transformer";
import { applyDecorators } from "@nestjs/common";
import { MonetaryDto } from "./monetary.dto.js";

export function IsMonetary <C extends string, P extends number> (currency: C, precision: P): PropertyDecorator {
  return applyDecorators(
    IsObject(),
    ValidateNested(),
    Type(() => MonetaryDto),
    ValidateBy({
      name: 'IsMonetary',
      validator: new IsMonetaryValidator(currency, precision),
    })
  )
}

class IsMonetaryValidator <C extends string, P extends number> implements ValidatorConstraintInterface {
  constructor (private currency: C, private precision: P) {}

  validate (monetaryDto: MonetaryDto<C, P>): boolean {
    return monetaryDto.currency === this.currency && monetaryDto.precision === this.precision
  }

  defaultMessage (): string {
    return `MonetaryDto must have currency ${this.currency} and precision ${this.precision}`
  }
}
