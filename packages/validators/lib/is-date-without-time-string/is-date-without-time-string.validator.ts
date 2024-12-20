import type {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments
} from 'class-validator'
import {
  Validate,
  ValidatorConstraint
} from 'class-validator'
import dayjs from 'dayjs'

/**
   * Validate that the value is a string with format hh:mm:ss
   */
export function IsDateWithoutTimeString (validationOptions?: ValidationOptions): PropertyDecorator {
  return Validate(IsDateWithoutTimeStringValidator, validationOptions)
}

@ValidatorConstraint({ name: 'isDateWithoutTimeString', async: false })
export class IsDateWithoutTimeStringValidator implements ValidatorConstraintInterface {
  validate (dateString: unknown, _args: ValidationArguments): boolean {
    if (typeof dateString !== 'string') return false

    const regex = /^\d{4}-\d{2}-\d{2}$/

    if (!regex.test(dateString)) return false

    return dayjs(dateString, 'YYYY-MM-DD').isValid()
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} must be a date string of format YYYY-MM-DD`
  }
}
