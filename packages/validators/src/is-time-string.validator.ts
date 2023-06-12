import type {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments
} from 'class-validator'
import {
  Validate,
  ValidatorConstraint, matches
} from 'class-validator'

/**
 * Validate that the value is a string with format hh:mm:ss
 */
export function IsTimeString (validationOptions?: ValidationOptions): PropertyDecorator {
  return Validate(IsTimeStringValidator, validationOptions)
}

@ValidatorConstraint({ name: 'isTimeString', async: false })
class IsTimeStringValidator implements ValidatorConstraintInterface {
  validate (timeString: unknown, _args: ValidationArguments): boolean {
    if (typeof timeString !== 'string') return false
    return matches(timeString, /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} must be a time string of format hh:mm:ss!`
  }
}
