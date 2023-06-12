import type {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments
} from 'class-validator'
import {
  Validate,
  ValidatorConstraint
} from 'class-validator'

/**
 * Validate that the value passed the mod 97 check
 */
export function IsMod97 (validationOptions?: ValidationOptions): PropertyDecorator {
  return Validate(IsMod97Validator, validationOptions)
}

@ValidatorConstraint({ name: 'isMod97', async: false })
class IsMod97Validator implements ValidatorConstraintInterface {
  validate (value: unknown, _args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false
    if (value.replace(/[^0-9]/g, '').length !== 12) return false

    const codeToValidate = value.slice(0, 10)
    const controlNumber = value.slice(10)

    return (BigInt(codeToValidate) % 97n) === BigInt(controlNumber)
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} failed the mod 97 check`
  }
}
