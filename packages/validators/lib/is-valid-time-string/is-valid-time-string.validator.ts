import type {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments
} from 'class-validator'
import {
  Validate,
  ValidatorConstraint
} from 'class-validator'
import { Time } from '@wisemen/time'

/**
   * Validate that the value is a string with format hh:mm
   */
export function IsValidTimeString (validationOptions?: ValidationOptions): PropertyDecorator {
  return Validate(IsValidTimeStringValidator, validationOptions)
}

@ValidatorConstraint({ name: 'isValidTimeString', async: false })
export class IsValidTimeStringValidator implements ValidatorConstraintInterface {
  validate (timeString: unknown, _args: ValidationArguments): boolean {
    if (typeof timeString !== 'string') return false

    return Time.isValidTimeString(`${timeString}:00`)
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} must be a date string of format hh:mm`
  }
}
