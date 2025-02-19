import type {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments
} from 'class-validator'
import {
  Validate,
  ValidatorConstraint
} from 'class-validator'

const MOD97 = 97

/**
 * Validate that the value passed the mod 97 check
 */
export function IsValidPluxeeCustomerId (validationOptions?: ValidationOptions): PropertyDecorator {
  return Validate(IsPluxeeCustomerIdValidator, validationOptions)
}

@ValidatorConstraint({ name: 'isValidPluxeeCustomerId', async: false })
class IsPluxeeCustomerIdValidator implements ValidatorConstraintInterface {
  validate (value: unknown, _args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false
    if (value.replace(/[^0-9]/g, '').length !== 12) return false

    const baseNumber = Number(value.slice(0, 10))
    const checkSum = Number(value.slice(10))

    const remainder = baseNumber % MOD97

    return remainder > 0
      ? remainder === checkSum
      : remainder === checkSum % MOD97
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} failed the IsPluxeeCustomerIdValidator check`
  }
}
