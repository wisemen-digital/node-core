import { IsObject, ValidateBy, ValidateNested, ValidatorConstraintInterface } from 'class-validator'
import { applyDecorators } from '@nestjs/common'
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments.js'
import { Type } from 'class-transformer'
import { Currency } from './currency.enum.js'
import { MonetaryDto } from './monetary.dto.js'

export interface IsMonetaryOptions {
  maxPrecision?: number
  allowedCurrencies?: Set<Currency>
  minAmount?: number
  maxAmount?: number
}

export function IsMonetary (options?: IsMonetaryOptions): PropertyDecorator {
  return applyDecorators(
    IsObject(),
    ValidateNested(),
    Type(() => MonetaryDto),
    ValidateBy({
      name: 'IsMonetaryCurrency',
      validator: new IsMonetaryCurrencyValidator(options?.allowedCurrencies)
    }),
    ValidateBy({
      name: 'IsMonetaryPrecision',
      validator: new IsMonetaryPrecisionValidator(options?.maxPrecision ?? Infinity)
    }),
    ValidateBy({
      name: 'IsMonetaryMinAmount',
      validator: new IsMonetaryMinAmountValidator(options?.minAmount)
    }),
    ValidateBy({
      name: 'IsMonetaryMaxAmount',
      validator: new IsMonetaryMaxAmountValidator(options?.maxAmount)
    })
  )
}

class IsMonetaryCurrencyValidator implements ValidatorConstraintInterface {
  constructor (
    private allowedCurrencies?: Set<Currency>
  ) {}

  validate (monetaryDto: MonetaryDto | null | undefined): boolean {
    if (monetaryDto == null) {
      return false
    }

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

  validate (monetaryDto: MonetaryDto | null | undefined): boolean {
    if (monetaryDto == null) {
      return false
    }

    return monetaryDto.precision <= this.maxPrecision
  }

  defaultMessage (validationArguments?: ValidationArguments): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return `Monetary precision ${validationArguments?.value?.precision} must be <= ${this.maxPrecision}`
  }
}
class IsMonetaryMinAmountValidator implements ValidatorConstraintInterface {
  constructor (
    private lowestAmount?: number
  ) {}

  validate (monetaryDto: MonetaryDto | null | undefined): boolean {
    if (monetaryDto == null) {
      return false
    }
    if (this.lowestAmount === undefined) {
      return true
    }

    return monetaryDto.amount >= this.lowestAmount
  }

  defaultMessage (validationArguments?: ValidationArguments): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return `Monetary amount ${validationArguments?.value?.amount} must be >= ${this.lowestAmount}`
  }
}

class IsMonetaryMaxAmountValidator implements ValidatorConstraintInterface {
  constructor (
    private highestAmount?: number
  ) {}

  validate (monetaryDto: MonetaryDto | null | undefined): boolean {
    if (monetaryDto == null) {
      return false
    }

    if (this.highestAmount === undefined) {
      return true
    }

    return monetaryDto.amount <= this.highestAmount
  }

  defaultMessage (validationArguments?: ValidationArguments): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return `Monetary amount ${validationArguments?.value?.amount} must be <= ${this.highestAmount}`
  }
}
