import { IsObject, ValidateBy, ValidateNested, ValidatorConstraintInterface } from "class-validator";
import { Type } from "class-transformer";
import { applyDecorators } from "@nestjs/common";
import { MonetaryDto } from "./monetary.dto.js";
import { Currency } from './currency.enum.js'
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments.js'

export interface IsMonetaryOptions {
  maxPrecision?: number,
  allowedCurrencies?: Set<Currency>
}

export function IsMonetary(options?: IsMonetaryOptions): PropertyDecorator {
  return applyDecorators(
    Type(() => MonetaryDto),
    IsObject(),
    ValidateNested(),
    ValidateBy({
      name: 'IsMonetaryCurrency',
      validator: new IsMonetaryCurrencyValidator(options?.allowedCurrencies),
    }),
    ValidateBy({
      name: 'IsMonetaryPrecision',
      validator: new IsMonetaryPrecisionValidator(options?.maxPrecision ?? Infinity),
    })
  )
}

class IsMonetaryCurrencyValidator implements ValidatorConstraintInterface {
  constructor (
    private allowedCurrencies?: Set<Currency>
  ) {}

  validate (monetaryDto: MonetaryDto): boolean {
    return this.allowedCurrencies === undefined
      || this.allowedCurrencies.has(monetaryDto.currency)
  }

  defaultMessage (validationArguments?: ValidationArguments): string {
    return `Monetary currency ${validationArguments?.value} is not allowed`
  }
}

class IsMonetaryPrecisionValidator implements ValidatorConstraintInterface {
  constructor (
    private maxPrecision: number
  ) {}

  validate (monetaryDto: object): boolean {
    if(!Object.hasOwn(monetaryDto,'amount')) {
      return false
    }

    if(typeof (monetaryDto as {amount: unknown}) !== 'number'){
      return false
    }

    return (monetaryDto as {amount: number}).amount <= this.maxPrecision
  }

  defaultMessage (validationArguments?: ValidationArguments): string {
    return `Monetary precision ${validationArguments?.value} must be <= ${this.maxPrecision}`
  }
}

