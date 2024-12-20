import type {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments
} from 'class-validator'
import {
  Validate,
  ValidatorConstraint
} from 'class-validator'

export function IsRRN (validationOptions?: ValidationOptions): PropertyDecorator {
  return Validate(IsRRNValidator, validationOptions)
}

@ValidatorConstraint({ name: 'isRRN', async: false })
class IsRRNValidator implements ValidatorConstraintInterface {
  validate (rrn: unknown, _args: ValidationArguments): boolean {
    if (typeof rrn !== 'string') return false
    if (rrn.length !== 11) return false

    let number = parseInt(rrn.substring(0, 9))
    const controlNumber = parseInt(rrn.substring(9, 11))

    let result = validateRRN(number, controlNumber)

    if (!result) {
      number += 2000000000
      result = validateRRN(number, controlNumber)
    }

    return result
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} must be a string of format 90020199704`
  }
}

const validateRRN = (number: number, controlNumber: number): boolean => {
  return 97 - (number % 97) === controlNumber
}
